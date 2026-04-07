// =============================================
// وحدة السندات الكاملة
// SNDK/F + SNDS/F + SNDKY/F + SNDKO/F + SNDKNET/F + SNDK_A
// =============================================
import { Injectable, NotFoundException, BadRequestException, Logger, Module, Controller,
  Get, Post, Put, Delete, Patch, Body, Param, Query, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository, Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, DataSource } from 'typeorm';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsOptional, IsNumber, IsDateString, IsArray, ValidateNested, IsIn, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// ═══════ GENERIC VOUCHER ENTITY (يُستخدم لكل أنواع السندات) ═══════

@Entity('sndk')
export class ReceiptVoucherEntity {
  @PrimaryGeneratedColumn({ name: 'nos' }) nos: number;
  @Column({ name: 'noson', type: 'int', nullable: true }) noson: number;
  @Column({ name: 'dates', type: 'date' }) dates: Date;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'namea', type: 'varchar', length: 200, nullable: true }) namea: string;
  @Column({ name: 'totals', type: 'decimal', precision: 18, scale: 2, default: 0 }) totals: number;
  @Column({ name: 'memos', type: 'text', nullable: true }) memos: string;
  @Column({ name: 'nms', type: 'text', nullable: true }) nms: string;
  @Column({ name: 'noas', type: 'int', nullable: true }) noas: number;
  @Column({ name: 'nok', type: 'int', nullable: true }) nok: number;
  @Column({ name: 'nokon', type: 'int', nullable: true }) nokon: number;
  @Column({ name: 'amr', type: 'int', default: 0 }) amr: number;
  @Column({ name: 'sds', type: 'varchar', length: 50, nullable: true }) sds: string;
  @Column({ name: 'nousx', type: 'int', nullable: true }) nousx: number;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @OneToMany(() => ReceiptVoucherDetailEntity, d => d.voucher, { cascade: true, eager: true }) details: ReceiptVoucherDetailEntity[];
}

@Entity('sndkf')
export class ReceiptVoucherDetailEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos_parent', type: 'int' }) nosParent: number;
  @Column({ name: 'noaf', type: 'int', nullable: true }) noaf: number;
  @Column({ name: 'nameaf', type: 'varchar', length: 200, nullable: true }) nameaf: string;
  @Column({ name: 'amount', type: 'decimal', precision: 18, scale: 2, default: 0 }) amount: number;
  @Column({ name: 'noaon', type: 'int', nullable: true }) noaon: number;
  @Column({ name: 'notes', type: 'text', nullable: true }) notes: string;
  @ManyToOne(() => ReceiptVoucherEntity, v => v.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'nos_parent', referencedColumnName: 'nos' }) voucher: ReceiptVoucherEntity;
}

// Payment, Daily, Other, Net vouchers follow same pattern
@Entity('snds') export class PaymentVoucherEntity {
  @PrimaryGeneratedColumn({ name: 'nos' }) nos: number;
  @Column({ name: 'noson', type: 'int', nullable: true }) noson: number;
  @Column({ name: 'dates', type: 'date' }) dates: Date;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'namea', type: 'varchar', length: 200, nullable: true }) namea: string;
  @Column({ name: 'totals', type: 'decimal', precision: 18, scale: 2, default: 0 }) totals: number;
  @Column({ name: 'memos', type: 'text', nullable: true }) memos: string;
  @Column({ name: 'amr', type: 'int', default: 0 }) amr: number;
  @Column({ name: 'nousx', type: 'int', nullable: true }) nousx: number;
  @OneToMany(() => PaymentVoucherDetailEntity, d => d.voucher, { cascade: true, eager: true }) details: PaymentVoucherDetailEntity[];
}
@Entity('sndsf') export class PaymentVoucherDetailEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos_parent', type: 'int' }) nosParent: number;
  @Column({ name: 'noaf', type: 'int', nullable: true }) noaf: number;
  @Column({ name: 'nameaf', type: 'varchar', length: 200, nullable: true }) nameaf: string;
  @Column({ name: 'amount', type: 'decimal', precision: 18, scale: 2, default: 0 }) amount: number;
  @Column({ name: 'notes', type: 'text', nullable: true }) notes: string;
  @ManyToOne(() => PaymentVoucherEntity, v => v.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'nos_parent', referencedColumnName: 'nos' }) voucher: PaymentVoucherEntity;
}

