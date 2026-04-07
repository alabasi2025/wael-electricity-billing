// =============================================
// محرك الفوترة الكهربائية
// بديل: ftora.fmb + thoel.fmb + sndk22.fmb
// يحتوي: احتساب الشرائح + إصدار فواتير + ترحيل + سداد
// =============================================
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  TariffPlanEntity, TariffTierEntity, BillingCycleEntity,
  BillingInvoiceEntity, BillingInvoiceItemEntity, BillingPostingEntity,
} from './entities/billing.entity';
import { MeterReadingEntity } from '../meter-readings/entities/meter-reading.entity';
import { ElectricitySubscriberEntity } from '../subscribers/entities/electricity-subscriber.entity';
import { CreateTariffPlanDto, GenerateBillingDto, PostBillingDto, RecordPaymentDto } from './dto';

@Injectable()
export class BillingEngineService {
  private readonly logger = new Logger(BillingEngineService.name);

  constructor(
    @InjectRepository(TariffPlanEntity) private readonly tariffRepo: Repository<TariffPlanEntity>,
    @InjectRepository(TariffTierEntity) private readonly tierRepo: Repository<TariffTierEntity>,
    @InjectRepository(BillingCycleEntity) private readonly cycleRepo: Repository<BillingCycleEntity>,
    @InjectRepository(BillingInvoiceEntity) private readonly invoiceRepo: Repository<BillingInvoiceEntity>,
    @InjectRepository(BillingInvoiceItemEntity) private readonly itemRepo: Repository<BillingInvoiceItemEntity>,
    @InjectRepository(BillingPostingEntity) private readonly postingRepo: Repository<BillingPostingEntity>,
    @InjectRepository(MeterReadingEntity) private readonly readingRepo: Repository<MeterReadingEntity>,
    @InjectRepository(ElectricitySubscriberEntity) private readonly subRepo: Repository<ElectricitySubscriberEntity>,
    private readonly dataSource: DataSource,
  ) {}

  // ══════════════════════════════════════════
  // التعرفة
  // ══════════════════════════════════════════

  async createTariff(dto: CreateTariffPlanDto) {
    const tariff = this.tariffRepo.create({
      name: dto.name,
      billingType: dto.billingType || 'ampere',
      unitPrice: dto.unitPrice,
      minCharge: dto.minCharge || 0,
      fixedFee: dto.fixedFee || 0,
      taxRate: dto.taxRate || 0,
      serviceFee: dto.serviceFee || 0,
      effectiveFrom: dto.effectiveFrom as any,
      effectiveTo: dto.effectiveTo as any,
      notes: dto.notes,
    });
    const saved = await this.tariffRepo.save(tariff);

    if (dto.tiers?.length) {
      const tiers = dto.tiers.map(t => this.tierRepo.create({ ...t, tariffId: saved.id }));
      await this.tierRepo.save(tiers);
    }

    return { data: await this.tariffRepo.findOne({ where: { id: saved.id }, relations: ['tiers'] }), message: 'تم إنشاء التعرفة' };
  }

  async findAllTariffs() {
    return { data: await this.tariffRepo.find({ relations: ['tiers'], order: { id: 'ASC' } }) };
  }

  // ══════════════════════════════════════════
  // حساب مبلغ الاستهلاك بالشرائح (دالة SAR_K)
  // ══════════════════════════════════════════

  calculateConsumptionAmount(consumption: number, tariff: TariffPlanEntity): number {
    if (!tariff.tiers || tariff.tiers.length === 0) {
      return consumption * +tariff.unitPrice;
    }

    // ─── حساب بالشرائح (كما في SAR_K القديمة) ───
    const sortedTiers = [...tariff.tiers].sort((a, b) => a.tierOrder - b.tierOrder);
    let remaining = consumption;
    let totalAmount = 0;

    for (const tier of sortedTiers) {
      if (remaining <= 0) break;
      const tierMax = tier.toUnits ? +tier.toUnits - +tier.fromUnits : remaining;
      const unitsInTier = Math.min(remaining, tierMax);
      totalAmount += unitsInTier * +tier.pricePerUnit;
      remaining -= unitsInTier;
    }

    return Math.round(totalAmount * 100) / 100;
  }

