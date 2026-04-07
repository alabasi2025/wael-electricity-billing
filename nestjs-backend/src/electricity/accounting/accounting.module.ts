// =============================================
// وحدة المحاسبة الكهربائية الشاملة
// بديل: DATAKAD* (15 شاشة) + amlall* (11) + akfa* + akd
//        + KYD + KAK + MOVES* + printkx* + memo + mzan
// =============================================
import { Injectable, NotFoundException, Module, Controller,
  Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository, Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

// ═══════ ENTITIES ═══════

// بديل DATAK (القيود المحاسبية)
@Entity('electricity_journal_entries')
export class ElecJournalEntryEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'entry_no', type: 'int' }) entryNo: number;          // NOK
  @Column({ name: 'entry_seq', type: 'int', nullable: true }) entrySeq: number; // NOKON
  @Column({ name: 'entry_date', type: 'date' }) entryDate: Date;       // DATEK / DATEMO
  @Column({ name: 'account_noa', type: 'int' }) accountNoa: number;    // NOA
  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 }) debit: number;  // MDIN
  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 }) credit: number; // DAN
  @Column({ name: 'entry_type', type: 'int', default: 1 }) entryType: number; // TYPEMS
  @Column({ name: 'entry_name', type: 'varchar', length: 200, nullable: true }) entryName: string; // NOMS
  @Column({ type: 'text', nullable: true }) memo: string;              // MEMOS
  @Column({ name: 'ref_no', type: 'int', nullable: true }) refNo: number; // RECNO
  @Column({ name: 'fiscal_year', type: 'date', nullable: true }) fiscalYear: Date; // DKYEAR
  @Column({ name: 'sub_entry_noa', type: 'int', nullable: true }) subEntryNoa: number; // NOAML
  @Column({ name: 'sub_debit', type: 'decimal', precision: 18, scale: 2, default: 0 }) subDebit: number; // MDINAML
  @Column({ name: 'sub_credit', type: 'decimal', precision: 18, scale: 2, default: 0 }) subCredit: number; // DANAML
  @Column({ name: 'special_rate', type: 'decimal', precision: 10, scale: 2, nullable: true }) specialRate: number; // SARSF
  @Column({ type: 'int', default: 0 }) status: number;
  @Column({ name: 'created_by', type: 'int', nullable: true }) createdBy: number;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}

// بديل KAK (التصنيفات/الفئات)
@Entity('electricity_categories')
export class ElecCategoryEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'category_no', type: 'int', unique: true }) categoryNo: number;
  @Column({ type: 'varchar', length: 200 }) name: string;
  @Column({ type: 'varchar', length: 50, nullable: true }) type: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ type: 'int', default: 1 }) status: number;
}

// بديل memo/المذكرات
@Entity('electricity_memos')
export class ElecMemoEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'subscriber_noa', type: 'int', nullable: true }) subscriberNoa: number;
  @Column({ name: 'memo_type', type: 'varchar', length: 50 }) memoType: string;
  @Column({ type: 'text' }) content: string;
  @Column({ name: 'related_type', type: 'varchar', length: 50, nullable: true }) relatedType: string;
  @Column({ name: 'related_id', type: 'int', nullable: true }) relatedId: number;
  @Column({ name: 'created_by', type: 'int', nullable: true }) createdBy: number;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}

// ═══════ SERVICE ═══════

@Injectable()
export class ElecAccountingService {
  constructor(
    @InjectRepository(ElecJournalEntryEntity) private journalRepo: Repository<ElecJournalEntryEntity>,
    @InjectRepository(ElecCategoryEntity) private catRepo: Repository<ElecCategoryEntity>,
    @InjectRepository(ElecMemoEntity) private memoRepo: Repository<ElecMemoEntity>,
  ) {}

  // ─── القيود المحاسبية (DATAKAD*) ───
  async createJournalEntry(dto: Partial<ElecJournalEntryEntity>) {
    const maxNo = await this.journalRepo.createQueryBuilder('j').select('MAX(j.entryNo)', 'max').getRawOne();
    const entry = this.journalRepo.create({ ...dto, entryNo: (maxNo?.max || 0) + 1 });
    return { data: await this.journalRepo.save(entry), message: 'تم إنشاء القيد' };
  }

