// =============================================
// كيانات نظام الفوترة والترحيل
// بديل: FATM + FATMF + THOEL + التعرفة
// =============================================
import {
  Entity, Column, PrimaryGeneratedColumn, OneToMany,
  ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm';

// ─── خطة التعرفة ───
@Entity('tariff_plans')
export class TariffPlanEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ name: 'billing_type', type: 'varchar', length: 20, default: 'ampere' })
  billingType: string;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 4 })
  unitPrice: number;

  @Column({ name: 'min_charge', type: 'decimal', precision: 10, scale: 2, default: 0 })
  minCharge: number;

  @Column({ name: 'fixed_fee', type: 'decimal', precision: 10, scale: 2, default: 0 })
  fixedFee: number;

  @Column({ name: 'tax_rate', type: 'decimal', precision: 5, scale: 2, default: 0 })
  taxRate: number;

  @Column({ name: 'service_fee', type: 'decimal', precision: 10, scale: 2, default: 0 })
  serviceFee: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'effective_from', type: 'date', nullable: true })
  effectiveFrom: Date;

  @Column({ name: 'effective_to', type: 'date', nullable: true })
  effectiveTo: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => TariffTierEntity, tier => tier.tariff, { cascade: true, eager: true })
  tiers: TariffTierEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

// ─── شرائح الاستهلاك ───
@Entity('tariff_tiers')
export class TariffTierEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'tariff_id', type: 'int' })
  tariffId: number;

  @Column({ name: 'tier_order', type: 'int' })
  tierOrder: number;

  @Column({ name: 'from_units', type: 'decimal', precision: 10, scale: 2 })
  fromUnits: number;

  @Column({ name: 'to_units', type: 'decimal', precision: 10, scale: 2, nullable: true })
  toUnits: number;

  @Column({ name: 'price_per_unit', type: 'decimal', precision: 10, scale: 4 })
  pricePerUnit: number;

  @ManyToOne(() => TariffPlanEntity, t => t.tiers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tariff_id' })
  tariff: TariffPlanEntity;
}

// ─── دورة الفوترة ───
@Entity('billing_cycles')
@Index(['billingMonth', 'billingYear'])
export class BillingCycleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cycle_name', type: 'varchar', length: 100 })
  cycleName: string;

  @Column({ name: 'billing_month', type: 'int' })
  billingMonth: number;

  @Column({ name: 'billing_year', type: 'int' })
  billingYear: number;

  @Column({ name: 'reading_cycle_id', type: 'int', nullable: true })
  readingCycleId: number;

  @Column({ name: 'group_id', type: 'int', nullable: true })
  groupId: number;

  @Column({ type: 'int', default: 0, comment: '0=مفتوح 1=مكتمل 2=مرحّل' })
  status: number;

  @Column({ name: 'total_invoices', type: 'int', default: 0 })
  totalInvoices: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ name: 'created_by', type: 'int', nullable: true })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;
}

