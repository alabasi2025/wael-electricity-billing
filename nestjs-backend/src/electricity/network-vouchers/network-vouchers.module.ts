// =============================================
// وحدة سندات الشبكة والدفع الإلكتروني
// بديل: sndknet.fmb + SNDKNET + SNDKNETF
// + صندوق النقد + أرشيف السندات + التسويات
// =============================================
import { Injectable, NotFoundException, BadRequestException, Module, Controller,
  Get, Post, Put, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository, Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsNumber, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

// ═══════ ENTITIES ═══════

@Entity('network_vouchers')
export class NetworkVoucherEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'voucher_no', type: 'int', unique: true }) voucherNo: number;
  @Column({ name: 'voucher_seq', type: 'int', nullable: true }) voucherSeq: number;
  @Column({ name: 'voucher_date', type: 'date' }) voucherDate: Date;
  @Column({ name: 'subscriber_noa', type: 'int' }) subscriberNoa: number;
  @Column({ name: 'subscriber_name', type: 'varchar', length: 200, nullable: true }) subscriberName: string;
  @Column({ type: 'decimal', precision: 18, scale: 2 }) amount: number;
  @Column({ name: 'payment_method', type: 'varchar', length: 50, default: 'network' }) paymentMethod: string;
  @Column({ name: 'reference_no', type: 'varchar', length: 100, nullable: true }) referenceNo: string;
  @Column({ name: 'bank_name', type: 'varchar', length: 200, nullable: true }) bankName: string;
  @Column({ type: 'text', nullable: true }) memo: string;
  @Column({ type: 'int', default: 0, comment: '0=معلق 1=مؤكد 2=مرحّل 3=مرفوض' }) status: number;
  @Column({ name: 'invoice_id', type: 'int', nullable: true }) invoiceId: number;
  @Column({ name: 'posted_to_sndk', type: 'int', nullable: true }) postedToSndk: number;
  @Column({ name: 'created_by', type: 'int', nullable: true }) createdBy: number;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @Column({ name: 'confirmed_at', type: 'timestamp', nullable: true }) confirmedAt: Date;
}

@Entity('cashboxes')
export class CashboxEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'varchar', length: 200 }) name: string;
  @Column({ name: 'account_no', type: 'int', nullable: true }) accountNo: number;
  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 }) balance: number;
  @Column({ type: 'int', default: 1 }) status: number;
  @Column({ name: 'responsible_user', type: 'int', nullable: true }) responsibleUser: number;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}

@Entity('voucher_archive')
export class VoucherArchiveEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'original_type', type: 'varchar', length: 50 }) originalType: string;
  @Column({ name: 'original_id', type: 'int' }) originalId: number;
  @Column({ name: 'voucher_no', type: 'int' }) voucherNo: number;
  @Column({ name: 'subscriber_noa', type: 'int', nullable: true }) subscriberNoa: number;
  @Column({ type: 'date' }) dates: Date;
  @Column({ type: 'decimal', precision: 18, scale: 2 }) amount: number;
  @Column({ type: 'text', nullable: true }) memo: string;
  @Column({ name: 'archived_by', type: 'int', nullable: true }) archivedBy: number;
  @CreateDateColumn({ name: 'archived_at' }) archivedAt: Date;
}

@Entity('financial_settlements')
export class FinancialSettlementEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'settlement_no', type: 'int', unique: true }) settlementNo: number;
  @Column({ name: 'subscriber_noa', type: 'int' }) subscriberNoa: number;
  @Column({ name: 'settlement_type', type: 'varchar', length: 50 }) settlementType: string;
  @Column({ name: 'original_amount', type: 'decimal', precision: 18, scale: 2 }) originalAmount: number;
  @Column({ name: 'settled_amount', type: 'decimal', precision: 18, scale: 2 }) settledAmount: number;
  @Column({ type: 'decimal', precision: 18, scale: 2 }) difference: number;
  @Column({ type: 'text', nullable: true }) reason: string;
  @Column({ name: 'invoice_id', type: 'int', nullable: true }) invoiceId: number;
  @Column({ name: 'voucher_no', type: 'int', nullable: true }) voucherNo: number;
  @Column({ type: 'int', default: 0 }) status: number;
  @Column({ name: 'approved_by', type: 'int', nullable: true }) approvedBy: number;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @Column({ name: 'approved_at', type: 'timestamp', nullable: true }) approvedAt: Date;
}