  // ══════════════════════════════════════════
  // إصدار الفوترة الشهرية (ftora.fmb)
  // ══════════════════════════════════════════

  async generateBilling(dto: GenerateBillingDto, userId?: number) {
    // ─── التحقق من عدم التكرار ───
    const existing = await this.cycleRepo.findOne({
      where: { billingMonth: dto.billingMonth, billingYear: dto.billingYear, groupId: dto.groupId },
    });
    if (existing) throw new BadRequestException(`فوترة الشهر ${dto.billingMonth}/${dto.billingYear} موجودة مسبقاً`);

    // ─── جلب القراءات المؤكدة من الدورة ───
    const readingQb = this.readingRepo.createQueryBuilder('r')
      .where('r.cycleId = :cid AND r.status = 1', { cid: dto.readingCycleId });
    const readings = await readingQb.getMany();

    if (!readings.length) throw new BadRequestException('لا توجد قراءات مؤكدة في هذه الدورة');

    // ─── جلب التعرفة ───
    let tariff: TariffPlanEntity = null;
    if (dto.tariffId) {
      tariff = await this.tariffRepo.findOne({ where: { id: dto.tariffId }, relations: ['tiers'] });
    }
    if (!tariff) {
      tariff = await this.tariffRepo.findOne({ where: { isActive: true }, relations: ['tiers'], order: { id: 'DESC' } });
    }

    // ─── إنشاء دورة الفوترة ───
    const cycleName = `فوترة ${dto.billingMonth}/${dto.billingYear}`;
    const billingCycle = this.cycleRepo.create({
      cycleName,
      billingMonth: dto.billingMonth,
      billingYear: dto.billingYear,
      readingCycleId: dto.readingCycleId,
      groupId: dto.groupId,
      createdBy: userId,
    });
    const savedCycle = await this.cycleRepo.save(billingCycle);

    // ─── توليد رقم فاتورة ───
    const maxInv = await this.invoiceRepo.createQueryBuilder('i')
      .select('MAX(i.invoiceNo)', 'max').getRawOne();
    let nextInvoiceNo = (maxInv?.max || 0) + 1;

    // ─── إنشاء فاتورة لكل مشترك ───
    const invoices: BillingInvoiceEntity[] = [];
    let totalAmount = 0;

    for (const reading of readings) {
      const sub = await this.subRepo.findOne({ where: { noa: reading.subscriberNoa } });
      const consumption = +reading.netConsumption || +reading.consumption || 0;

      // ─── حساب المبلغ ───
      const consumptionAmount = tariff
        ? this.calculateConsumptionAmount(consumption, tariff)
        : consumption * (+sub?.unitPrice || 0);

      const fixedFees = tariff ? +tariff.fixedFee : (+sub?.monthlyFee || 0);
      const serviceFees = tariff ? +tariff.serviceFee : 0;
      const subtotal = consumptionAmount + fixedFees + serviceFees;
      const taxAmount = tariff ? subtotal * (+tariff.taxRate / 100) : 0;
      const discount = 0;
      const invoiceTotal = subtotal + taxAmount - discount;
      const prevBalance = +sub?.balance || 0;
      const grandTotal = invoiceTotal + prevBalance;

      // ─── ضمان الحد الأدنى ───
      const minCharge = tariff ? +tariff.minCharge : (+sub?.minAmount || 0);
      const finalTotal = Math.max(invoiceTotal, minCharge);

      const invoice = this.invoiceRepo.create({
        invoiceNo: nextInvoiceNo++,
        invoiceSeq: invoices.length + 1,
        billingCycleId: savedCycle.id,
        subscriberId: reading.subscriberId,
        subscriberNoa: reading.subscriberNoa,
        subscriberName: sub?.namea,
        readingId: reading.id,
        prevReading: reading.prevReading,
        currReading: reading.currReading,
        consumption,
        unitPrice: tariff?.unitPrice || sub?.unitPrice || 0,
        consumptionAmount,
        fixedFees,
        serviceFees,
        taxAmount: Math.round(taxAmount * 100) / 100,
        discountAmount: discount,
        totalAmount: Math.round(finalTotal * 100) / 100,
        previousBalance: prevBalance,
        grandTotal: Math.round((finalTotal + prevBalance) * 100) / 100,
        invoiceDate: new Date(),
        tariffId: tariff?.id,
        status: 0, // مسودة
        remainingAmount: Math.round((finalTotal + prevBalance) * 100) / 100,
        createdBy: userId,
      });

      invoices.push(invoice);
      totalAmount += finalTotal;

      // ─── تحديث حالة القراءة ───
      reading.status = 3; // مفوتر
      await this.readingRepo.save(reading);
    }

    // ─── حفظ الفواتير ───
    const savedInvoices = await this.invoiceRepo.save(invoices);

    // ─── إنشاء بنود لكل فاتورة ───
    for (const inv of savedInvoices) {
      const items = [
        this.itemRepo.create({ invoiceId: inv.id, itemType: 'consumption', description: 'استهلاك الكهرباء', amount: inv.consumptionAmount, quantity: inv.consumption, unitPrice: inv.unitPrice, itemOrder: 1 }),
      ];
      if (+inv.fixedFees > 0) items.push(this.itemRepo.create({ invoiceId: inv.id, itemType: 'fixed_fee', description: 'رسوم ثابتة', amount: inv.fixedFees, itemOrder: 2 }));
      if (+inv.serviceFees > 0) items.push(this.itemRepo.create({ invoiceId: inv.id, itemType: 'service', description: 'رسوم خدمة', amount: inv.serviceFees, itemOrder: 3 }));
      if (+inv.taxAmount > 0) items.push(this.itemRepo.create({ invoiceId: inv.id, itemType: 'tax', description: 'ضريبة', amount: inv.taxAmount, itemOrder: 4 }));
      await this.itemRepo.save(items);
    }

    // ─── تحديث دورة الفوترة ───
    savedCycle.totalInvoices = savedInvoices.length;
    savedCycle.totalAmount = Math.round(totalAmount * 100) / 100;
    savedCycle.status = 1;
    savedCycle.completedAt = new Date();
    await this.cycleRepo.save(savedCycle);

    return {
      data: {
        cycle: savedCycle,
        invoicesCount: savedInvoices.length,
        totalAmount: Math.round(totalAmount * 100) / 100,
      },
      message: `✅ تم إصدار ${savedInvoices.length} فاتورة بإجمالي ${Math.round(totalAmount).toLocaleString()}`,
    };
  }

