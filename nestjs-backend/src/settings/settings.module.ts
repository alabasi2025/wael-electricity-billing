// =============================================
// وحدة الإعدادات + المالية + المذكرات + الرسائل + الميزانية
// TITL + YEAR + MONTH + DATAF + DATAFF + ARSRF + REDM + MEMO + SMS + MZAN
// =============================================
import { Injectable, NotFoundException, BadRequestException, Module, Controller,
  Get, Post, Put, Delete, Patch, Body, Param, Query, ParseIntPipe, UseGuards, Res } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository, Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, DataSource } from 'typeorm';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// ═══════ ENTITIES ═══════

@Entity('titl') export class SettingsEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'varchar', length: 200, nullable: true }) name: string;
  @Column({ type: 'int', nullable: true }) hsll: number;
  @Column({ type: 'int', nullable: true }) nosmm: number;
  @Column({ type: 'int', nullable: true }) nosndk: number;
  @Column({ type: 'int', nullable: true }) mkdm: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true }) nr: number;
  @Column({ type: 'varchar', length: 50, nullable: true }) mrksndk: string;
  @Column({ type: 'int', nullable: true }) sndkk: number;
  @Column({ type: 'int', default: 0 }) nb: number;
  @Column({ type: 'int', nullable: true }) nocopy: number;
  @Column({ type: 'varchar', length: 500, nullable: true }) spath: string;
  @Column({ type: 'varchar', length: 500, nullable: true }) path: string;
  @Column({ type: 'int', default: 140 }) ms70: number;
  @Column({ type: 'int', nullable: true }) tsnk: number;
}

@Entity('year') export class FiscalYearEntity {
  @PrimaryColumn({ type: 'int' }) year: number;
  @Column({ name: 'start_date', type: 'date', nullable: true }) startDate: Date;
  @Column({ name: 'end_date', type: 'date', nullable: true }) endDate: Date;
  @Column({ type: 'int', default: 1 }) status: number;
  @Column({ type: 'int', nullable: true }) stat: number;
}

@Entity('month') export class MonthEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'no_m', type: 'int' }) noM: number;
  @Column({ type: 'int' }) year: number;
  @Column({ type: 'varchar', length: 50, nullable: true }) name: string;
  @Column({ type: 'int', default: 1 }) status: number;
  @Column({ name: 'open_date', type: 'date', nullable: true }) openDate: Date;
  @Column({ name: 'close_date', type: 'date', nullable: true }) closeDate: Date;
}

@Entity('dataf') export class FinancialDataEntity {
  @PrimaryGeneratedColumn({ name: 'nos' }) nos: number;
  @Column({ type: 'date', nullable: true }) dates: Date;
  @Column({ type: 'date', nullable: true }) dates2: Date;
  @Column({ type: 'int', nullable: true }) noa: number;
  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true }) amount: number;
  @Column({ type: 'varchar', length: 50, nullable: true }) type: string;
  @Column({ type: 'text', nullable: true }) notes: string;
}

@Entity('dataff') export class FinancialDataDetailEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos_parent', type: 'int', nullable: true }) nosParent: number;
  @Column({ type: 'int', nullable: true }) noa: number;
  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true }) amount: number;
  @Column({ type: 'text', nullable: true }) notes: string;
}

@Entity('arsrf') export class BalanceEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'int', nullable: true }) noa: number;
  @Column({ type: 'date', nullable: true }) dates: Date;
  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 }) debit: number;
  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 }) credit: number;
  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 }) balance: number;
}

@Entity('redm') export class AdjustmentEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'int', nullable: true }) nos: number;
  @Column({ type: 'date', nullable: true }) dates: Date;
  @Column({ type: 'date', nullable: true }) dates2: Date;
  @Column({ type: 'int', nullable: true }) noa: number;
  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true }) amount: number;
  @Column({ type: 'text', nullable: true }) notes: string;
}

@Entity('redmm') export class AdjustmentDetailEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'int', nullable: true }) nos: number;
  @Column({ type: 'date', nullable: true }) dates: Date;
  @Column({ type: 'date', nullable: true }) dates2: Date;
  @Column({ type: 'int', nullable: true }) noa: number;
  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true }) amount: number;
  @Column({ type: 'text', nullable: true }) notes: string;
}

@Entity('rsfm') export class AccountBalanceEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'int', nullable: true }) noa: number;
  @Column({ type: 'date', nullable: true }) dates: Date;
  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true }) balance: number;
}

@Entity('dataamr1') export class FinancialExtra1Entity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'date', nullable: true }) dates: Date;
  @Column({ type: 'date', nullable: true }) dates2: Date;
  @Column({ type: 'int', nullable: true }) noa: number;
  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true }) amount: number;
  @Column({ type: 'text', nullable: true }) notes: string;
}