@Entity('sndky') export class DailyVoucherEntity {
  @PrimaryGeneratedColumn({ name: 'nos' }) nos: number;
  @Column({ name: 'noson', type: 'int', nullable: true }) noson: number;
  @Column({ name: 'dates', type: 'date' }) dates: Date;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'namea', type: 'varchar', length: 200, nullable: true }) namea: string;
  @Column({ name: 'totals', type: 'decimal', precision: 18, scale: 2, default: 0 }) totals: number;
  @Column({ name: 'memos', type: 'text', nullable: true }) memos: string;
  @OneToMany(() => DailyVoucherDetailEntity, d => d.voucher, { cascade: true, eager: true }) details: DailyVoucherDetailEntity[];
}
@Entity('sndkyf') export class DailyVoucherDetailEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos_parent', type: 'int' }) nosParent: number;
  @Column({ name: 'noaf', type: 'int', nullable: true }) noaf: number;
  @Column({ name: 'nameaf', type: 'varchar', length: 200, nullable: true }) nameaf: string;
  @Column({ name: 'amount', type: 'decimal', precision: 18, scale: 2, default: 0 }) amount: number;
  @Column({ name: 'notes', type: 'text', nullable: true }) notes: string;
  @ManyToOne(() => DailyVoucherEntity, v => v.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'nos_parent', referencedColumnName: 'nos' }) voucher: DailyVoucherEntity;
}

@Entity('sndknet') export class NetVoucherEntity {
  @PrimaryGeneratedColumn({ name: 'nos' }) nos: number;
  @Column({ name: 'noson', type: 'int', nullable: true }) noson: number;
  @Column({ name: 'dates', type: 'date' }) dates: Date;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'namea', type: 'varchar', length: 200, nullable: true }) namea: string;
  @Column({ name: 'totals', type: 'decimal', precision: 18, scale: 2, default: 0 }) totals: number;
  @Column({ name: 'memos', type: 'text', nullable: true }) memos: string;
}

// ═══════ DTOs ═══════

class VoucherDetailDto {
  @ApiProperty({ example: 101 }) @IsInt() noaf: number;
  @ApiPropertyOptional() @IsOptional() @IsString() nameaf?: string;
  @ApiProperty({ example: 250000 }) @IsNumber() @Min(1) amount: number;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

class CreateVoucherDto {
  @ApiProperty({ example: '2026-04-07' }) @IsDateString() dates: string;
  @ApiProperty({ example: 101 }) @IsInt() noa: number;
  @ApiPropertyOptional() @IsOptional() @IsString() namea?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() memos?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nms?: string;
  @ApiPropertyOptional({ enum: ['cash','check','transfer'] }) @IsOptional() @IsString() sds?: string;
  @ApiProperty({ type: [VoucherDetailDto] }) @IsArray() @ValidateNested({ each: true }) @Type(() => VoucherDetailDto) details: VoucherDetailDto[];
}

// ═══════ GENERIC VOUCHER SERVICE ═══════

@Injectable()
class VouchersService {
  private readonly logger = new Logger(VouchersService.name);
  constructor(
    @InjectRepository(ReceiptVoucherEntity) private readonly receiptRepo: Repository<ReceiptVoucherEntity>,
    @InjectRepository(ReceiptVoucherDetailEntity) private readonly receiptDetailRepo: Repository<ReceiptVoucherDetailEntity>,
    @InjectRepository(PaymentVoucherEntity) private readonly paymentRepo: Repository<PaymentVoucherEntity>,
    @InjectRepository(PaymentVoucherDetailEntity) private readonly paymentDetailRepo: Repository<PaymentVoucherDetailEntity>,
    @InjectRepository(DailyVoucherEntity) private readonly dailyRepo: Repository<DailyVoucherEntity>,
    @InjectRepository(DailyVoucherDetailEntity) private readonly dailyDetailRepo: Repository<DailyVoucherDetailEntity>,
    @InjectRepository(NetVoucherEntity) private readonly netRepo: Repository<NetVoucherEntity>,
    private readonly dataSource: DataSource,
  ) {}

  private getYearExpression(alias: string): string {
    const dbType = String((this.dataSource.options as any)?.type || '').toLowerCase();
    return dbType.includes('sqlite')
      ? `CAST(strftime('%Y', ${alias}.dates) AS INTEGER)`
      : `EXTRACT(YEAR FROM ${alias}.dates)`;
  }