  // ══════════════════════════════════════════
  // ترحيل الفوترة (thoel.fmb)
  // ══════════════════════════════════════════

  async postBilling(dto: PostBillingDto, userId?: number) {
    const cycle = await this.cycleRepo.findOne({ where: { id: dto.billingCycleId } });
    if (!cycle) throw new NotFoundException('دورة الفوترة غير موجودة');
    if (cycle.status === 2) throw new BadRequestException('الدورة مرحّلة بالفعل');

    const invoices = await this.invoiceRepo.find({
      where: { billingCycleId: cycle.id, status: 0 },
    });
    if (!invoices.length) throw new BadRequestException('لا توجد فواتير للترحيل');

    const maxPosting = await this.postingRepo.createQueryBuilder('p')
      .select('MAX(p.postingNo)', 'max').getRawOne();
    let nextPostingNo = (maxPosting?.max || 0) + 1;

    const postings: BillingPostingEntity[] = [];

    for (const inv of invoices) {
      // ─── إنشاء قيد الترحيل ───
      const posting = this.postingRepo.create({
        postingNo: nextPostingNo++,
        postingDate: new Date(),
        billingCycleId: cycle.id,
        invoiceId: inv.id,
        debitAccount: dto.debitAccount || inv.subscriberNoa,
        creditAccount: dto.creditAccount || 13001,
        amount: +inv.totalAmount,
        description: `ترحيل فاتورة ${inv.invoiceNo} - ${inv.subscriberName}`,
        postedBy: userId,
        status: 1,
        postedAt: new Date(),
      });
      postings.push(posting);

      // ─── تحديث حالة الفاتورة ───
      inv.status = 2; // مرحّلة

      // ─── تحديث رصيد المشترك ───
      const sub = await this.subRepo.findOne({ where: { noa: inv.subscriberNoa } });
      if (sub) {
        sub.balance = +sub.balance + +inv.totalAmount;
        await this.subRepo.save(sub);
      }
    }

    await this.postingRepo.save(postings);
    await this.invoiceRepo.save(invoices);

    cycle.status = 2;
    await this.cycleRepo.save(cycle);

    return {
      data: { postingsCount: postings.length, totalPosted: postings.reduce((s, p) => s + +p.amount, 0) },
      message: `✅ تم ترحيل ${postings.length} فاتورة`,
    };
  }