  async findJournalEntries(params: { accountNoa?: number; entryType?: number; dateFrom?: string; dateTo?: string; page?: number; pageSize?: number }) {
    const qb = this.journalRepo.createQueryBuilder('j');
    if (params.accountNoa) qb.andWhere('j.accountNoa = :noa', { noa: params.accountNoa });
    if (params.entryType) qb.andWhere('j.entryType = :t', { t: params.entryType });
    if (params.dateFrom) qb.andWhere('j.entryDate >= :from', { from: params.dateFrom });
    if (params.dateTo) qb.andWhere('j.entryDate <= :to', { to: params.dateTo });
    qb.orderBy('j.entryDate', 'DESC').addOrderBy('j.entryNo', 'DESC');
    const page = params.page || 1; const ps = params.pageSize || 50;
    qb.skip((page - 1) * ps).take(ps);
    const [data, total] = await qb.getManyAndCount();
    return { data, totalCount: total, page, pageSize: ps };
  }

  async getJournalEntry(id: number) {
    const e = await this.journalRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('القيد غير موجود');
    return { data: e };
  }

  async deleteJournalEntry(id: number) {
    const e = await this.journalRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('القيد غير موجود');
    await this.journalRepo.remove(e);
    return { message: 'تم حذف القيد' };
  }

  // ─── ميزان المراجعة (مجمع) ───
  async getTrialBalance(dateFrom?: string, dateTo?: string) {
    const qb = this.journalRepo.createQueryBuilder('j')
      .select('j.accountNoa', 'accountNoa')
      .addSelect('SUM(j.debit)', 'totalDebit')
      .addSelect('SUM(j.credit)', 'totalCredit')
      .addSelect('SUM(j.debit) - SUM(j.credit)', 'balance')
      .addSelect('COUNT(*)', 'entryCount')
      .groupBy('j.accountNoa').orderBy('j.accountNoa');
    if (dateFrom) qb.andWhere('j.entryDate >= :from', { from: dateFrom });
    if (dateTo) qb.andWhere('j.entryDate <= :to', { to: dateTo });
    return { data: await qb.getRawMany() };
  }

  // ─── كشف حساب محاسبي (amlall*) ───
  async getAccountStatement(accountNoa: number, dateFrom?: string, dateTo?: string) {
    const qb = this.journalRepo.createQueryBuilder('j')
      .where('j.accountNoa = :noa', { noa: accountNoa });
    if (dateFrom) qb.andWhere('j.entryDate >= :from', { from: dateFrom });
    if (dateTo) qb.andWhere('j.entryDate <= :to', { to: dateTo });
    qb.orderBy('j.entryDate', 'ASC').addOrderBy('j.entryNo', 'ASC');
    const entries = await qb.getMany();
    let balance = 0;
    const rows = entries.map(e => { balance += +e.debit - +e.credit; return { ...e, runningBalance: balance }; });
    return { data: { accountNoa, entries: rows, summary: { totalDebit: entries.reduce((s, e) => s + +e.debit, 0), totalCredit: entries.reduce((s, e) => s + +e.credit, 0), finalBalance: balance, entryCount: entries.length } } };
  }

  // ─── إقفال شهري (akfa*) ───
  async monthlyClosing(month: number, year: number) {
    const entries = await this.journalRepo.createQueryBuilder('j')
      .where("EXTRACT(MONTH FROM j.entryDate) = :m AND EXTRACT(YEAR FROM j.entryDate) = :y", { m: month, y: year })
      .getMany();
    const totalDebit = entries.reduce((s, e) => s + +e.debit, 0);
    const totalCredit = entries.reduce((s, e) => s + +e.credit, 0);
    return { data: { month, year, entryCount: entries.length, totalDebit, totalCredit, difference: totalDebit - totalCredit, balanced: Math.abs(totalDebit - totalCredit) < 0.01 }, message: totalDebit === totalCredit ? '✅ الشهر متوازن' : '⚠️ يوجد فرق' };
  }

  // ─── التصنيفات (KAK) ───
  async createCategory(dto: Partial<ElecCategoryEntity>) { return { data: await this.catRepo.save(this.catRepo.create(dto)), message: 'تم' }; }
  async findAllCategories() { return { data: await this.catRepo.find({ order: { categoryNo: 'ASC' } }) }; }
  async updateCategory(id: number, dto: any) { const c = await this.catRepo.findOne({ where: { id } }); if (!c) throw new NotFoundException('غير موجود'); Object.assign(c, dto); return { data: await this.catRepo.save(c) }; }