  // ─── Generic CRUD factory ───
  private getRepo(type: string): { main: Repository<any>, detail: Repository<any> | null } {
    switch (type) {
      case 'receipt': return { main: this.receiptRepo, detail: this.receiptDetailRepo };
      case 'payment': return { main: this.paymentRepo, detail: this.paymentDetailRepo };
      case 'daily': return { main: this.dailyRepo, detail: this.dailyDetailRepo };
      case 'net': return { main: this.netRepo, detail: null };
      default: throw new BadRequestException('نوع السند غير صالح');
    }
  }

  async create(type: string, dto: CreateVoucherDto, userId: number) {
    const { main, detail } = this.getRepo(type);
    const year = new Date(dto.dates).getFullYear();
    const yearExpr = this.getYearExpression('v');
    const last = await main.createQueryBuilder('v').where(`${yearExpr} = :year`, { year }).orderBy('v.noson', 'DESC').getOne();
    const noson = (last?.noson || 0) + 1;
    const totals = dto.details.reduce((s, d) => s + d.amount, 0);

    const voucher = main.create({
      noson, dates: dto.dates, noa: dto.noa, namea: dto.namea,
      totals, memos: dto.memos, nms: dto.nms, sds: dto.sds, amr: 0, nousx: userId,
      ...(detail ? { details: dto.details.map(d => detail.create(d)) } : {}),
    });
    const saved = await main.save(voucher);
    this.logger.log(`سند ${type} جديد #${saved.nos} - ${totals}`);
    return { data: saved, message: `تم إنشاء سند ${this.getTypeName(type)} رقم ${saved.nos}` };
  }

  async findAll(type: string, pagination: PaginationDto, from?: string, to?: string) {
    const { main, detail } = this.getRepo(type);
    const { page, pageSize, skip, search, sortOrder } = pagination;
    const qb = main.createQueryBuilder('v');
    if (detail) {
      qb.leftJoinAndSelect('v.details', 'details');
    }
    if (from && to) qb.where('v.dates BETWEEN :from AND :to', { from, to });
    if (search) qb.andWhere('(v.namea LIKE :s OR v.memos LIKE :s)', { s: `%${search}%` });
    qb.orderBy('v.nos', sortOrder || 'DESC').skip(skip).take(pageSize);
    const [data, totalCount] = await qb.getManyAndCount();
    return { data, totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize) };
  }

  async findOne(type: string, nos: number) {
    const { main } = this.getRepo(type);
    const v = await main.findOne({ where: { nos }, relations: ['details'] });
    if (!v) throw new NotFoundException(`السند غير موجود`);
    return { data: v };
  }

  async update(type: string, nos: number, dto: Partial<CreateVoucherDto>) {
    const { main, detail } = this.getRepo(type);
    const v = await main.findOne({ where: { nos } });
    if (!v) throw new NotFoundException(`السند غير موجود`);
    if (v.amr === 1) throw new BadRequestException('لا يمكن تعديل سند مرحّل');
    if (dto.details && detail) {
      await detail.delete({ nosParent: nos });
      v.details = dto.details.map(d => detail.create({ ...d, nosParent: nos }));
      v.totals = dto.details.reduce((s, d) => s + d.amount, 0);
    }
    if (dto.dates) v.dates = dto.dates as any;
    if (dto.memos !== undefined) v.memos = dto.memos;
    return { data: await main.save(v), message: 'تم تحديث السند' };
  }

  async remove(type: string, nos: number) {
    const { main, detail } = this.getRepo(type);
    const v = await main.findOne({ where: { nos } });
    if (!v) throw new NotFoundException(`السند غير موجود`);
    if (v.amr === 1) throw new BadRequestException('لا يمكن حذف سند مرحّل');
    if (detail) await detail.delete({ nosParent: nos });
    await main.remove(v);
    return { message: `تم حذف السند ${nos}` };
  }

  async post(type: string, nos: number) {
    const { main } = this.getRepo(type);
    const v = await main.findOne({ where: { nos } });
    if (!v) throw new NotFoundException(`السند غير موجود`);
    if (v.amr === 1) throw new BadRequestException('مرحّل مسبقاً');
    v.amr = 1; await main.save(v);
    return { message: 'تم الترحيل' };
  }