// ═══════ SERVICE ═══════
@Injectable()
export class NetworkVouchersService {
  constructor(
    @InjectRepository(NetworkVoucherEntity) private nvRepo: Repository<NetworkVoucherEntity>,
    @InjectRepository(CashboxEntity) private cbRepo: Repository<CashboxEntity>,
    @InjectRepository(VoucherArchiveEntity) private archRepo: Repository<VoucherArchiveEntity>,
    @InjectRepository(FinancialSettlementEntity) private settRepo: Repository<FinancialSettlementEntity>,
  ) {}

  // سندات الشبكة
  async createNetworkVoucher(dto: any) {
    const maxNo = await this.nvRepo.createQueryBuilder('n').select('MAX(n.voucherNo)','max').getRawOne();
    const nextNo = (maxNo?.max || 0) + 1;
    const voucher = this.nvRepo.create({ ...dto, voucherNo: nextNo });
    return { data: await this.nvRepo.save(voucher), message: `تم إنشاء سند شبكة رقم ${nextNo}` };
  }

  async findAllNetworkVouchers(status?: number) {
    const qb = this.nvRepo.createQueryBuilder('n');
    if (status !== undefined) qb.where('n.status = :s', { s: status });
    qb.orderBy('n.createdAt', 'DESC');
    return { data: await qb.getMany() };
  }

  async confirmNetworkVoucher(id: number) {
    const v = await this.nvRepo.findOne({ where: { id } });
    if (!v) throw new NotFoundException('السند غير موجود');
    if (v.status !== 0) throw new BadRequestException('السند مؤكد بالفعل');
    v.status = 1; v.confirmedAt = new Date();
    return { data: await this.nvRepo.save(v), message: 'تم تأكيد سند الشبكة' };
  }

  async postNetworkVoucher(id: number) {
    const v = await this.nvRepo.findOne({ where: { id } });
    if (!v) throw new NotFoundException('السند غير موجود');
    if (v.status !== 1) throw new BadRequestException('يجب تأكيد السند أولاً');
    v.status = 2;
    return { data: await this.nvRepo.save(v), message: 'تم ترحيل سند الشبكة' };
  }

  async getNetworkStats() {
    const total = await this.nvRepo.count();
    const pending = await this.nvRepo.count({ where: { status: 0 } });
    const confirmed = await this.nvRepo.count({ where: { status: 1 } });
    const posted = await this.nvRepo.count({ where: { status: 2 } });
    const totalAmount = await this.nvRepo.createQueryBuilder('n').select('SUM(n.amount)','total').where('n.status >= 1').getRawOne();
    return { data: { total, pending, confirmed, posted, totalAmount: +totalAmount?.total || 0 } };
  }

  // صندوق النقد
  async findAllCashboxes() { return { data: await this.cbRepo.find({ order: { id: 'ASC' } }) }; }
  async createCashbox(name: string, accountNo?: number) {
    return { data: await this.cbRepo.save(this.cbRepo.create({ name, accountNo })), message: 'تم إنشاء الصندوق' };
  }
  async updateCashboxBalance(id: number, amount: number, operation: 'add' | 'subtract') {
    const cb = await this.cbRepo.findOne({ where: { id } });
    if (!cb) throw new NotFoundException('الصندوق غير موجود');
    cb.balance = operation === 'add' ? +cb.balance + amount : +cb.balance - amount;
    return { data: await this.cbRepo.save(cb) };
  }

  // الأرشيف
  async archiveVoucher(type: string, originalId: number, voucherNo: number, subscriberNoa: number, dates: Date, amount: number, memo?: string) {
    return { data: await this.archRepo.save(this.archRepo.create({ originalType: type, originalId, voucherNo, subscriberNoa, dates, amount, memo })) };
  }
  async findArchive(subscriberNoa?: number) {
    const qb = this.archRepo.createQueryBuilder('a');
    if (subscriberNoa) qb.where('a.subscriberNoa = :n', { n: subscriberNoa });
    qb.orderBy('a.archivedAt', 'DESC');
    return { data: await qb.getMany() };
  }

