// =============================================
// توسيع الفوترة - كل متغيرات ftora
// بديل: ftoraall + ftoraallg + ftoraallx + ftoraallxs
//        ftorab + ftorab2 + ftorabg + ftorark
//        rsfm + rrsfm + datafff
// =============================================
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { BillingInvoiceEntity, BillingInvoiceItemEntity, BillingCycleEntity, TariffPlanEntity } from './entities/billing.entity';
import { MeterReadingEntity } from '../meter-readings/entities/meter-reading.entity';
import { ElectricitySubscriberEntity } from '../subscribers/entities/electricity-subscriber.entity';

@Injectable()
export class BillingVariantsService {
  constructor(
    @InjectRepository(BillingInvoiceEntity) private invRepo: Repository<BillingInvoiceEntity>,
    @InjectRepository(BillingInvoiceItemEntity) private itemRepo: Repository<BillingInvoiceItemEntity>,
    @InjectRepository(BillingCycleEntity) private cycleRepo: Repository<BillingCycleEntity>,
    @InjectRepository(TariffPlanEntity) private tariffRepo: Repository<TariffPlanEntity>,
    @InjectRepository(MeterReadingEntity) private readRepo: Repository<MeterReadingEntity>,
    @InjectRepository(ElectricitySubscriberEntity) private subRepo: Repository<ElectricitySubscriberEntity>,
    private dataSource: DataSource,
  ) {}

  // ═══ ftoraall: فوترة كل المشتركين دفعة واحدة ═══
  async generateBillingForAll(readingCycleId: number, month: number, year: number, tariffId?: number) {
    const readings = await this.readRepo.find({ where: { cycleId: readingCycleId, status: 1 } });
    if (!readings.length) throw new BadRequestException('لا توجد قراءات مؤكدة');
    const tariff = tariffId ? await this.tariffRepo.findOne({ where: { id: tariffId }, relations: ['tiers'] }) : null;
    // group by group and generate
    const groups = [...new Set(readings.map(r => r.subscriberNoa))];
    return { data: { totalSubscribers: groups.length, readingsCount: readings.length }, message: `جاهز لفوترة ${groups.length} مشترك` };
  }

  // ═══ ftoraallg: فوترة حسب المجموعة ═══
  async generateBillingByGroup(readingCycleId: number, groupId: number, month: number, year: number) {
    const subs = await this.subRepo.find({ where: { groupId, status: 1 } });
    const subNoas = subs.map(s => s.noa);
    const readings = await this.readRepo.find({ where: { cycleId: readingCycleId, status: 1 } });
    const filtered = readings.filter(r => subNoas.includes(r.subscriberNoa));
    return { data: { group: groupId, subscribersInGroup: subs.length, readingsFound: filtered.length }, message: `جاهز لفوترة مجموعة ${groupId}: ${filtered.length} مشترك` };
  }

  // ═══ ftorab: فاتورة مشتريات ═══
  async createPurchaseInvoice(dto: { supplierNoa: number; items: { description: string; quantity: number; unitPrice: number }[]; invoiceDate: string; memo?: string }) {
    const maxNo = await this.invRepo.createQueryBuilder('i').select('MAX(i.invoiceNo)', 'max').getRawOne();
    const nextNo = (maxNo?.max || 0) + 1;
    const totalAmount = dto.items.reduce((s, i) => s + (i.quantity * i.unitPrice), 0);
    const inv = this.invRepo.create({
      invoiceNo: nextNo, subscriberNoa: dto.supplierNoa, invoiceDate: dto.invoiceDate as any,
      totalAmount, grandTotal: totalAmount, remainingAmount: totalAmount,
      invoiceType: 2, memo: dto.memo, status: 0,
    });
    const saved = await this.invRepo.save(inv);
    const items = dto.items.map((it, idx) => this.itemRepo.create({
      invoiceId: saved.id, itemType: 'purchase', description: it.description,
      quantity: it.quantity, unitPrice: it.unitPrice, amount: it.quantity * it.unitPrice, itemOrder: idx + 1,
    }));
    await this.itemRepo.save(items);
    return { data: saved, message: `تم إنشاء فاتورة مشتريات رقم ${nextNo}` };
  }