  // ─── المذكرات (memo) ───
  async createMemo(dto: Partial<ElecMemoEntity>) { return { data: await this.memoRepo.save(this.memoRepo.create(dto)), message: 'تم' }; }
  async findMemos(subscriberNoa?: number) {
    const qb = this.memoRepo.createQueryBuilder('m');
    if (subscriberNoa) qb.where('m.subscriberNoa = :noa', { noa: subscriberNoa });
    qb.orderBy('m.createdAt', 'DESC');
    return { data: await qb.getMany() };
  }

  // ─── إحصائيات المحاسبة ───
  async getAccountingStats() {
    const totalEntries = await this.journalRepo.count();
    const sums = await this.journalRepo.createQueryBuilder('j')
      .select('SUM(j.debit)', 'totalDebit').addSelect('SUM(j.credit)', 'totalCredit').getRawOne();
    const categories = await this.catRepo.count();
    const memos = await this.memoRepo.count();
    return { data: { totalEntries, totalDebit: +sums?.totalDebit || 0, totalCredit: +sums?.totalCredit || 0, categories, memos } };
  }
}

// ═══════ CONTROLLER ═══════

@ApiTags('electricity/accounting')
@ApiBearerAuth('JWT-auth') @UseGuards(JwtAuthGuard)
@Controller('electricity/accounting')
export class ElecAccountingController {
  constructor(private svc: ElecAccountingService) {}

  @Get('stats') @ApiOperation({ summary: 'إحصائيات المحاسبة' }) getStats() { return this.svc.getAccountingStats(); }

  // القيود
  @Post('journal') @ApiOperation({ summary: 'إنشاء قيد محاسبي (DATAKAD)' }) createEntry(@Body() dto: any) { return this.svc.createJournalEntry(dto); }
  @Get('journal') @ApiOperation({ summary: 'قائمة القيود' }) findEntries(@Query() params: any) { return this.svc.findJournalEntries(params); }
  @Get('journal/:id') getEntry(@Param('id', ParseIntPipe) id: number) { return this.svc.getJournalEntry(id); }
  @Delete('journal/:id') deleteEntry(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteJournalEntry(id); }

  // ميزان المراجعة
  @Get('trial-balance') @ApiOperation({ summary: 'ميزان المراجعة (mzan)' }) trialBalance(@Query('dateFrom') df?: string, @Query('dateTo') dt?: string) { return this.svc.getTrialBalance(df, dt); }

  // كشف حساب
  @Get('account-statement/:noa') @ApiOperation({ summary: 'كشف حساب محاسبي (amlall)' }) accountStatement(@Param('noa', ParseIntPipe) noa: number, @Query('dateFrom') df?: string, @Query('dateTo') dt?: string) { return this.svc.getAccountStatement(noa, df, dt); }

  // إقفال
  @Post('monthly-closing') @ApiOperation({ summary: 'إقفال شهري (akfa)' }) closing(@Body('month') m: number, @Body('year') y: number) { return this.svc.monthlyClosing(m, y); }

  // التصنيفات
  @Post('categories') @ApiOperation({ summary: 'إنشاء تصنيف (KAK)' }) createCat(@Body() dto: any) { return this.svc.createCategory(dto); }
  @Get('categories') @ApiOperation({ summary: 'قائمة التصنيفات' }) findCats() { return this.svc.findAllCategories(); }
  @Put('categories/:id') updateCat(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateCategory(id, dto); }

  // المذكرات
  @Post('memos') @ApiOperation({ summary: 'إنشاء مذكرة (memo)' }) createMemo(@Body() dto: any) { return this.svc.createMemo(dto); }
  @Get('memos') @ApiOperation({ summary: 'قائمة المذكرات' }) findMemos(@Query('noa') noa?: number) { return this.svc.findMemos(noa ? +noa : undefined); }
}

// ═══════ MODULE ═══════

@Module({
  imports: [TypeOrmModule.forFeature([ElecJournalEntryEntity, ElecCategoryEntity, ElecMemoEntity])],
  controllers: [ElecAccountingController],
  providers: [ElecAccountingService],
  exports: [ElecAccountingService],
})
export class ElecAccountingModule {}