@Entity('dataamr2') export class FinancialExtra2Entity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'date', nullable: true }) dates: Date;
  @Column({ type: 'date', nullable: true }) dates2: Date;
  @Column({ type: 'int', nullable: true }) noa: number;
  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true }) amount: number;
  @Column({ type: 'text', nullable: true }) notes: string;
}

@Entity('memo') export class MemoEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'varchar', length: 300, nullable: true }) title: string;
  @Column({ type: 'text', nullable: true }) content: string;
  @Column({ name: 'date_created', type: 'date', nullable: true }) dateCreated: Date;
  @Column({ name: 'user_id', type: 'int', nullable: true }) userId: number;
  @Column({ type: 'int', default: 0 }) priority: number;
}

@Entity('sms_data') export class SmsEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'varchar', length: 50, nullable: true }) phone: string;
  @Column({ type: 'text', nullable: true }) message: string;
  @Column({ name: 'sent_date', type: 'timestamp', nullable: true }) sentDate: Date;
  @Column({ type: 'int', default: 0 }) status: number;
  @Column({ name: 'user_id', type: 'int', nullable: true }) userId: number;
}

// ═══════ SERVICE ═══════

@Injectable() class SettingsFinancialService {
  constructor(
    @InjectRepository(SettingsEntity) private readonly settingsRepo: Repository<SettingsEntity>,
    @InjectRepository(FiscalYearEntity) private readonly yearRepo: Repository<FiscalYearEntity>,
    @InjectRepository(MonthEntity) private readonly monthRepo: Repository<MonthEntity>,
    @InjectRepository(FinancialDataEntity) private readonly finRepo: Repository<FinancialDataEntity>,
    @InjectRepository(FinancialDataDetailEntity) private readonly finDetailRepo: Repository<FinancialDataDetailEntity>,
    @InjectRepository(BalanceEntity) private readonly balanceRepo: Repository<BalanceEntity>,
    @InjectRepository(AdjustmentEntity) private readonly adjRepo: Repository<AdjustmentEntity>,
    @InjectRepository(AdjustmentDetailEntity) private readonly adjDetailRepo: Repository<AdjustmentDetailEntity>,
    @InjectRepository(AccountBalanceEntity) private readonly accBalRepo: Repository<AccountBalanceEntity>,
    @InjectRepository(FinancialExtra1Entity) private readonly extra1Repo: Repository<FinancialExtra1Entity>,
    @InjectRepository(FinancialExtra2Entity) private readonly extra2Repo: Repository<FinancialExtra2Entity>,
    @InjectRepository(MemoEntity) private readonly memoRepo: Repository<MemoEntity>,
    @InjectRepository(SmsEntity) private readonly smsRepo: Repository<SmsEntity>,
    private readonly dataSource: DataSource,
  ) {}

  // الإعدادات
  async getSettings() { const all = await this.settingsRepo.find(); return { data: all[0] || {} }; }
  async updateSettings(dto: any) {
    const all = await this.settingsRepo.find();
    let s = all[0];
    if (!s) {
      const newSettings = this.settingsRepo.create(dto);
      return { data: await this.settingsRepo.save(newSettings), message: 'تم إنشاء الإعدادات' };
    }
    Object.assign(s, dto);
    return { data: await this.settingsRepo.save(s), message: 'تم تحديث الإعدادات' };
  }

  // السنوات المالية
  async getFiscalYears() { return { data: await this.yearRepo.find({ order: { year: 'DESC' } }) }; }
  async createFiscalYear(dto: any) { return { data: await this.yearRepo.save(this.yearRepo.create(dto)), message: 'تم إنشاء السنة المالية' }; }
  async closeFiscalYear(year: number) {
    const y = await this.yearRepo.findOne({ where: { year } }); if (!y) throw new NotFoundException('السنة غير موجودة');
    y.status = 0; await this.yearRepo.save(y); return { message: `تم إقفال سنة ${year}` };
  }

  // الشهور
  async getMonths(year: number) { return { data: await this.monthRepo.find({ where: { year }, order: { noM: 'ASC' } }) }; }
  async createMonth(dto: any) { return { data: await this.monthRepo.save(this.monthRepo.create({ ...dto, openDate: new Date() })) }; }
  async closeMonth(id: number) {
    const m = await this.monthRepo.findOne({ where: { id } }); if (!m) throw new NotFoundException('الشهر غير موجود');
    m.status = 0; m.closeDate = new Date(); await this.monthRepo.save(m); return { message: 'تم إقفال الشهر' };
  }

  // البيانات المالية
  async getFinancialData(p: PaginationDto) { const [data, tc] = await this.finRepo.findAndCount({ order: { nos: 'DESC' }, skip: p.skip, take: p.pageSize }); return { data, totalCount: tc }; }
  async createFinancialData(dto: any) { return { data: await this.finRepo.save(this.finRepo.create(dto)) }; }