  // التسويات المالية
  async createSettlement(dto: any) {
    const maxNo = await this.settRepo.createQueryBuilder('s').select('MAX(s.settlementNo)','max').getRawOne();
    const nextNo = (maxNo?.max || 0) + 1;
    const diff = (+dto.settledAmount || 0) - (+dto.originalAmount || 0);
    return { data: await this.settRepo.save(this.settRepo.create({ ...dto, settlementNo: nextNo, difference: diff })), message: `تم إنشاء تسوية رقم ${nextNo}` };
  }
  async findAllSettlements(subscriberNoa?: number) {
    const qb = this.settRepo.createQueryBuilder('s');
    if (subscriberNoa) qb.where('s.subscriberNoa = :n', { n: subscriberNoa });
    qb.orderBy('s.createdAt', 'DESC');
    return { data: await qb.getMany() };
  }
  async approveSettlement(id: number, userId?: number) {
    const s = await this.settRepo.findOne({ where: { id } });
    if (!s) throw new NotFoundException('التسوية غير موجودة');
    s.status = 1; s.approvedBy = userId; s.approvedAt = new Date();
    return { data: await this.settRepo.save(s), message: 'تم اعتماد التسوية' };
  }
}

// ═══════ CONTROLLER ═══════
@ApiTags('electricity/network')
@ApiBearerAuth('JWT-auth') @UseGuards(JwtAuthGuard)
@Controller('electricity/network')
export class NetworkVouchersController {
  constructor(private svc: NetworkVouchersService) {}

  @Get('stats') @ApiOperation({ summary: 'إحصائيات الشبكة' }) getStats() { return this.svc.getNetworkStats(); }
  @Post('vouchers') @ApiOperation({ summary: 'إنشاء سند شبكة' }) create(@Body() dto: any) { return this.svc.createNetworkVoucher(dto); }
  @Get('vouchers') @ApiOperation({ summary: 'قائمة سندات الشبكة' }) findAll(@Query('status') st?: number) { return this.svc.findAllNetworkVouchers(st !== undefined ? +st : undefined); }
  @Post('vouchers/:id/confirm') @ApiOperation({ summary: 'تأكيد سند شبكة' }) confirm(@Param('id', ParseIntPipe) id: number) { return this.svc.confirmNetworkVoucher(id); }
  @Post('vouchers/:id/post') @ApiOperation({ summary: 'ترحيل سند شبكة' }) post(@Param('id', ParseIntPipe) id: number) { return this.svc.postNetworkVoucher(id); }

  @Get('cashboxes') @ApiOperation({ summary: 'صناديق النقد' }) getCashboxes() { return this.svc.findAllCashboxes(); }
  @Post('cashboxes') @ApiOperation({ summary: 'إنشاء صندوق' }) createCashbox(@Body('name') name: string, @Body('accountNo') acc?: number) { return this.svc.createCashbox(name, acc); }

  @Get('archive') @ApiOperation({ summary: 'أرشيف السندات' }) getArchive(@Query('noa') noa?: number) { return this.svc.findArchive(noa ? +noa : undefined); }

  @Post('settlements') @ApiOperation({ summary: 'إنشاء تسوية مالية' }) createSettlement(@Body() dto: any) { return this.svc.createSettlement(dto); }
  @Get('settlements') @ApiOperation({ summary: 'قائمة التسويات' }) getSettlements(@Query('noa') noa?: number) { return this.svc.findAllSettlements(noa ? +noa : undefined); }
  @Post('settlements/:id/approve') @ApiOperation({ summary: 'اعتماد تسوية' }) approve(@Param('id', ParseIntPipe) id: number) { return this.svc.approveSettlement(id); }
}

@Module({
  imports: [TypeOrmModule.forFeature([NetworkVoucherEntity, CashboxEntity, VoucherArchiveEntity, FinancialSettlementEntity])],
  controllers: [NetworkVouchersController], providers: [NetworkVouchersService], exports: [NetworkVouchersService],
})
export class NetworkVouchersModule {}