// ─── الفاتورة (FATM) ───
@Entity('billing_invoices')
@Index(['billingCycleId'])
@Index(['subscriberNoa'])
@Index(['status'])
@Index(['invoiceDate'])
export class BillingInvoiceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'invoice_no', type: 'int', unique: true })
  invoiceNo: number;

  @Column({ name: 'invoice_seq', type: 'int', nullable: true })
  invoiceSeq: number;

  @Column({ name: 'billing_cycle_id', type: 'int' })
  billingCycleId: number;

  @Column({ name: 'subscriber_id', type: 'int' })
  subscriberId: number;

  @Column({ name: 'subscriber_noa', type: 'int' })
  subscriberNoa: number;

  @Column({ name: 'subscriber_name', type: 'varchar', length: 200, nullable: true })
  subscriberName: string;

  @Column({ name: 'reading_id', type: 'int', nullable: true })
  readingId: number;

  // ─── بيانات القراءة ───
  @Column({ name: 'prev_reading', type: 'decimal', precision: 18, scale: 2, default: 0 })
  prevReading: number;

  @Column({ name: 'curr_reading', type: 'decimal', precision: 18, scale: 2, default: 0 })
  currReading: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  consumption: number;

  // ─── بيانات مالية ───
  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 4, default: 0 })
  unitPrice: number;

  @Column({ name: 'consumption_amount', type: 'decimal', precision: 18, scale: 2, default: 0 })
  consumptionAmount: number;

  @Column({ name: 'fixed_fees', type: 'decimal', precision: 18, scale: 2, default: 0 })
  fixedFees: number;

  @Column({ name: 'service_fees', type: 'decimal', precision: 18, scale: 2, default: 0 })
  serviceFees: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 18, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ name: 'discount_amount', type: 'decimal', precision: 18, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ name: 'previous_balance', type: 'decimal', precision: 18, scale: 2, default: 0 })
  previousBalance: number;

  @Column({ name: 'grand_total', type: 'decimal', precision: 18, scale: 2, default: 0 })
  grandTotal: number;

  // ─── حالة ───
  @Column({ name: 'invoice_date', type: 'date' })
  invoiceDate: Date;

  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate: Date;

  @Column({ type: 'int', default: 0, comment: '0=مسودة 1=صادرة 2=مرحّلة 3=مسددة جزئياً 4=مسددة' })
  status: number;

  @Column({ name: 'paid_amount', type: 'decimal', precision: 18, scale: 2, default: 0 })
  paidAmount: number;

  @Column({ name: 'remaining_amount', type: 'decimal', precision: 18, scale: 2, default: 0 })
  remainingAmount: number;

  // ─── بيانات إضافية ───
  @Column({ name: 'tariff_id', type: 'int', nullable: true })
  tariffId: number;

  @Column({ name: 'account_no', type: 'int', nullable: true })
  accountNo: number;

  @Column({ name: 'counter_account', type: 'int', nullable: true })
  counterAccount: number;

  @Column({ name: 'invoice_type', type: 'int', default: 1 })
  invoiceType: number;

  @Column({ type: 'text', nullable: true })
  memo: string;

  @Column({ name: 'created_by', type: 'int', nullable: true })
  createdBy: number;

  @OneToMany(() => BillingInvoiceItemEntity, item => item.invoice, { cascade: true, eager: true })
  items: BillingInvoiceItemEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

// ─── بنود الفاتورة (FATMF) ───
@Entity('billing_invoice_items')
export class BillingInvoiceItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'invoice_id', type: 'int' })
  invoiceId: number;

  @Column({ name: 'item_type', type: 'varchar', length: 50 })
  itemType: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  description: string;

  @Column({ name: 'account_no', type: 'int', nullable: true })
  accountNo: number;

  @Column({ name: 'account_name', type: 'varchar', length: 200, nullable: true })
  accountName: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 4, default: 0 })
  unitPrice: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  amount: number;

  @Column({ name: 'debit_amount', type: 'decimal', precision: 18, scale: 2, default: 0 })
  debitAmount: number;

  @Column({ name: 'credit_amount', type: 'decimal', precision: 18, scale: 2, default: 0 })
  creditAmount: number;

  @Column({ name: 'item_order', type: 'int', default: 0 })
  itemOrder: number;

  @ManyToOne(() => BillingInvoiceEntity, inv => inv.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoice_id' })
  invoice: BillingInvoiceEntity;
}

// ─── الترحيل (THOEL) ───
@Entity('billing_postings')
@Index(['billingCycleId'])
@Index(['status'])
export class BillingPostingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'posting_no', type: 'int', unique: true })
  postingNo: number;

  @Column({ name: 'posting_seq', type: 'int', nullable: true })
  postingSeq: number;

  @Column({ name: 'posting_date', type: 'date' })
  postingDate: Date;

  @Column({ name: 'billing_cycle_id', type: 'int', nullable: true })
  billingCycleId: number;

  @Column({ name: 'invoice_id', type: 'int', nullable: true })
  invoiceId: number;

  @Column({ name: 'debit_account', type: 'int' })
  debitAccount: number;

  @Column({ name: 'credit_account', type: 'int' })
  creditAccount: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  amount: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  memo: string;

  @Column({ name: 'journal_no', type: 'int', nullable: true })
  journalNo: number;

  @Column({ name: 'journal_seq', type: 'int', nullable: true })
  journalSeq: number;

  @Column({ name: 'ref_voucher', type: 'int', nullable: true })
  refVoucher: number;

  @Column({ name: 'posted_by', type: 'int', nullable: true })
  postedBy: number;

  @Column({ type: 'int', default: 0, comment: '0=معلق 1=مرحّل 2=ملغي' })
  status: number;

  @Column({ name: 'approved_flag', type: 'int', default: 0 })
  approvedFlag: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'posted_at', type: 'timestamp', nullable: true })
  postedAt: Date;
}