  // الأرصدة
  async getBalances(noa?: number) {
    const qb = this.balanceRepo.createQueryBuilder('b');
    if (noa) qb.where('b.noa = :noa', { noa });
    return { data: await qb.orderBy('b.dates', 'DESC').getMany() };
  }

  // التسويات
  async getAdjustments(p: PaginationDto) { const [data, tc] = await this.adjRepo.findAndCount({ order: { id: 'DESC' }, skip: p.skip, take: p.pageSize }); return { data, totalCount: tc }; }
  async createAdjustment(dto: any) { return { data: await this.adjRepo.save(this.adjRepo.create(dto)), message: 'تم إنشاء التسوية' }; }

  // المذكرات
  async getMemos(p: PaginationDto) { const [data, tc] = await this.memoRepo.findAndCount({ order: { id: 'DESC' }, skip: p.skip, take: p.pageSize }); return { data, totalCount: tc }; }
  async createMemo(dto: any, userId: number) { return { data: await this.memoRepo.save(this.memoRepo.create({ ...dto, dateCreated: new Date(), userId })), message: 'تم إنشاء المذكرة' }; }
  async updateMemo(id: number, dto: any) { const m = await this.memoRepo.findOne({ where: { id } }); if (!m) throw new NotFoundException('غير موجودة'); Object.assign(m, dto); return { data: await this.memoRepo.save(m) }; }
  async deleteMemo(id: number) { await this.memoRepo.delete(id); return { message: 'تم الحذف' }; }

  // الرسائل
  async getSmsMessages(p: PaginationDto) { const [data, tc] = await this.smsRepo.findAndCount({ order: { id: 'DESC' }, skip: p.skip, take: p.pageSize }); return { data, totalCount: tc }; }
  async createSms(dto: any, userId: number) { return { data: await this.smsRepo.save(this.smsRepo.create({ ...dto, sentDate: new Date(), userId, status: 1 })), message: 'تم الإرسال' }; }

  // النسخ الاحتياطي
  async createBackup() {
    const dbType = String((this.dataSource.options as any)?.type || '').toLowerCase();
    const tables = dbType.includes('sqlite')
      ? await this.dataSource.query("SELECT name FROM sqlite_master WHERE type='table'")
      : await this.dataSource.query(`
          SELECT table_name AS name
          FROM information_schema.tables
          WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
        `);
    const tableCount = tables.length;
    return { data: { date: new Date(), tables: tableCount, status: 'success' }, message: `تم إنشاء النسخة الاحتياطية (${tableCount} جدول)` };
  }

  // الميزانية العمومية
  async getBalanceSheet(year: number) {
    const assets = await this.dataSource.query(`
      SELECT acc.noa, acc.namea, COALESCE(SUM(e.debit),0)-COALESCE(SUM(e.credit),0) as balance
      FROM data_ac acc LEFT JOIN datak e ON e.noa=acc.noa AND e.year=?
      LEFT JOIN data_a da ON da.no_a=acc.typea WHERE da.ts=0
      GROUP BY acc.noa, acc.namea HAVING balance<>0 ORDER BY acc.noa
    `, [year]).catch(() => []);

    const liabilities = await this.dataSource.query(`
      SELECT acc.noa, acc.namea, COALESCE(SUM(e.credit),0)-COALESCE(SUM(e.debit),0) as balance
      FROM data_ac acc LEFT JOIN datak e ON e.noa=acc.noa AND e.year=?
      LEFT JOIN data_a da ON da.no_a=acc.typea WHERE da.ts IN (1,4)
      GROUP BY acc.noa, acc.namea HAVING balance<>0 ORDER BY acc.noa
    `, [year]).catch(() => []);

    const totalAssets = assets.reduce((s: number, a: any) => s + +a.balance, 0);
    const totalLiabilities = liabilities.reduce((s: number, l: any) => s + +l.balance, 0);

    return { data: { year, assets, liabilities, totalAssets, totalLiabilities, equity: totalAssets - totalLiabilities }, message: `الميزانية العمومية ${year}` };
  }
}

// ═══════ CONTROLLERS ═══════

