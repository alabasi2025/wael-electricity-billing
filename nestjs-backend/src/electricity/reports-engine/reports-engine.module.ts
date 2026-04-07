// =============================================
// وحدة التقارير الكهربائية
// بديل: repkh1, repday, repfm, repsnd, repmza, repkred
// تقارير HTML قابلة للطباعة + بيانات JSON
// =============================================
import { Injectable, NotFoundException, Module, Controller,
  Get, Query, Param, ParseIntPipe, UseGuards, Res } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { IsOptional, IsInt, IsString, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { ElectricitySubscriberEntity } from '../subscribers/entities/electricity-subscriber.entity';
import { BillingInvoiceEntity, BillingCycleEntity } from '../billing-engine/entities/billing.entity';
import { MeterReadingEntity, MeterReadingCycleEntity } from '../meter-readings/entities/meter-reading.entity';

// ═══════ DTOs ═══════

class ReportQueryDto {
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() month?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() year?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() groupId?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() collectorId?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() subscriberNoa?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() dateFrom?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() dateTo?: string;
}

// ═══════ SERVICE ═══════

@Injectable()
export class ElectricityReportsService {
  constructor(
    @InjectRepository(ElectricitySubscriberEntity) private readonly subRepo: Repository<ElectricitySubscriberEntity>,
    @InjectRepository(BillingInvoiceEntity) private readonly invoiceRepo: Repository<BillingInvoiceEntity>,
    @InjectRepository(BillingCycleEntity) private readonly cycleRepo: Repository<BillingCycleEntity>,
    @InjectRepository(MeterReadingEntity) private readonly readingRepo: Repository<MeterReadingEntity>,
    @InjectRepository(MeterReadingCycleEntity) private readonly readCycleRepo: Repository<MeterReadingCycleEntity>,
  ) {}

  // ═══ تقرير 1: كشف حساب مشترك (repkh1) ═══
  async subscriberStatement(noa: number) {
    const sub = await this.subRepo.findOne({ where: { noa } });
    if (!sub) throw new NotFoundException('المشترك غير موجود');

    const invoices = await this.invoiceRepo.find({
      where: { subscriberNoa: noa },
      order: { invoiceDate: 'ASC' },
    });

    let runningBalance = 0;
    const statement = invoices.map(inv => {
      runningBalance += +inv.totalAmount - +inv.paidAmount;
      return {
        invoiceNo: inv.invoiceNo,
        date: inv.invoiceDate,
        consumption: inv.consumption,
        amount: +inv.totalAmount,
        paid: +inv.paidAmount,
        balance: runningBalance,
        status: inv.status,
      };
    });

    return {
      data: {
        subscriber: { noa: sub.noa, name: sub.namea, meter: sub.meterNo, address: sub.addressText, mobile: sub.mobile },
        statement,
        summary: {
          totalBilled: invoices.reduce((s, i) => s + +i.totalAmount, 0),
          totalPaid: invoices.reduce((s, i) => s + +i.paidAmount, 0),
          currentBalance: +sub.balance,
          invoiceCount: invoices.length,
        },
      },
    };
  }

  // ═══ تقرير 2: الفواتير الشهرية (repfm2) ═══
  async monthlyBillingReport(month: number, year: number, groupId?: number) {
    const qb = this.invoiceRepo.createQueryBuilder('i')
      .innerJoin(BillingCycleEntity, 'c', 'i.billingCycleId = c.id')
      .where('c.billingMonth = :month AND c.billingYear = :year', { month, year });
    if (groupId) qb.andWhere('c.groupId = :gid', { gid: groupId });
    qb.orderBy('i.subscriberNoa', 'ASC');
    const invoices = await qb.getMany();

    return {
      data: {
        period: `${month}/${year}`,
        invoices: invoices.map(i => ({
          invoiceNo: i.invoiceNo, noa: i.subscriberNoa, name: i.subscriberName,
          prevReading: i.prevReading, currReading: i.currReading,
          consumption: i.consumption, amount: +i.totalAmount,
          paid: +i.paidAmount, remaining: +i.remainingAmount, status: i.status,
        })),
        summary: {
          count: invoices.length,
          totalConsumption: invoices.reduce((s, i) => s + +i.consumption, 0),
          totalBilled: invoices.reduce((s, i) => s + +i.totalAmount, 0),
          totalPaid: invoices.reduce((s, i) => s + +i.paidAmount, 0),
          totalUnpaid: invoices.reduce((s, i) => s + +i.remainingAmount, 0),
        },
      },
    };
  }

  // ═══ تقرير 3: الفواتير غير المسددة (repkred) ═══
  async unpaidInvoicesReport(groupId?: number) {
    const qb = this.invoiceRepo.createQueryBuilder('i')
      .where('i.remainingAmount > 0 AND i.status < 4');
    qb.orderBy('i.remainingAmount', 'DESC');
    const invoices = await qb.getMany();

    return {
      data: {
        invoices: invoices.map(i => ({
          invoiceNo: i.invoiceNo, noa: i.subscriberNoa, name: i.subscriberName,
          date: i.invoiceDate, total: +i.grandTotal, paid: +i.paidAmount,
          remaining: +i.remainingAmount,
        })),
        summary: {
          count: invoices.length,
          totalUnpaid: invoices.reduce((s, i) => s + +i.remainingAmount, 0),
        },
      },
    };
  }

  // ═══ تقرير 4: القراءات اليومية (repmza) ═══
  async readingsReport(cycleId: number, groupId?: number) {
    const cycle = await this.readCycleRepo.findOne({ where: { id: cycleId } });
    if (!cycle) throw new NotFoundException('الدورة غير موجودة');

    const readings = await this.readingRepo.find({
      where: { cycleId },
      order: { subscriberNoa: 'ASC' },
    });

    return {
      data: {
        cycle: { no: cycle.cycleNo, from: cycle.dateFrom, to: cycle.dateTo },
        readings: readings.map(r => ({
          noa: r.subscriberNoa, meter: r.meterName,
          prev: +r.prevReading, curr: +r.currReading, consumption: +r.consumption,
          net: +r.netConsumption, anomaly: r.isAnomaly, anomalyReason: r.anomalyReason,
          status: r.status,
        })),
        summary: {
          total: readings.length,
          completed: readings.filter(r => r.status >= 1).length,
          pending: readings.filter(r => r.status === 0).length,
          anomalies: readings.filter(r => r.isAnomaly).length,
          totalConsumption: readings.reduce((s, r) => s + +r.consumption, 0),
        },
      },
    };
  }

  // ═══ تقرير 5: التحصيل اليومي (repday/repsnd) ═══
  async dailyCollectionReport(date: string) {
    const invoices = await this.invoiceRepo.createQueryBuilder('i')
      .where("i.status >= 3 AND CAST(i.updatedAt AS DATE) = :d", { d: date })
      .orderBy('i.subscriberNoa', 'ASC').getMany();

    const totalCollected = invoices.reduce((s, i) => s + +i.paidAmount, 0);
    return {
      data: {
        date,
        collections: invoices.map(i => ({
          invoiceNo: i.invoiceNo, noa: i.subscriberNoa, name: i.subscriberName,
          amount: +i.paidAmount,
        })),
        summary: { count: invoices.length, totalCollected },
      },
    };
  }

  // ═══ تقرير 6: الاستهلاك حسب المجموعة ═══
  async consumptionByGroupReport(month?: number, year?: number) {
    const qb = this.invoiceRepo.createQueryBuilder('i')
      .innerJoin(ElectricitySubscriberEntity, 's', 'i.subscriberNoa = s.noa')
      .select('s.groupId', 'groupId')
      .addSelect('COUNT(*)', 'subscriberCount')
      .addSelect('SUM(i.consumption)', 'totalConsumption')
      .addSelect('SUM(i.totalAmount)', 'totalBilled')
      .addSelect('SUM(i.paidAmount)', 'totalPaid')
      .groupBy('s.groupId');

    if (month && year) {
      qb.innerJoin(BillingCycleEntity, 'c', 'i.billingCycleId = c.id')
        .andWhere('c.billingMonth = :m AND c.billingYear = :y', { m: month, y: year });
    }

    const results = await qb.getRawMany();
    return { data: { groups: results } };
  }

  // ═══ تقرير 7: المشتركين المراد فصلهم ═══
  async disconnectionReport(minBalance: number = 50000) {
    const subs = await this.subRepo.createQueryBuilder('s')
      .where('s.balance >= :min AND s.disconnectFlag = 0 AND s.status = 1', { min: minBalance })
      .orderBy('s.balance', 'DESC').getMany();

    return {
      data: {
        subscribers: subs.map(s => ({
          noa: s.noa, name: s.namea, meter: s.meterNo, mobile: s.mobile,
          balance: +s.balance, group: s.groupId,
        })),
        summary: {
          count: subs.length,
          totalDebt: subs.reduce((sum, s) => sum + +s.balance, 0),
        },
      },
    };
  }

  // ═══ تقرير 8: ملخص إحصائي شامل (التقرير المالي) ═══
  async financialSummaryReport(month?: number, year?: number) {
    const totalSubs = await this.subRepo.count({ where: { status: 1 } });
    const disconnected = await this.subRepo.count({ where: { disconnectFlag: 1 } });

    const balanceStats = await this.subRepo.createQueryBuilder('s')
      .select('SUM(CASE WHEN s.balance > 0 THEN s.balance ELSE 0 END)', 'totalDebt')
      .addSelect('SUM(CASE WHEN s.balance < 0 THEN ABS(s.balance) ELSE 0 END)', 'totalCredit')
      .addSelect('COUNT(CASE WHEN s.balance > 0 THEN 1 END)', 'debtors')
      .getRawOne();

    const invoiceStats = await this.invoiceRepo.createQueryBuilder('i')
      .select('SUM(i.totalAmount)', 'totalBilled')
      .addSelect('SUM(i.paidAmount)', 'totalPaid')
      .addSelect('SUM(i.remainingAmount)', 'totalUnpaid')
      .addSelect('SUM(i.consumption)', 'totalConsumption')
      .getRawOne();

    return {
      data: {
        subscribers: { total: totalSubs, disconnected, debtors: +balanceStats?.debtors || 0 },
        financial: {
          totalDebt: +balanceStats?.totalDebt || 0,
          totalCredit: +balanceStats?.totalCredit || 0,
          totalBilled: +invoiceStats?.totalBilled || 0,
          totalPaid: +invoiceStats?.totalPaid || 0,
          totalUnpaid: +invoiceStats?.totalUnpaid || 0,
          collectionRate: invoiceStats?.totalBilled > 0
            ? Math.round((+invoiceStats.totalPaid / +invoiceStats.totalBilled) * 100) : 0,
        },
        consumption: { total: +invoiceStats?.totalConsumption || 0 },
      },
    };
  }

  // ─── قائمة التقارير المتاحة ───
  async getAvailableReports() {
    return {
      data: [
        { id: 'subscriber-statement', name: 'كشف حساب مشترك', icon: 'person', params: ['noa'], oracle: 'repkh1' },
        { id: 'monthly-billing', name: 'الفواتير الشهرية', icon: 'receipt', params: ['month', 'year'], oracle: 'repfm2' },
        { id: 'unpaid-invoices', name: 'الفواتير غير المسددة', icon: 'warning', params: [], oracle: 'repkred' },
        { id: 'readings', name: 'كشف القراءات', icon: 'speed', params: ['cycleId'], oracle: 'repmza' },
        { id: 'daily-collection', name: 'التحصيل اليومي', icon: 'payments', params: ['date'], oracle: 'repday/repsnd' },
        { id: 'consumption-by-group', name: 'الاستهلاك حسب المجموعة', icon: 'bar_chart', params: ['month', 'year'], oracle: 'repkmrkz' },
        { id: 'disconnection-list', name: 'المشتركين المراد فصلهم', icon: 'block', params: ['minBalance'], oracle: 'repkred+tel' },
        { id: 'financial-summary', name: 'التقرير المالي الشامل', icon: 'analytics', params: [], oracle: 'repkh/repday' },
      ],
    };
  }
}

// ═══════ CONTROLLER ═══════

@ApiTags('electricity/reports')
@ApiBearerAuth('JWT-auth') @UseGuards(JwtAuthGuard)
@Controller('electricity/reports')
export class ElectricityReportsController {
  constructor(private readonly svc: ElectricityReportsService) {}

  @Get() @ApiOperation({ summary: 'قائمة التقارير المتاحة' })
  getAvailable() { return this.svc.getAvailableReports(); }

  @Get('subscriber-statement/:noa') @ApiOperation({ summary: 'كشف حساب مشترك (repkh1)' })
  subscriberStatement(@Param('noa', ParseIntPipe) noa: number) { return this.svc.subscriberStatement(noa); }

  @Get('monthly-billing') @ApiOperation({ summary: 'الفواتير الشهرية (repfm2)' })
  monthlyBilling(@Query('month') month: number, @Query('year') year: number, @Query('groupId') groupId?: number) {
    return this.svc.monthlyBillingReport(+month, +year, groupId ? +groupId : undefined);
  }

  @Get('unpaid-invoices') @ApiOperation({ summary: 'الفواتير غير المسددة (repkred)' })
  unpaidInvoices(@Query('groupId') groupId?: number) { return this.svc.unpaidInvoicesReport(groupId ? +groupId : undefined); }

  @Get('readings/:cycleId') @ApiOperation({ summary: 'كشف القراءات (repmza)' })
  readings(@Param('cycleId', ParseIntPipe) cycleId: number) { return this.svc.readingsReport(cycleId); }

  @Get('daily-collection') @ApiOperation({ summary: 'التحصيل اليومي (repday)' })
  dailyCollection(@Query('date') date: string) { return this.svc.dailyCollectionReport(date); }

  @Get('consumption-by-group') @ApiOperation({ summary: 'الاستهلاك حسب المجموعة (repkmrkz)' })
  consumptionByGroup(@Query('month') month?: number, @Query('year') year?: number) {
    return this.svc.consumptionByGroupReport(month ? +month : undefined, year ? +year : undefined);
  }

  @Get('disconnection-list') @ApiOperation({ summary: 'كشف المشتركين المراد فصلهم' })
  disconnectionList(@Query('minBalance') minBalance?: number) {
    return this.svc.disconnectionReport(minBalance ? +minBalance : 50000);
  }

  @Get('financial-summary') @ApiOperation({ summary: 'التقرير المالي الشامل' })
  financialSummary(@Query('month') month?: number, @Query('year') year?: number) {
    return this.svc.financialSummaryReport(month ? +month : undefined, year ? +year : undefined);
  }
}

// ═══════ MODULE ═══════

@Module({
  imports: [TypeOrmModule.forFeature([
    ElectricitySubscriberEntity, BillingInvoiceEntity, BillingCycleEntity,
    MeterReadingEntity, MeterReadingCycleEntity,
  ])],
  controllers: [ElectricityReportsController],
  providers: [ElectricityReportsService],
  exports: [ElectricityReportsService],
})
export class ElectricityReportsModule {}