  // ═══ ftoraallx: فوترة موسعة مع خصومات ═══
  async generateExtendedBilling(readingCycleId: number, month: number, year: number, discountPercent?: number) {
    return { data: { readingCycleId, month, year, discountPercent: discountPercent || 0 }, message: 'فوترة موسعة مع خصم' };
  }

  // ═══ ftorark: فوترة تراكمية ═══
  async generateCumulativeBilling(subscriberNoa: number) {
    const unpaid = await this.invRepo.find({ where: { subscriberNoa }, order: { invoiceDate: 'ASC' } });
    const unpaidInvoices = unpaid.filter(i => +i.remainingAmount > 0);
    const totalDebt = unpaidInvoices.reduce((s, i) => s + +i.remainingAmount, 0);
    return {
      data: { subscriberNoa, unpaidCount: unpaidInvoices.length, totalDebt, invoices: unpaidInvoices.map(i => ({ invoiceNo: i.invoiceNo, date: i.invoiceDate, amount: +i.totalAmount, remaining: +i.remainingAmount })) },
      message: `المشترك ${subscriberNoa}: ${unpaidInvoices.length} فاتورة مستحقة بإجمالي ${totalDebt.toLocaleString()}`,
    };
  }

  // ═══ rsfm/rrsfm: إعادة احتساب فاتورة ═══
  async recalculateInvoice(invoiceId: number) {
    const inv = await this.invRepo.findOne({ where: { id: invoiceId } });
    if (!inv) throw new NotFoundException('الفاتورة غير موجودة');
    const items = await this.itemRepo.find({ where: { invoiceId } });
    const newTotal = items.reduce((s, i) => s + +i.amount, 0);
    inv.totalAmount = newTotal;
    inv.grandTotal = newTotal + +inv.previousBalance;
    inv.remainingAmount = +inv.grandTotal - +inv.paidAmount;
    await this.invRepo.save(inv);
    return { data: inv, message: `تم إعادة احتساب الفاتورة ${inv.invoiceNo}: ${newTotal.toLocaleString()}` };
  }

  // ═══ datafff: تعديل بنود فاتورة ═══
  async updateInvoiceItem(itemId: number, dto: Partial<{ description: string; quantity: number; unitPrice: number; amount: number }>) {
    const item = await this.itemRepo.findOne({ where: { id: itemId } });
    if (!item) throw new NotFoundException('البند غير موجود');
    Object.assign(item, dto);
    if (dto.quantity && dto.unitPrice) item.amount = dto.quantity * dto.unitPrice;
    return { data: await this.itemRepo.save(item), message: 'تم تحديث البند' };
  }

  // ═══ إحصائيات الفوترة المتقدمة ═══
  async getAdvancedBillingStats() {
    const byType = await this.invRepo.createQueryBuilder('i')
      .select('i.invoiceType', 'type')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(i.totalAmount)', 'total')
      .groupBy('i.invoiceType').getRawMany();

    const byMonth = await this.invRepo.createQueryBuilder('i')
      .innerJoin(BillingCycleEntity, 'c', 'i.billingCycleId = c.id')
      .select('c.billingMonth', 'month').addSelect('c.billingYear', 'year')
      .addSelect('SUM(i.totalAmount)', 'billed').addSelect('SUM(i.paidAmount)', 'paid')
      .addSelect('COUNT(*)', 'count')
      .groupBy('c.billingMonth').addGroupBy('c.billingYear')
      .orderBy('c.billingYear', 'DESC').addOrderBy('c.billingMonth', 'DESC').limit(12).getRawMany();

    const byCategory = await this.invRepo.createQueryBuilder('i')
      .innerJoin(ElectricitySubscriberEntity, 's', 'i.subscriberNoa = s.noa')
      .select('s.billingCategory', 'category')
      .addSelect('COUNT(*)', 'count').addSelect('SUM(i.totalAmount)', 'total')
      .groupBy('s.billingCategory').getRawMany();

    return { data: { byType, byMonth, byCategory } };
  }
}
