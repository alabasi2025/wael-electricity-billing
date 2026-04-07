// =============================================
// خدمة التقارير (Reports Service)
// =============================================
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { JournalEntryEntity, VoucherEntity } from './entities/report.entity';
import {
  SalesInvoiceEntity, PurchaseInvoiceEntity, 
} from '../invoices/entities/invoice.entity';
import { SubAccountEntity } from '../accounts/entities/account.entity';
import {
  DailyReportDto, AccountStatementDto, TrialBalanceDto,
  InvoiceReportDto, VoucherReportDto,
} from './dto';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    @InjectRepository(JournalEntryEntity)
    private readonly journalRepo: Repository<JournalEntryEntity>,
    @InjectRepository(VoucherEntity)
    private readonly voucherRepo: Repository<VoucherEntity>,
    @InjectRepository(SubAccountEntity)
    private readonly accountRepo: Repository<SubAccountEntity>,
    @InjectRepository(SalesInvoiceEntity)
    private readonly salesRepo: Repository<SalesInvoiceEntity>,
    @InjectRepository(PurchaseInvoiceEntity)
    private readonly purchaseRepo: Repository<PurchaseInvoiceEntity>,
    private readonly dataSource: DataSource,
  ) {}

  // ═══════════════════════════════════════════
  // 1. التقرير اليومي
  // ═══════════════════════════════════════════
  async getDailyReport(dto: DailyReportDto) {
    const { date } = dto;

    // القيود
    const entries = await this.journalRepo.find({
      where: { datemo: date as any },
      order: { id: 'ASC' },
    });

    const totalDebit = entries.reduce((sum, e) => sum + +e.debit, 0);
    const totalCredit = entries.reduce((sum, e) => sum + +e.credit, 0);

    // السندات
    const vouchers = await this.voucherRepo.find({
      where: { dates: date as any },
      order: { nos: 'ASC' },
    });

    const totalVouchers = vouchers.reduce((sum, v) => sum + +v.totals, 0);

    // الفواتير
    const salesInvoices = await this.salesRepo.find({ where: { dates: date as any } });
    const purchaseInvoices = await this.purchaseRepo.find({ where: { dates: date as any } });

    const totalSales = salesInvoices.reduce((sum, i) => sum + +i.totals, 0);
    const totalPurchases = purchaseInvoices.reduce((sum, i) => sum + +i.totals, 0);

    return {
      data: {
        date,
        entries: { items: entries, totalDebit, totalCredit, count: entries.length },
        vouchers: { items: vouchers, total: totalVouchers, count: vouchers.length },
        sales: { items: salesInvoices, total: totalSales, count: salesInvoices.length },
        purchases: { items: purchaseInvoices, total: totalPurchases, count: purchaseInvoices.length },
        summary: {
          totalDebit,
          totalCredit,
          totalVouchers,
          totalSales,
          totalPurchases,
          netMovement: totalDebit - totalCredit,
        },
      },
      message: `التقرير اليومي ليوم ${date}`,
    };
  }

  // ═══════════════════════════════════════════
  // 2. كشف حساب
  // ═══════════════════════════════════════════
  async getAccountStatement(dto: AccountStatementDto) {
    const { accountNo, from, to } = dto;

    // التحقق من وجود الحساب
    const account = await this.accountRepo.findOne({ where: { noa: accountNo } });
    if (!account) throw new NotFoundException(`الحساب رقم ${accountNo} غير موجود`);

    // جلب الحركات
    const entries = await this.journalRepo
      .createQueryBuilder('entry')
      .where('entry.noa = :accountNo', { accountNo })
      .andWhere('entry.datemo BETWEEN :from AND :to', { from, to })
      .orderBy('entry.datemo', 'ASC')
      .addOrderBy('entry.id', 'ASC')
      .getMany();

    // حساب الرصيد الافتتاحي (كل الحركات قبل تاريخ البداية)
    const openingResult = await this.journalRepo
      .createQueryBuilder('entry')
      .select('COALESCE(SUM(entry.debit), 0) - COALESCE(SUM(entry.credit), 0)', 'balance')
      .where('entry.noa = :accountNo', { accountNo })
      .andWhere('entry.datemo < :from', { from })
      .getRawOne();

    const openingBalance = +openingResult.balance;

    // بناء كشف الحساب مع الأرصدة المتراكمة
    let runningBalance = openingBalance;
    const statement = entries.map((entry) => {
      runningBalance += +entry.debit - +entry.credit;
      return {
        date: entry.datemo,
        description: entry.namea,
        reference: `قيد #${entry.id}`,
        debit: +entry.debit,
        credit: +entry.credit,
        balance: runningBalance,
      };
    });

    const totalDebit = entries.reduce((s, e) => s + +e.debit, 0);
    const totalCredit = entries.reduce((s, e) => s + +e.credit, 0);

    return {
      data: {
        accountNo,
        accountName: account.namea,
        fromDate: from,
        toDate: to,
        openingBalance,
        entries: statement,
        closingBalance: runningBalance,
        totals: { totalDebit, totalCredit, netMovement: totalDebit - totalCredit },
      },
      message: `كشف حساب: ${account.namea}`,
    };
  }

  // ═══════════════════════════════════════════
  // 3. ميزان المراجعة
  // ═══════════════════════════════════════════
  async getTrialBalance(dto: TrialBalanceDto) {
    const { year, month } = dto;

    let query = this.journalRepo
      .createQueryBuilder('entry')
      .select('entry.noa', 'accountNo')
      .addSelect('acc.namea', 'accountName')
      .addSelect('COALESCE(SUM(entry.debit), 0)', 'totalDebit')
      .addSelect('COALESCE(SUM(entry.credit), 0)', 'totalCredit')
      .addSelect('COALESCE(SUM(entry.debit), 0) - COALESCE(SUM(entry.credit), 0)', 'balance')
      .leftJoin('data_ac', 'acc', 'acc.noa = entry.noa')
      .where('entry.year = :year', { year });

    if (month) {
      query = query.andWhere('entry.no_m = :month', { month });
    }

    const results = await query
      .groupBy('entry.noa')
      .addGroupBy('acc.namea')
      .orderBy('entry.noa', 'ASC')
      .getRawMany();

    const entries = results.map((r) => ({
      accountNo: r.accountNo,
      accountName: r.accountName || 'غير محدد',
      debit: +r.totalDebit,
      credit: +r.totalCredit,
      balance: +r.balance,
    }));

    const grandTotalDebit = entries.reduce((s, e) => s + e.debit, 0);
    const grandTotalCredit = entries.reduce((s, e) => s + e.credit, 0);

    return {
      data: {
        year,
        month: month || 'الكل',
        entries,
        totals: {
          totalDebit: grandTotalDebit,
          totalCredit: grandTotalCredit,
          difference: grandTotalDebit - grandTotalCredit,
          isBalanced: Math.abs(grandTotalDebit - grandTotalCredit) < 0.01,
        },
        accountCount: entries.length,
      },
      message: `ميزان المراجعة لسنة ${year}${month ? ' - شهر ' + month : ''}`,
    };
  }

  // ═══════════════════════════════════════════
  // 4. تقرير الفواتير
  // ═══════════════════════════════════════════
  async getInvoiceReport(dto: InvoiceReportDto) {
    const { type, from, to, accountNo } = dto;
    const report: any = { type, from, to };

    if (type === 'sales' || type === 'all') {
      const qb = this.salesRepo.createQueryBuilder('inv')
        .leftJoinAndSelect('inv.details', 'detail')
        .where('inv.dates BETWEEN :from AND :to', { from, to });
      if (accountNo) qb.andWhere('inv.noa = :accountNo', { accountNo });

      const salesInvoices = await qb.orderBy('inv.dates', 'ASC').getMany();
      report.sales = {
        invoices: salesInvoices,
        count: salesInvoices.length,
        total: salesInvoices.reduce((s, i) => s + +i.totals, 0),
      };
    }

    if (type === 'purchase' || type === 'all') {
      const qb = this.purchaseRepo.createQueryBuilder('inv')
        .leftJoinAndSelect('inv.details', 'detail')
        .where('inv.dates BETWEEN :from AND :to', { from, to });
      if (accountNo) qb.andWhere('inv.noa = :accountNo', { accountNo });

      const purchaseInvoices = await qb.orderBy('inv.dates', 'ASC').getMany();
      report.purchases = {
        invoices: purchaseInvoices,
        count: purchaseInvoices.length,
        total: purchaseInvoices.reduce((s, i) => s + +i.totals, 0),
      };
    }

    // ملخص
    report.summary = {
      totalSales: report.sales?.total || 0,
      totalPurchases: report.purchases?.total || 0,
      netAmount: (report.sales?.total || 0) - (report.purchases?.total || 0),
    };

    return { data: report, message: 'تقرير الفواتير' };
  }

  // ═══════════════════════════════════════════
  // 5. تقرير السندات
  // ═══════════════════════════════════════════
  async getVoucherReport(dto: VoucherReportDto) {
    const { type, from, to } = dto;

    const qb = this.voucherRepo.createQueryBuilder('v')
      .where('v.dates BETWEEN :from AND :to', { from, to });

    if (type === 'receipt') {
      qb.andWhere("v.sds IN ('cash', 'check', 'transfer')");
    }

    const vouchers = await qb.orderBy('v.dates', 'ASC').addOrderBy('v.nos', 'ASC').getMany();

    const totalAmount = vouchers.reduce((s, v) => s + +v.totals, 0);
    const postedCount = vouchers.filter((v) => v.amr === 1).length;
    const pendingCount = vouchers.filter((v) => v.amr === 0).length;

    // تجميع حسب اليوم
    const dailyTotals = vouchers.reduce((acc, v) => {
      const date = v.dates.toString();
      if (!acc[date]) acc[date] = { date, count: 0, total: 0 };
      acc[date].count++;
      acc[date].total += +v.totals;
      return acc;
    }, {} as Record<string, any>);

    return {
      data: {
        type, from, to,
        vouchers,
        summary: {
          totalCount: vouchers.length,
          totalAmount,
          postedCount,
          pendingCount,
          dailyTotals: Object.values(dailyTotals),
        },
      },
      message: 'تقرير السندات',
    };
  }

  // ═══════════════════════════════════════════
  // 6. قائمة الدخل
  // ═══════════════════════════════════════════
  async getIncomeStatement(year: number, month?: number) {
    // الإيرادات (حسابات نوع 2)
    let revenueQuery = this.journalRepo
      .createQueryBuilder('e')
      .select('COALESCE(SUM(e.credit), 0) - COALESCE(SUM(e.debit), 0)', 'total')
      .leftJoin('data_ac', 'acc', 'acc.noa = e.noa')
      .leftJoin('data_a', 'da', 'da.no_a = acc.typea')
      .where('da.ts = 2')
      .andWhere('e.year = :year', { year });
    if (month) revenueQuery = revenueQuery.andWhere('e.no_m = :month', { month });
    const revResult = await revenueQuery.getRawOne();

    // المصروفات (حسابات نوع 3)
    let expenseQuery = this.journalRepo
      .createQueryBuilder('e')
      .select('COALESCE(SUM(e.debit), 0) - COALESCE(SUM(e.credit), 0)', 'total')
      .leftJoin('data_ac', 'acc', 'acc.noa = e.noa')
      .leftJoin('data_a', 'da', 'da.no_a = acc.typea')
      .where('da.ts = 3')
      .andWhere('e.year = :year', { year });
    if (month) expenseQuery = expenseQuery.andWhere('e.no_m = :month', { month });
    const expResult = await expenseQuery.getRawOne();

    const totalRevenue = +(revResult?.total || 0);
    const totalExpenses = +(expResult?.total || 0);
    const netIncome = totalRevenue - totalExpenses;

    return {
      data: {
        year,
        month: month || 'السنة كاملة',
        revenue: { total: totalRevenue },
        expenses: { total: totalExpenses },
        netIncome,
        profitMargin: totalRevenue > 0
          ? ((netIncome / totalRevenue) * 100).toFixed(2) + '%'
          : '0%',
      },
      message: `قائمة الدخل - ${year}${month ? '/' + month : ''}`,
    };
  }

  // ═══════════════════════════════════════════
  // 7. لوحة التحكم (Dashboard Summary)
  // ═══════════════════════════════════════════
  async getDashboardSummary() {
    const currentYear = new Date().getFullYear();
    const today = new Date().toISOString().split('T')[0];
    const dbType = String((this.dataSource.options as any)?.type || '').toLowerCase();
    const yearExpr = dbType.includes('sqlite')
      ? "CAST(strftime('%Y', i.dates) AS INTEGER)"
      : 'EXTRACT(YEAR FROM i.dates)';
    const monthExpr = dbType.includes('sqlite')
      ? "CAST(strftime('%m', i.dates) AS INTEGER)"
      : 'EXTRACT(MONTH FROM i.dates)';

    // إحصائيات سريعة
    const totalAccounts = await this.accountRepo.count();
    const totalVouchersToday = await this.voucherRepo.count({ where: { dates: today as any } });

    const salesTotal = await this.salesRepo
      .createQueryBuilder('i')
      .select('COALESCE(SUM(i.totals), 0)', 'total')
      .where(`${yearExpr} = :year`, { year: currentYear })
      .getRawOne();

    const purchaseTotal = await this.purchaseRepo
      .createQueryBuilder('i')
      .select('COALESCE(SUM(i.totals), 0)', 'total')
      .where(`${yearExpr} = :year`, { year: currentYear })
      .getRawOne();

    // إيرادات شهرية
    const monthlyRevenue = await this.salesRepo
      .createQueryBuilder('i')
      .select(monthExpr, 'month')
      .addSelect('COALESCE(SUM(i.totals), 0)', 'total')
      .where(`${yearExpr} = :year`, { year: currentYear })
      .groupBy(monthExpr)
      .orderBy(monthExpr, 'ASC')
      .getRawMany();

    const monthlyExpenses = await this.purchaseRepo
      .createQueryBuilder('i')
      .select(monthExpr, 'month')
      .addSelect('COALESCE(SUM(i.totals), 0)', 'total')
      .where(`${yearExpr} = :year`, { year: currentYear })
      .groupBy(monthExpr)
      .orderBy(monthExpr, 'ASC')
      .getRawMany();

    // آخر السندات
    const recentVouchers = await this.voucherRepo.find({
      order: { nos: 'DESC' },
      take: 5,
    });

    return {
      data: {
        stats: {
          totalAccounts,
          totalVouchersToday,
          yearSales: +salesTotal.total,
          yearPurchases: +purchaseTotal.total,
          netProfit: +salesTotal.total - +purchaseTotal.total,
        },
        charts: {
          monthlyRevenue: monthlyRevenue.map((r) => ({ month: r.month, total: +r.total })),
          monthlyExpenses: monthlyExpenses.map((r) => ({ month: r.month, total: +r.total })),
        },
        recentVouchers,
      },
      message: 'ملخص لوحة التحكم',
    };
  }
}
