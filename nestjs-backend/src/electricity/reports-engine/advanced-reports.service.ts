// =============================================
// تقارير إضافية متقدمة (5 تقارير)
// بديل: repkh2 + repkhmgq + repkmrkzmt + repmont + NET1-4
// =============================================
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ElectricitySubscriberEntity } from '../subscribers/entities/electricity-subscriber.entity';
import { BillingInvoiceEntity, BillingCycleEntity } from '../billing-engine/entities/billing.entity';
import { MeterReadingEntity, MeterReadingCycleEntity } from '../meter-readings/entities/meter-reading.entity';

@Injectable()
export class AdvancedReportsService {
  constructor(
    @InjectRepository(ElectricitySubscriberEntity) private subRepo: Repository<ElectricitySubscriberEntity>,
    @InjectRepository(BillingInvoiceEntity) private invRepo: Repository<BillingInvoiceEntity>,
    @InjectRepository(BillingCycleEntity) private cycleRepo: Repository<BillingCycleEntity>,
    @InjectRepository(MeterReadingEntity) private readRepo: Repository<MeterReadingEntity>,
  ) {}

  // ═══ تقرير 9: كشف حساب تفصيلي مع مقارنة (بديل repkh2) ═══
  async detailedAccountStatement(noa: number) {
    const sub = await this.subRepo.findOne({ where: { noa } });
    const invoices = await this.invRepo.find({ where: { subscriberNoa: noa }, order: { invoiceDate: 'ASC' } });

    let runBal = 0;
    const rows = invoices.map((inv, i) => {
      const prevConsumption = i > 0 ? +invoices[i - 1].consumption : 0;
      const change = prevConsumption > 0 ? Math.round(((+inv.consumption - prevConsumption) / prevConsumption) * 100) : 0;
      runBal += +inv.totalAmount - +inv.paidAmount;
      return {
        invoiceNo: inv.invoiceNo, date: inv.invoiceDate,
        prevReading: inv.prevReading, currReading: inv.currReading,
        consumption: +inv.consumption, prevConsumption, changePercent: change,
        amount: +inv.totalAmount, paid: +inv.paidAmount, balance: runBal,
        status: inv.status,
      };
    });

    const avgConsumption = rows.length ? rows.reduce((s, r) => s + r.consumption, 0) / rows.length : 0;
    const maxConsumption = rows.length ? Math.max(...rows.map(r => r.consumption)) : 0;
    const minConsumption = rows.length ? Math.min(...rows.map(r => r.consumption)) : 0;

    return {
      data: {
        subscriber: sub,
        transactions: rows,
        analytics: { avgConsumption: Math.round(avgConsumption), maxConsumption, minConsumption, invoiceCount: rows.length, totalBilled: rows.reduce((s, r) => s + r.amount, 0), totalPaid: rows.reduce((s, r) => s + r.paid, 0), currentBalance: sub?.balance || 0 },
      },
    };
  }

  // ═══ تقرير 10: تقرير حسب المحصل (بديل repkhmgq) ═══
  async collectorReport(collectorId?: number) {
    const qb = this.subRepo.createQueryBuilder('s')
      .select('s.collectorId', 'collectorId')
      .addSelect('COUNT(*)', 'subscriberCount')
      .addSelect('SUM(s.balance)', 'totalBalance')
      .addSelect('COUNT(CASE WHEN s.balance > 0 THEN 1 END)', 'debtorCount')
      .addSelect('SUM(CASE WHEN s.balance > 0 THEN s.balance ELSE 0 END)', 'totalDebt')
      .addSelect('COUNT(CASE WHEN s.disconnectFlag = 1 THEN 1 END)', 'disconnectedCount')
      .where('s.collectorId IS NOT NULL')
      .groupBy('s.collectorId').orderBy('"totalDebt"', 'DESC');

    if (collectorId) qb.andWhere('s.collectorId = :cid', { cid: collectorId });
    const collectors = await qb.getRawMany();

    // تفاصيل المشتركين لكل محصل
    let details = [];
    if (collectorId) {
      details = await this.subRepo.find({ where: { collectorId }, order: { balance: 'DESC' } });
    }

    return { data: { summary: collectors, details, totalCollectors: collectors.length } };
  }

  // ═══ تقرير 11: تقرير حسب المركز (بديل repkmrkzmt) ═══
  async centerReport(centerId?: number) {
    const qb = this.subRepo.createQueryBuilder('s')
      .select('s.centerId', 'centerId')
      .addSelect('COUNT(*)', 'subscriberCount')
      .addSelect('SUM(s.balance)', 'totalBalance')
      .addSelect('SUM(CASE WHEN s.balance > 0 THEN s.balance ELSE 0 END)', 'totalDebt')
      .where('s.centerId IS NOT NULL')
      .groupBy('s.centerId').orderBy('"totalDebt"', 'DESC');
    if (centerId) qb.andWhere('s.centerId = :cid', { cid: centerId });
    return { data: { centers: await qb.getRawMany() } };
  }

  // ═══ تقرير 12: مقارنة استهلاك شهرية (بديل repmont) ═══
  async monthlyComparisonReport(year: number) {
    const cycles = await this.cycleRepo.find({ where: { billingYear: year }, order: { billingMonth: 'ASC' } });
    const monthlyData = [];

    for (const cycle of cycles) {
      const stats = await this.invRepo.createQueryBuilder('i')
        .select('SUM(i.consumption)', 'totalConsumption')
        .addSelect('SUM(i.totalAmount)', 'totalBilled')
        .addSelect('SUM(i.paidAmount)', 'totalPaid')
        .addSelect('COUNT(*)', 'invoiceCount')
        .addSelect('AVG(i.consumption)', 'avgConsumption')
        .where('i.billingCycleId = :cid', { cid: cycle.id }).getRawOne();

      monthlyData.push({
        month: cycle.billingMonth, cycleName: cycle.cycleName,
        totalConsumption: +stats?.totalConsumption || 0,
        totalBilled: +stats?.totalBilled || 0,
        totalPaid: +stats?.totalPaid || 0,
        invoiceCount: +stats?.invoiceCount || 0,
        avgConsumption: Math.round(+stats?.avgConsumption || 0),
        collectionRate: stats?.totalBilled > 0 ? Math.round((+stats.totalPaid / +stats.totalBilled) * 100) : 0,
      });
    }

    const yearTotal = {
      totalConsumption: monthlyData.reduce((s, m) => s + m.totalConsumption, 0),
      totalBilled: monthlyData.reduce((s, m) => s + m.totalBilled, 0),
      totalPaid: monthlyData.reduce((s, m) => s + m.totalPaid, 0),
    };

    return { data: { year, months: monthlyData, yearTotal } };
  }

  // ═══ تقرير 13: تقرير الشبكة (بديل NET1-NET4) ═══
  async networkReport(dateFrom?: string, dateTo?: string) {
    // يعتمد على NetworkVoucherEntity
    const result = {
      summary: { total: 0, pending: 0, confirmed: 0, posted: 0, totalAmount: 0 },
      note: 'التقرير مرتبط بوحدة سندات الشبكة (network-vouchers)',
    };
    return { data: result };
  }
}
