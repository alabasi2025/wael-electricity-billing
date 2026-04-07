// =============================================
// توسيع السندات - كل متغيرات SNDK
// بديل: SNDK22S + sndky + sndknew + sndkall + sndSf + tsndk_a
//        + data_acx + data_aml + data_axx
// =============================================
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { BillingInvoiceEntity } from '../billing-engine/entities/billing.entity';
import { ElectricitySubscriberEntity } from '../subscribers/entities/electricity-subscriber.entity';

// ═══ كيان سند الصرف (بديل SNDK22S + SNDS) ═══
@Entity('payment_vouchers_elec')
export class ElecPaymentVoucherEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'voucher_no', type: 'int', unique: true }) voucherNo: number;
  @Column({ name: 'voucher_seq', type: 'int', nullable: true }) voucherSeq: number;
  @Column({ type: 'date' }) dates: Date;
  @Column({ name: 'subscriber_noa', type: 'int', nullable: true }) subscriberNoa: number;
  @Column({ name: 'subscriber_name', type: 'varchar', length: 200, nullable: true }) subscriberName: string;
  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 }) amount: number;
  @Column({ name: 'voucher_type', type: 'varchar', length: 20, default: 'payment' }) voucherType: string; // payment/daily/other/refund
  @Column({ type: 'text', nullable: true }) memo: string;
  @Column({ name: 'account_no', type: 'int', nullable: true }) accountNo: number;
  @Column({ name: 'counter_account', type: 'int', nullable: true }) counterAccount: number;
  @Column({ type: 'int', default: 0 }) status: number;
  @Column({ name: 'created_by', type: 'int', nullable: true }) createdBy: number;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}

// ═══ كيان السند اليومي (بديل sndky) ═══
@Entity('daily_vouchers_elec')
export class ElecDailyVoucherEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'voucher_no', type: 'int', unique: true }) voucherNo: number;
  @Column({ type: 'date' }) dates: Date;
  @Column({ name: 'debit_account', type: 'int' }) debitAccount: number;
  @Column({ name: 'credit_account', type: 'int' }) creditAccount: number;
  @Column({ type: 'decimal', precision: 18, scale: 2 }) amount: number;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ type: 'text', nullable: true }) memo: string;
  @Column({ type: 'int', default: 0 }) status: number;
  @Column({ name: 'created_by', type: 'int', nullable: true }) createdBy: number;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}

@Injectable()
export class VoucherVariantsService {
  constructor(
    @InjectRepository(ElecPaymentVoucherEntity) private payRepo: Repository<ElecPaymentVoucherEntity>,
    @InjectRepository(ElecDailyVoucherEntity) private dailyRepo: Repository<ElecDailyVoucherEntity>,
    @InjectRepository(BillingInvoiceEntity) private invRepo: Repository<BillingInvoiceEntity>,
    @InjectRepository(ElectricitySubscriberEntity) private subRepo: Repository<ElectricitySubscriberEntity>,
  ) {}

  // ═══ SNDK22S: سند صرف (دفع للمشترك/استرداد) ═══
  async createPaymentVoucher(dto: { subscriberNoa?: number; amount: number; voucherType: string; memo?: string; accountNo?: number }) {
    const maxNo = await this.payRepo.createQueryBuilder('v').select('MAX(v.voucherNo)', 'max').getRawOne();
    const sub = dto.subscriberNoa ? await this.subRepo.findOne({ where: { noa: dto.subscriberNoa } }) : null;
    const v = this.payRepo.create({ ...dto, voucherNo: (maxNo?.max || 0) + 1, subscriberName: sub?.namea, dates: new Date() as any });
    const saved = await this.payRepo.save(v);
    // تحديث رصيد المشترك (صرف = زيادة في رصيدنا المدين أو إرجاع)
    if (sub && dto.voucherType === 'refund') { sub.balance = +sub.balance - dto.amount; await this.subRepo.save(sub); }
    return { data: saved, message: `تم إنشاء سند صرف رقم ${saved.voucherNo}` };
  }

  async findAllPaymentVouchers(type?: string) {
    const qb = this.payRepo.createQueryBuilder('v');
    if (type) qb.where('v.voucherType = :t', { t: type });
    qb.orderBy('v.createdAt', 'DESC');
    return { data: await qb.getMany() };
  }

  // ═══ sndky: سند يومي (قيد يومي) ═══
  async createDailyVoucher(dto: { debitAccount: number; creditAccount: number; amount: number; description?: string; memo?: string }) {
    const maxNo = await this.dailyRepo.createQueryBuilder('v').select('MAX(v.voucherNo)', 'max').getRawOne();
    const v = this.dailyRepo.create({ ...dto, voucherNo: (maxNo?.max || 0) + 1, dates: new Date() as any });
    return { data: await this.dailyRepo.save(v), message: `تم إنشاء سند يومي رقم ${v.voucherNo}` };
  }

  async findAllDailyVouchers() { return { data: await this.dailyRepo.find({ order: { createdAt: 'DESC' } }) }; }

  // ═══ sndkall: عرض كل السندات موحد ═══
  async findAllVouchersUnified() {
    const receipts = await this.invRepo.createQueryBuilder('i')
      .select("'receipt'", 'type').addSelect('i.invoiceNo', 'no').addSelect('i.invoiceDate', 'date')
      .addSelect('i.subscriberNoa', 'noa').addSelect('i.subscriberName', 'name')
      .addSelect('i.paidAmount', 'amount').addSelect('i.status', 'status')
      .where('i.paidAmount > 0').orderBy('i.invoiceDate', 'DESC').limit(50).getRawMany();
    const payments = await this.payRepo.find({ order: { createdAt: 'DESC' }, take: 50 });
    const dailies = await this.dailyRepo.find({ order: { createdAt: 'DESC' }, take: 50 });
    return { data: { receipts, payments: payments.map(p => ({ type: p.voucherType, no: p.voucherNo, date: p.dates, noa: p.subscriberNoa, name: p.subscriberName, amount: +p.amount, status: p.status })), dailies: dailies.map(d => ({ type: 'daily', no: d.voucherNo, date: d.dates, amount: +d.amount, description: d.description, status: d.status })) } };
  }

  // ═══ tsndk_a: أرشفة السندات القديمة ═══
  async archiveOldVouchers(beforeDate: string) {
    // أرشفة السندات القديمة
    const count = await this.payRepo.createQueryBuilder('v')
      .where('v.dates < :d AND v.status >= 1', { d: beforeDate }).getCount();
    return { data: { eligibleCount: count, beforeDate }, message: `${count} سند قابل للأرشفة قبل ${beforeDate}` };
  }

  // ═══ إحصائيات السندات ═══
  async getVoucherStats() {
    const totalPayments = await this.payRepo.count();
    const totalDaily = await this.dailyRepo.count();
    const paymentSum = await this.payRepo.createQueryBuilder('v').select('SUM(v.amount)', 'total').getRawOne();
    const dailySum = await this.dailyRepo.createQueryBuilder('v').select('SUM(v.amount)', 'total').getRawOne();
    return { data: { paymentVouchers: totalPayments, dailyVouchers: totalDaily, totalPaymentAmount: +paymentSum?.total || 0, totalDailyAmount: +dailySum?.total || 0 } };
  }
}