  // ══════════════════════════════════════════
  // تسجيل السداد (SNDK22)
  // ══════════════════════════════════════════

  async recordPayment(dto: RecordPaymentDto, userId?: number) {
    const invoice = await this.invoiceRepo.findOne({ where: { id: dto.invoiceId } });
    if (!invoice) throw new NotFoundException('الفاتورة غير موجودة');
    if (invoice.status === 4) throw new BadRequestException('الفاتورة مسددة بالكامل');

    // ─── تحديث الفاتورة ───
    invoice.paidAmount = +invoice.paidAmount + dto.amount;
    invoice.remainingAmount = +invoice.grandTotal - +invoice.paidAmount;
    invoice.status = invoice.remainingAmount <= 0 ? 4 : 3;
    await this.invoiceRepo.save(invoice);

    // ─── تحديث رصيد المشترك ───
    const sub = await this.subRepo.findOne({ where: { noa: invoice.subscriberNoa } });
    if (sub) {
      sub.balance = +sub.balance - dto.amount;
      await this.subRepo.save(sub);
    }

    return {
      data: { invoiceNo: invoice.invoiceNo, paidAmount: invoice.paidAmount, remaining: invoice.remainingAmount, status: invoice.status },
      message: `✅ تم تسجيل سداد ${dto.amount.toLocaleString()} للفاتورة ${invoice.invoiceNo}`,
    };
  }

  // ══════════════════════════════════════════
  // الاستعلامات والتقارير
  // ══════════════════════════════════════════

  async findAllBillingCycles() {
    return { data: await this.cycleRepo.find({ order: { billingYear: 'DESC', billingMonth: 'DESC' } }) };
  }

  async findInvoicesBySubscriber(noa: number) {
    const invoices = await this.invoiceRepo.find({
      where: { subscriberNoa: noa },
      order: { invoiceDate: 'DESC' },
    });
    return { data: invoices };
  }

  async findUnpaidInvoices(noa?: number) {
    const qb = this.invoiceRepo.createQueryBuilder('i')
      .where('i.status < 4 AND i.remainingAmount > 0');
    if (noa) qb.andWhere('i.subscriberNoa = :noa', { noa });
    qb.orderBy('i.invoiceDate', 'ASC');
    const data = await qb.getMany();
    const totalUnpaid = data.reduce((s, i) => s + +i.remainingAmount, 0);
    return { data, totalCount: data.length, totalUnpaid };
  }

  async getBillingStats() {
    const totalCycles = await this.cycleRepo.count();
    const totalInvoices = await this.invoiceRepo.count();

    const amounts = await this.invoiceRepo.createQueryBuilder('i')
      .select('SUM(i.totalAmount)', 'totalBilled')
      .addSelect('SUM(i.paidAmount)', 'totalPaid')
      .addSelect('SUM(i.remainingAmount)', 'totalUnpaid')
      .addSelect('COUNT(CASE WHEN i.status = 4 THEN 1 END)', 'paidInvoices')
      .addSelect('COUNT(CASE WHEN i.status < 4 AND i.remainingAmount > 0 THEN 1 END)', 'unpaidInvoices')
      .getRawOne();

    return {
      data: {
        totalCycles,
        totalInvoices,
        totalBilled: +amounts?.totalBilled || 0,
        totalPaid: +amounts?.totalPaid || 0,
        totalUnpaid: +amounts?.totalUnpaid || 0,
        paidInvoices: +amounts?.paidInvoices || 0,
        unpaidInvoices: +amounts?.unpaidInvoices || 0,
        collectionRate: amounts?.totalBilled > 0
          ? Math.round((+amounts.totalPaid / +amounts.totalBilled) * 100) : 0,
      },
    };
  }
}
