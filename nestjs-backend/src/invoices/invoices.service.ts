// =============================================
// خدمة الفواتير (Invoices Service)
// =============================================
import {
  Injectable, NotFoundException, BadRequestException, Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual, DataSource } from 'typeorm';
import {
  SalesInvoiceEntity, SalesInvoiceDetailEntity,
  PurchaseInvoiceEntity, PurchaseInvoiceDetailEntity,
  
} from './entities/invoice.entity';
import { SubAccountEntity } from '../accounts/entities/account.entity';
import {
  CreateSalesInvoiceDto, UpdateSalesInvoiceDto,
  CreatePurchaseInvoiceDto, UpdatePurchaseInvoiceDto,
  InvoiceFilterDto,
} from './dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class InvoicesService {
  private readonly logger = new Logger(InvoicesService.name);

  constructor(
    @InjectRepository(SalesInvoiceEntity)
    private readonly salesRepo: Repository<SalesInvoiceEntity>,
    @InjectRepository(SalesInvoiceDetailEntity)
    private readonly salesDetailRepo: Repository<SalesInvoiceDetailEntity>,
    @InjectRepository(PurchaseInvoiceEntity)
    private readonly purchaseRepo: Repository<PurchaseInvoiceEntity>,
    @InjectRepository(PurchaseInvoiceDetailEntity)
    private readonly purchaseDetailRepo: Repository<PurchaseInvoiceDetailEntity>,
    @InjectRepository(SubAccountEntity)
    private readonly accountRepo: Repository<SubAccountEntity>,
    private readonly dataSource: DataSource,
  ) {}

  private getYearExpression(alias: string): string {
    const dbType = String((this.dataSource.options as any)?.type || '').toLowerCase();
    return dbType.includes('sqlite')
      ? `CAST(strftime('%Y', ${alias}.dates) AS INTEGER)`
      : `EXTRACT(YEAR FROM ${alias}.dates)`;
  }

  // ═══════════════════════════════════════════
  // فواتير المبيعات (FATM)
  // ═══════════════════════════════════════════

  // ─── إنشاء فاتورة مبيعات ───
  async createSales(dto: CreateSalesInvoiceDto, userId: number) {
    // جلب اسم العميل إن لم يُرسل
    if (!dto.namea && dto.noa) {
      const account = await this.accountRepo.findOne({ where: { noa: dto.noa } });
      if (account) dto.namea = account.namea;
    }

    // حساب الرقم التسلسلي
    const currentYear = new Date().getFullYear();
    const yearExpr = this.getYearExpression('inv');
    const lastInvoice = await this.salesRepo
      .createQueryBuilder('inv')
      .where(`${yearExpr} = :year`, { year: currentYear })
      .orderBy('inv.noson', 'DESC')
      .getOne();
    const noson = (lastInvoice?.noson || 0) + 1;

    // حساب المجموع
    const details = dto.details.map((d) => {
      const total = d.quantity * d.price;
      return { ...d, total };
    });
    const totals = details.reduce((sum, d) => sum + d.total, 0);

    // إنشاء الفاتورة
    const invoice = this.salesRepo.create({
      noson,
      dates: dto.dates as any,
      noa: dto.noa,
      namea: dto.namea,
      totals,
      notes: dto.notes,
      amr: 0,
      nousx: userId,
      details: details.map((d) =>
        this.salesDetailRepo.create({
          itemName: d.itemName,
          quantity: d.quantity,
          price: d.price,
          total: d.total,
          notes: d.notes,
        }),
      ),
    });

    const saved = await this.salesRepo.save(invoice);
    this.logger.log(`فاتورة مبيعات جديدة #${saved.nos} - ${totals} د.ع`);

    return {
      data: saved,
      message: `تم إنشاء فاتورة المبيعات رقم ${saved.nos} بمبلغ ${totals.toLocaleString()} د.ع`,
    };
  }

  // ─── جلب كل فواتير المبيعات ───
  async findAllSales(pagination: PaginationDto, filter?: InvoiceFilterDto) {
    const { page, pageSize, skip, sortBy, sortOrder, search } = pagination;

    const qb = this.salesRepo.createQueryBuilder('inv')
      .leftJoinAndSelect('inv.details', 'detail');

    // فلاتر
    if (filter?.from && filter?.to) {
      qb.andWhere('inv.dates BETWEEN :from AND :to', { from: filter.from, to: filter.to });
    } else if (filter?.from) {
      qb.andWhere('inv.dates >= :from', { from: filter.from });
    } else if (filter?.to) {
      qb.andWhere('inv.dates <= :to', { to: filter.to });
    }

    if (filter?.noa) {
      qb.andWhere('inv.noa = :noa', { noa: filter.noa });
    }

    if (filter?.amr !== undefined) {
      qb.andWhere('inv.amr = :amr', { amr: filter.amr });
    }

    if (search) {
      qb.andWhere(
        '(inv.namea LIKE :search OR CAST(inv.nos AS TEXT) LIKE :search OR inv.notes LIKE :search)',
        { search: `%${search}%` },
      );
    }

    qb.orderBy(`inv.${sortBy || 'nos'}`, sortOrder || 'DESC')
      .skip(skip)
      .take(pageSize);

    const [data, totalCount] = await qb.getManyAndCount();

    return {
      data,
      totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
      message: `تم جلب ${data.length} فاتورة مبيعات`,
    };
  }

  // ─── جلب فاتورة مبيعات بالرقم ───
  async findOneSales(nos: number) {
    const invoice = await this.salesRepo.findOne({
      where: { nos },
      relations: ['details', 'account'],
    });
    if (!invoice) throw new NotFoundException(`فاتورة المبيعات رقم ${nos} غير موجودة`);
    return { data: invoice };
  }

  // ─── تحديث فاتورة مبيعات ───
  async updateSales(nos: number, dto: UpdateSalesInvoiceDto) {
    const invoice = await this.salesRepo.findOne({ where: { nos }, relations: ['details'] });
    if (!invoice) throw new NotFoundException(`فاتورة المبيعات رقم ${nos} غير موجودة`);
    if (invoice.amr === 1) throw new BadRequestException('لا يمكن تعديل فاتورة مرحّلة');

    // حذف التفاصيل القديمة
    if (dto.details) {
      await this.salesDetailRepo.delete({ nosParent: nos });
      const details = dto.details.map((d) => {
        const total = d.quantity * d.price;
        return this.salesDetailRepo.create({ ...d, total, nosParent: nos });
      });
      await this.salesDetailRepo.save(details);
      invoice.totals = details.reduce((sum, d) => sum + d.total, 0);
    }

    if (dto.dates) invoice.dates = dto.dates as any;
    if (dto.noa) invoice.noa = dto.noa;
    if (dto.namea) invoice.namea = dto.namea;
    if (dto.notes !== undefined) invoice.notes = dto.notes;

    const saved = await this.salesRepo.save(invoice);
    return { data: saved, message: 'تم تحديث الفاتورة بنجاح' };
  }

  // ─── حذف فاتورة مبيعات ───
  async removeSales(nos: number) {
    const invoice = await this.salesRepo.findOne({ where: { nos } });
    if (!invoice) throw new NotFoundException(`فاتورة المبيعات رقم ${nos} غير موجودة`);
    if (invoice.amr === 1) throw new BadRequestException('لا يمكن حذف فاتورة مرحّلة');
    await this.salesDetailRepo.delete({ nosParent: nos });
    await this.salesRepo.remove(invoice);
    return { message: `تم حذف فاتورة المبيعات رقم ${nos}` };
  }

  // ─── ترحيل فاتورة مبيعات ───
  async postSales(nos: number) {
    const invoice = await this.salesRepo.findOne({ where: { nos } });
    if (!invoice) throw new NotFoundException(`الفاتورة غير موجودة`);
    if (invoice.amr === 1) throw new BadRequestException('الفاتورة مرحّلة مسبقاً');
    invoice.amr = 1;
    await this.salesRepo.save(invoice);
    return { message: `تم ترحيل فاتورة المبيعات رقم ${nos}` };
  }

  // ═══════════════════════════════════════════
  // فواتير المشتريات (FATB)
  // ═══════════════════════════════════════════

  async createPurchase(dto: CreatePurchaseInvoiceDto, userId: number) {
    if (!dto.namea && dto.noa) {
      const account = await this.accountRepo.findOne({ where: { noa: dto.noa } });
      if (account) dto.namea = account.namea;
    }

    const currentYear = new Date().getFullYear();
    const yearExpr = this.getYearExpression('inv');
    const lastInvoice = await this.purchaseRepo
      .createQueryBuilder('inv')
      .where(`${yearExpr} = :year`, { year: currentYear })
      .orderBy('inv.noson', 'DESC')
      .getOne();
    const noson = (lastInvoice?.noson || 0) + 1;

    const details = dto.details.map((d) => ({ ...d, total: d.quantity * d.price }));
    const totals = details.reduce((sum, d) => sum + d.total, 0);

    const invoice = this.purchaseRepo.create({
      noson, dates: dto.dates as any, noa: dto.noa, namea: dto.namea,
      totals, notes: dto.notes, amr: 0, nousx: userId,
      details: details.map((d) => this.purchaseDetailRepo.create({
        itemName: d.itemName, quantity: d.quantity, price: d.price,
        total: d.total, notes: d.notes,
      })),
    });

    const saved = await this.purchaseRepo.save(invoice);
    this.logger.log(`فاتورة مشتريات جديدة #${saved.nos} - ${totals} د.ع`);
    return { data: saved, message: `تم إنشاء فاتورة المشتريات رقم ${saved.nos}` };
  }

  async findAllPurchase(pagination: PaginationDto, filter?: InvoiceFilterDto) {
    const { page, pageSize, skip, sortBy, sortOrder, search } = pagination;
    const qb = this.purchaseRepo.createQueryBuilder('inv')
      .leftJoinAndSelect('inv.details', 'detail');

    if (filter?.from && filter?.to)
      qb.andWhere('inv.dates BETWEEN :from AND :to', { from: filter.from, to: filter.to });
    if (filter?.noa) qb.andWhere('inv.noa = :noa', { noa: filter.noa });
    if (filter?.amr !== undefined) qb.andWhere('inv.amr = :amr', { amr: filter.amr });
    if (search)
      qb.andWhere('(inv.namea LIKE :s OR inv.notes LIKE :s)', { s: `%${search}%` });

    qb.orderBy(`inv.${sortBy || 'nos'}`, sortOrder || 'DESC').skip(skip).take(pageSize);
    const [data, totalCount] = await qb.getManyAndCount();

    return { data, totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize) };
  }

  async findOnePurchase(nos: number) {
    const invoice = await this.purchaseRepo.findOne({ where: { nos }, relations: ['details', 'account'] });
    if (!invoice) throw new NotFoundException(`فاتورة المشتريات رقم ${nos} غير موجودة`);
    return { data: invoice };
  }

  async updatePurchase(nos: number, dto: UpdatePurchaseInvoiceDto) {
    const invoice = await this.purchaseRepo.findOne({ where: { nos }, relations: ['details'] });
    if (!invoice) throw new NotFoundException(`الفاتورة غير موجودة`);
    if (invoice.amr === 1) throw new BadRequestException('لا يمكن تعديل فاتورة مرحّلة');

    if (dto.details) {
      await this.purchaseDetailRepo.delete({ nosParent: nos });
      const details = dto.details.map((d) => {
        const total = d.quantity * d.price;
        return this.purchaseDetailRepo.create({ ...d, total, nosParent: nos });
      });
      await this.purchaseDetailRepo.save(details);
      invoice.totals = details.reduce((sum, d) => sum + d.total, 0);
    }
    if (dto.dates) invoice.dates = dto.dates as any;
    if (dto.noa) invoice.noa = dto.noa;
    if (dto.namea) invoice.namea = dto.namea;
    if (dto.notes !== undefined) invoice.notes = dto.notes;

    const saved = await this.purchaseRepo.save(invoice);
    return { data: saved, message: 'تم تحديث الفاتورة' };
  }

  async removePurchase(nos: number) {
    const invoice = await this.purchaseRepo.findOne({ where: { nos } });
    if (!invoice) throw new NotFoundException(`الفاتورة غير موجودة`);
    if (invoice.amr === 1) throw new BadRequestException('لا يمكن حذف فاتورة مرحّلة');
    await this.purchaseDetailRepo.delete({ nosParent: nos });
    await this.purchaseRepo.remove(invoice);
    return { message: `تم حذف فاتورة المشتريات رقم ${nos}` };
  }

  async postPurchase(nos: number) {
    const invoice = await this.purchaseRepo.findOne({ where: { nos } });
    if (!invoice) throw new NotFoundException(`الفاتورة غير موجودة`);
    if (invoice.amr === 1) throw new BadRequestException('مرحّلة مسبقاً');
    invoice.amr = 1;
    await this.purchaseRepo.save(invoice);
    return { message: `تم ترحيل فاتورة المشتريات رقم ${nos}` };
  }

  // ═══════════════════════════════════════════
  // إحصائيات الفواتير
  // ═══════════════════════════════════════════

  async getStats(year?: number) {
    const targetYear = year || new Date().getFullYear();
    const yearExpr = this.getYearExpression('inv');

    const salesCount = await this.salesRepo.createQueryBuilder('inv')
      .where(`${yearExpr} = :year`, { year: targetYear }).getCount();
    const salesTotal = await this.salesRepo.createQueryBuilder('inv')
      .select('COALESCE(SUM(inv.totals), 0)', 'total')
      .where(`${yearExpr} = :year`, { year: targetYear }).getRawOne();

    const purchaseCount = await this.purchaseRepo.createQueryBuilder('inv')
      .where(`${yearExpr} = :year`, { year: targetYear }).getCount();
    const purchaseTotal = await this.purchaseRepo.createQueryBuilder('inv')
      .select('COALESCE(SUM(inv.totals), 0)', 'total')
      .where(`${yearExpr} = :year`, { year: targetYear }).getRawOne();

    return {
      data: {
        year: targetYear,
        sales: { count: salesCount, total: +salesTotal.total },
        purchases: { count: purchaseCount, total: +purchaseTotal.total },
        netSales: +salesTotal.total - +purchaseTotal.total,
      },
      message: `إحصائيات الفواتير لسنة ${targetYear}`,
    };
  }
}