  async getStats() {
    const rc = await this.receiptRepo.count(); const rt = await this.receiptRepo.createQueryBuilder('v').select('COALESCE(SUM(v.totals),0)','t').getRawOne();
    const pc = await this.paymentRepo.count(); const pt = await this.paymentRepo.createQueryBuilder('v').select('COALESCE(SUM(v.totals),0)','t').getRawOne();
    return { data: { receipt: { count: rc, total: +rt.t }, payment: { count: pc, total: +pt.t } } };
  }

  private getTypeName(t: string) { return { receipt:'قبض', payment:'صرف', daily:'يومي', net:'شبكة' }[t] || t; }
}

// ═══════ CONTROLLER ═══════

@ApiTags('vouchers')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('vouchers')
class VouchersController {
  constructor(private readonly svc: VouchersService) {}

  @Get('stats') @ApiOperation({ summary: 'إحصائيات السندات' }) getStats() { return this.svc.getStats(); }

  // Receipt
  @Post('receipt') @ApiOperation({ summary: 'سند قبض جديد (SNDK)' }) createReceipt(@Body() dto: CreateVoucherDto, @Request() req) { return this.svc.create('receipt', dto, req.user.userId); }
  @Get('receipt') @ApiOperation({ summary: 'قائمة سندات القبض' }) findAllReceipt(@Query() p: PaginationDto, @Query('from') from?: string, @Query('to') to?: string) { return this.svc.findAll('receipt', p, from, to); }
  @Get('receipt/:id') @ApiOperation({ summary: 'تفاصيل سند قبض' }) findOneReceipt(@Param('id', ParseIntPipe) id: number) { return this.svc.findOne('receipt', id); }
  @Put('receipt/:id') @ApiOperation({ summary: 'تحديث سند قبض' }) updateReceipt(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateVoucherDto) { return this.svc.update('receipt', id, dto); }
  @Delete('receipt/:id') @ApiOperation({ summary: 'حذف سند قبض' }) removeReceipt(@Param('id', ParseIntPipe) id: number) { return this.svc.remove('receipt', id); }
  @Patch('receipt/:id/post') @ApiOperation({ summary: 'ترحيل سند قبض' }) postReceipt(@Param('id', ParseIntPipe) id: number) { return this.svc.post('receipt', id); }

  // Payment
  @Post('payment') @ApiOperation({ summary: 'سند صرف جديد (SNDS)' }) createPayment(@Body() dto: CreateVoucherDto, @Request() req) { return this.svc.create('payment', dto, req.user.userId); }
  @Get('payment') @ApiOperation({ summary: 'قائمة سندات الصرف' }) findAllPayment(@Query() p: PaginationDto, @Query('from') from?: string, @Query('to') to?: string) { return this.svc.findAll('payment', p, from, to); }
  @Get('payment/:id') findOnePayment(@Param('id', ParseIntPipe) id: number) { return this.svc.findOne('payment', id); }
  @Put('payment/:id') updatePayment(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateVoucherDto) { return this.svc.update('payment', id, dto); }
  @Delete('payment/:id') removePayment(@Param('id', ParseIntPipe) id: number) { return this.svc.remove('payment', id); }
  @Patch('payment/:id/post') postPayment(@Param('id', ParseIntPipe) id: number) { return this.svc.post('payment', id); }

  // Daily
  @Post('daily') @ApiOperation({ summary: 'سند يومي جديد (SNDKY)' }) createDaily(@Body() dto: CreateVoucherDto, @Request() req) { return this.svc.create('daily', dto, req.user.userId); }
  @Get('daily') findAllDaily(@Query() p: PaginationDto) { return this.svc.findAll('daily', p); }
  @Get('daily/:id') findOneDaily(@Param('id', ParseIntPipe) id: number) { return this.svc.findOne('daily', id); }

  // Net
  @Post('net') @ApiOperation({ summary: 'سند شبكة جديد (SNDKNET)' }) createNet(@Body() dto: CreateVoucherDto, @Request() req) { return this.svc.create('net', dto, req.user.userId); }
  @Get('net') findAllNet(@Query() p: PaginationDto) { return this.svc.findAll('net', p); }
}

// ═══════ MODULE ═══════
@Module({
  imports: [TypeOrmModule.forFeature([
    ReceiptVoucherEntity, ReceiptVoucherDetailEntity,
    PaymentVoucherEntity, PaymentVoucherDetailEntity,
    DailyVoucherEntity, DailyVoucherDetailEntity,
    NetVoucherEntity,
  ])],
  controllers: [VouchersController],
  providers: [VouchersService],
  exports: [VouchersService],
})
export class VouchersModule {}