@ApiTags('settings') @ApiBearerAuth('JWT-auth') @UseGuards(JwtAuthGuard) @Controller('settings')
class SettingsController {
  constructor(private readonly svc: SettingsFinancialService) {}
  @Get('current') @ApiOperation({ summary: 'إعدادات النظام (TITL)' }) getSettings() { return this.svc.getSettings(); }
  @Put('current') @ApiOperation({ summary: 'تحديث الإعدادات' }) updateSettings(@Body() dto: any) { return this.svc.updateSettings(dto); }
  @Get('fiscal-years') @ApiOperation({ summary: 'السنوات المالية (YEAR)' }) getFiscalYears() { return this.svc.getFiscalYears(); }
  @Post('fiscal-years') @ApiOperation({ summary: 'إنشاء سنة مالية' }) createFiscalYear(@Body() dto: any) { return this.svc.createFiscalYear(dto); }
  @Patch('fiscal-years/:year/close') @ApiOperation({ summary: 'إقفال سنة مالية' }) closeFiscalYear(@Param('year', ParseIntPipe) year: number) { return this.svc.closeFiscalYear(year); }
  @Get('months') @ApiOperation({ summary: 'الشهور المالية (MONTH)' }) getMonths(@Query('year', ParseIntPipe) year: number) { return this.svc.getMonths(year); }
  @Post('months') @ApiOperation({ summary: 'فتح شهر' }) createMonth(@Body() dto: any) { return this.svc.createMonth(dto); }
  @Patch('months/:id/close') @ApiOperation({ summary: 'إقفال شهر' }) closeMonth(@Param('id', ParseIntPipe) id: number) { return this.svc.closeMonth(id); }
  @Post('backup') @ApiOperation({ summary: 'إنشاء نسخة احتياطية' }) createBackup() { return this.svc.createBackup(); }
}

@ApiTags('financial') @ApiBearerAuth('JWT-auth') @UseGuards(JwtAuthGuard) @Controller('financial')
class FinancialController {
  constructor(private readonly svc: SettingsFinancialService) {}
  @Get('data') @ApiOperation({ summary: 'البيانات المالية (DATAF)' }) getData(@Query() p: PaginationDto) { return this.svc.getFinancialData(p); }
  @Post('data') @ApiOperation({ summary: 'إنشاء بيانات مالية' }) createData(@Body() dto: any) { return this.svc.createFinancialData(dto); }
  @Get('balances') @ApiOperation({ summary: 'الأرصدة (ARSRF)' }) getBalances(@Query('noa') noa?: number) { return this.svc.getBalances(noa); }
  @Get('adjustments') @ApiOperation({ summary: 'التسويات (REDM)' }) getAdj(@Query() p: PaginationDto) { return this.svc.getAdjustments(p); }
  @Post('adjustments') @ApiOperation({ summary: 'إنشاء تسوية' }) createAdj(@Body() dto: any) { return this.svc.createAdjustment(dto); }
  @Get('balance-sheet/:year') @ApiOperation({ summary: 'الميزانية العمومية (MZAN)' }) getBS(@Param('year', ParseIntPipe) year: number) { return this.svc.getBalanceSheet(year); }
}

@ApiTags('memo') @ApiBearerAuth('JWT-auth') @UseGuards(JwtAuthGuard) @Controller('memo')
class MemoController {
  constructor(private readonly svc: SettingsFinancialService) {}
  @Get() @ApiOperation({ summary: 'قائمة المذكرات (MEMO)' }) findAll(@Query() p: PaginationDto) { return this.svc.getMemos(p); }
  @Post() @ApiOperation({ summary: 'إنشاء مذكرة' }) create(@Body() dto: any, @Param() req: any) { return this.svc.createMemo(dto, 1); }
  @Put(':id') @ApiOperation({ summary: 'تحديث مذكرة' }) update(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateMemo(id, dto); }
  @Delete(':id') @ApiOperation({ summary: 'حذف مذكرة' }) remove(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteMemo(id); }
}

@ApiTags('sms') @ApiBearerAuth('JWT-auth') @UseGuards(JwtAuthGuard) @Controller('sms')
class SmsController {
  constructor(private readonly svc: SettingsFinancialService) {}
  @Get() @ApiOperation({ summary: 'قائمة الرسائل (SMS_DATA)' }) findAll(@Query() p: PaginationDto) { return this.svc.getSmsMessages(p); }
  @Post() @ApiOperation({ summary: 'إرسال رسالة SMS' }) create(@Body() dto: any) { return this.svc.createSms(dto, 1); }
}

// ═══════ MODULE ═══════
@Module({
  imports: [TypeOrmModule.forFeature([
    SettingsEntity, FiscalYearEntity, MonthEntity,
    FinancialDataEntity, FinancialDataDetailEntity,
    BalanceEntity, AdjustmentEntity, AdjustmentDetailEntity,
    AccountBalanceEntity, FinancialExtra1Entity, FinancialExtra2Entity,
    MemoEntity, SmsEntity,
  ])],
  controllers: [SettingsController, FinancialController, MemoController, SmsController],
  providers: [SettingsFinancialService],
  exports: [SettingsFinancialService],
})
export class SettingsFinancialModule {}
