// =============================================
// كيانات نظام القراءات
// بديل: REDMZ + REDMMZ + TRK + A_D_TRK
// =============================================
import {
  Entity, Column, PrimaryGeneratedColumn, ManyToOne,
  JoinColumn, CreateDateColumn, UpdateDateColumn, Index, Unique,
} from 'typeorm';

// ─── دورة القراءة (REDMZ) ───
@Entity('meter_reading_cycles')
@Index(['status'])
@Index(['dateFrom', 'dateTo'])
export class MeterReadingCycleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cycle_no', type: 'int', unique: true })
  cycleNo: number;

  @Column({ name: 'cycle_seq', type: 'int', nullable: true })
  cycleSeq: number;

  @Column({ name: 'date_from', type: 'date' })
  dateFrom: Date;

  @Column({ name: 'date_to', type: 'date' })
  dateTo: Date;

  @Column({ type: 'int', default: 0, comment: '0=مفتوحة 1=مغلقة 2=مفوترة' })
  status: number;

  @Column({ name: 'group_id', type: 'int', nullable: true })
  groupId: number;

  @Column({ name: 'center_id', type: 'int', nullable: true })
  centerId: number;

  @Column({ name: 'total_subscribers', type: 'int', default: 0 })
  totalSubscribers: number;

  @Column({ name: 'total_read', type: 'int', default: 0 })
  totalRead: number;

  @Column({ name: 'total_consumption', type: 'decimal', precision: 18, scale: 2, default: 0 })
  totalConsumption: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'created_by', type: 'int', nullable: true })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'closed_at', type: 'timestamp', nullable: true })
  closedAt: Date;
}

// ─── قراءة تفصيلية (REDMMZ) ───
@Entity('meter_readings')
@Index(['cycleId'])
@Index(['subscriberNoa'])
@Index(['status'])
@Unique(['cycleId', 'subscriberNoa'])
export class MeterReadingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'cycle_id', type: 'int' })
  cycleId: number;

  @Column({ name: 'subscriber_id', type: 'int' })
  subscriberId: number;

  @Column({ name: 'subscriber_noa', type: 'int' })
  subscriberNoa: number;

  @Column({ name: 'meter_name', type: 'varchar', length: 200, nullable: true })
  meterName: string;

  @Column({ name: 'meter_extra_no', type: 'varchar', length: 50, nullable: true })
  meterExtraNo: string;

  // ─── بيانات القراءة ───
  @Column({ name: 'prev_reading', type: 'decimal', precision: 18, scale: 2, default: 0 })
  prevReading: number;

  @Column({ name: 'curr_reading', type: 'decimal', precision: 18, scale: 2, default: 0 })
  currReading: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  consumption: number;

  @Column({ name: 'adjusted_reading', type: 'decimal', precision: 18, scale: 2, default: 0 })
  adjustedReading: number;

  @Column({ name: 'adjustment_amount', type: 'decimal', precision: 18, scale: 2, default: 0 })
  adjustmentAmount: number;

  @Column({ name: 'net_consumption', type: 'decimal', precision: 18, scale: 2, default: 0 })
  netConsumption: number;

  @Column({ name: 'cumulative_diff', type: 'decimal', precision: 18, scale: 2, default: 0 })
  cumulativeDiff: number;

  @Column({ name: 'calculated_reading', type: 'decimal', precision: 18, scale: 2, default: 0 })
  calculatedReading: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2, default: 0 })
  unitPrice: number;

  // ─── تواريخ ───
  @Column({ name: 'reading_date_from', type: 'date', nullable: true })
  readingDateFrom: Date;

  @Column({ name: 'reading_date_to', type: 'date', nullable: true })
  readingDateTo: Date;

  @Column({ name: 'reading_date', type: 'timestamp', nullable: true })
  readingDate: Date;

  // ─── حالة ───
  @Column({ type: 'int', default: 0, comment: '0=معلق 1=مؤكد 2=شاذ 3=مفوتر' })
  status: number;

  @Column({ name: 'is_anomaly', type: 'boolean', default: false })
  isAnomaly: boolean;

  @Column({ name: 'anomaly_reason', type: 'text', nullable: true })
  anomalyReason: string;

  @Column({ name: 'record_no', type: 'int', nullable: true })
  recordNo: number;

  @Column({ name: 'entered_by', type: 'int', nullable: true })
  enteredBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

// ─── تغيير العداد (TRK) ───
@Entity('meter_changes')
export class MeterChangeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'subscriber_id', type: 'int' })
  subscriberId: number;

  @Column({ name: 'subscriber_noa', type: 'int' })
  subscriberNoa: number;

  @Column({ name: 'old_meter_no', type: 'varchar', length: 50, nullable: true })
  oldMeterNo: string;

  @Column({ name: 'new_meter_no', type: 'varchar', length: 50, nullable: true })
  newMeterNo: string;

  @Column({ name: 'removal_reading', type: 'decimal', precision: 18, scale: 2, nullable: true })
  removalReading: number;

  @Column({ name: 'install_reading', type: 'decimal', precision: 18, scale: 2, nullable: true })
  installReading: number;

  @Column({ name: 'change_date', type: 'date' })
  changeDate: Date;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ name: 'approved_by', type: 'int', nullable: true })
  approvedBy: number;

  @Column({ type: 'int', default: 0 })
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

// ─── تسوية القراءة (A_D_TRK) ───
@Entity('meter_reading_adjustments')
export class MeterReadingAdjustmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'subscriber_id', type: 'int' })
  subscriberId: number;

  @Column({ name: 'subscriber_noa', type: 'int' })
  subscriberNoa: number;

  @Column({ name: 'cycle_id', type: 'int', nullable: true })
  cycleId: number;

  @Column({ name: 'adjustment_type', type: 'varchar', length: 20 })
  adjustmentType: string;

  @Column({ name: 'old_value', type: 'decimal', precision: 18, scale: 2, nullable: true })
  oldValue: number;

  @Column({ name: 'new_value', type: 'decimal', precision: 18, scale: 2, nullable: true })
  newValue: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  difference: number;

  @Column({ type: 'text' })
  reason: string;

  @Column({ name: 'approved_by', type: 'int', nullable: true })
  approvedBy: number;

  @Column({ type: 'int', default: 0 })
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'approved_at', type: 'timestamp', nullable: true })
  approvedAt: Date;
}
