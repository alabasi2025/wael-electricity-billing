// =============================================
// كيان المشترك الكهربائي الكامل (48 حقل)
// بديل: DATA_AM + DATA_MO
// =============================================
import {
  Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany,
  JoinColumn, CreateDateColumn, UpdateDateColumn, Index,
} from 'typeorm';

@Entity('electricity_subscribers')
@Index(['noa'], { unique: true })
@Index(['groupId'])
@Index(['collectorId'])
@Index(['meterNo'])
@Index(['status'])
@Index(['disconnectFlag'])
export class ElectricitySubscriberEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // ─── البيانات الأساسية ───
  @Column({ type: 'int', unique: true })
  noa: number;

  @Column({ type: 'int', nullable: true })
  noan: number;

  @Column({ name: 'namea', type: 'varchar', length: 200 })
  namea: string;

  @Column({ name: 'namegar', type: 'varchar', length: 200, nullable: true })
  namegar: string;

  @Column({ name: 'address_text', type: 'varchar', length: 500, nullable: true })
  addressText: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  qm: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  mobile: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tel: string;

  // ─── بيانات المجموعة والمنطقة ───
  @Column({ name: 'group_id', type: 'int', nullable: true })
  groupId: number;

  @Column({ name: 'sub_group_id', type: 'int', nullable: true })
  subGroupId: number;

  @Column({ name: 'collector_id', type: 'int', nullable: true })
  collectorId: number;

  @Column({ name: 'area_id', type: 'int', nullable: true })
  areaId: number;

  @Column({ name: 'center_id', type: 'int', nullable: true })
  centerId: number;

  // ─── بيانات العداد ───
  @Column({ name: 'meter_no', type: 'varchar', length: 50, nullable: true })
  meterNo: string;

  @Column({ name: 'meter_catalog', type: 'varchar', length: 50, nullable: true })
  meterCatalog: string;

  @Column({ name: 'meter_type', type: 'int', default: 1 })
  meterType: number;

  @Column({ name: 'meter_extra', type: 'varchar', length: 50, nullable: true })
  meterExtra: string;

  @Column({ name: 'installation_year', type: 'int', nullable: true })
  installationYear: number;

  // ─── بيانات الفوترة والتسعير ───
  @Column({ name: 'billing_category', type: 'varchar', length: 20, default: 'ampere' })
  billingCategory: string;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2, default: 0 })
  unitPrice: number;

  @Column({ name: 'diff_price', type: 'decimal', precision: 10, scale: 2, default: 0 })
  diffPrice: number;

  @Column({ name: 'monthly_fee', type: 'decimal', precision: 10, scale: 2, default: 0 })
  monthlyFee: number;

  @Column({ name: 'min_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  minAmount: number;

  @Column({ name: 'min_amount2', type: 'decimal', precision: 10, scale: 2, default: 0 })
  minAmount2: number;

  @Column({ name: 'subscriber_type', type: 'int', default: 1 })
  subscriberType: number;

  @Column({ name: 'km_group', type: 'int', nullable: true })
  kmGroup: number;

  @Column({ name: 'km_type', type: 'int', nullable: true })
  kmType: number;

  @Column({ name: 'prepaid_flag', type: 'boolean', default: false })
  prepaidFlag: boolean;

  // ─── بيانات الحالة ───
  @Column({ type: 'int', default: 1 })
  status: number;

  @Column({ name: 'disconnect_flag', type: 'int', default: 0 })
  disconnectFlag: number;

  @Column({ name: 'network_flag', type: 'int', default: 0 })
  networkFlag: number;

  @Column({ name: 'active_flag', type: 'int', default: 1 })
  activeFlag: number;

  @Column({ name: 'electricity_status', type: 'int', default: 1 })
  electricityStatus: number;

  // ─── بيانات الرسائل ───
  @Column({ name: 'sms_enabled', type: 'boolean', default: false })
  smsEnabled: boolean;

  @Column({ name: 'sms_type', type: 'int', default: 0 })
  smsType: number;

  @Column({ name: 'message_type', type: 'int', default: 0 })
  messageType: number;

  @Column({ name: 'sms_flag', type: 'int', default: 0 })
  smsFlag: number;

  @Column({ name: 'contact_flag', type: 'int', default: 0 })
  contactFlag: number;

  // ─── بيانات مالية ───
  @Column({ name: 'debit_account', type: 'int', nullable: true })
  debitAccount: number;

  @Column({ name: 'debit_account2', type: 'int', nullable: true })
  debitAccount2: number;

  @Column({ name: 'serial_num', type: 'varchar', length: 50, nullable: true })
  serialNum: string;

  @Column({ name: 'secret_code', type: 'int', nullable: true })
  secretCode: number;

  @Column({ name: 'category_code', type: 'varchar', length: 20, nullable: true })
  categoryCode: string;

  @Column({ name: 'index_all', type: 'int', nullable: true })
  indexAll: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  balance: number;

  @Column({ name: 'voucher_no', type: 'int', nullable: true })
  voucherNo: number;

  // ─── بيانات إضافية ───
  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'work_flag', type: 'int', default: 0 })
  workFlag: number;

  @Column({ name: 'modification_flag', type: 'int', default: 0 })
  modificationFlag: number;

  @Column({ name: 'billing_date', type: 'date', nullable: true })
  billingDate: Date;

  @Column({ name: 'registration_date', type: 'date', nullable: true })
  registrationDate: Date;

  @Column({ name: 'billing_day', type: 'int', nullable: true })
  billingDay: number;

  @Column({ name: 'extra_address', type: 'text', nullable: true })
  extraAddress: string;

  // ─── طوابع زمنية ───
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
