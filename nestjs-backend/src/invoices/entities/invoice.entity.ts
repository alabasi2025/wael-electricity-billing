// =============================================
// كيانات الفواتير (بدون تكرار data_ac)
// =============================================
import {
  Entity, Column, PrimaryGeneratedColumn,
  ManyToOne, OneToMany, JoinColumn, CreateDateColumn,
} from 'typeorm';
import { SubAccountEntity } from '../../accounts/entities/account.entity';

// Re-export for backward compatibility
export { SubAccountEntity as AccountEntity } from '../../accounts/entities/account.entity';

// ─── فاتورة مبيعات (FATM) ───
@Entity('fatm')
export class SalesInvoiceEntity {
  @PrimaryGeneratedColumn({ name: 'nos' }) nos: number;
  @Column({ name: 'noson', type: 'int', nullable: true }) noson: number;
  @Column({ name: 'dates', type: 'date' }) dates: Date;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'namea', type: 'varchar', length: 200, nullable: true }) namea: string;
  @Column({ name: 'totals', type: 'decimal', precision: 18, scale: 2, default: 0 }) totals: number;
  @Column({ name: 'notes', type: 'text', nullable: true }) notes: string;
  @Column({ name: 'amr', type: 'int', default: 0 }) amr: number;
  @Column({ name: 'nousx', type: 'int', nullable: true }) nousx: number;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @OneToMany(() => SalesInvoiceDetailEntity, (d) => d.invoice, { cascade: true, eager: true }) details: SalesInvoiceDetailEntity[];
  @ManyToOne(() => SubAccountEntity) @JoinColumn({ name: 'noa', referencedColumnName: 'noa' }) account: SubAccountEntity;
}

@Entity('fatmf')
export class SalesInvoiceDetailEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos_parent', type: 'int' }) nosParent: number;
  @Column({ name: 'item_name', type: 'varchar', length: 200, nullable: true }) itemName: string;
  @Column({ name: 'quantity', type: 'decimal', precision: 10, scale: 2, default: 0 }) quantity: number;
  @Column({ name: 'price', type: 'decimal', precision: 18, scale: 2, default: 0 }) price: number;
  @Column({ name: 'total', type: 'decimal', precision: 18, scale: 2, default: 0 }) total: number;
  @Column({ name: 'notes', type: 'text', nullable: true }) notes: string;
  @ManyToOne(() => SalesInvoiceEntity, (i) => i.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'nos_parent', referencedColumnName: 'nos' }) invoice: SalesInvoiceEntity;
}

// ─── فاتورة مشتريات (FATB) ───
@Entity('fatb')
export class PurchaseInvoiceEntity {
  @PrimaryGeneratedColumn({ name: 'nos' }) nos: number;
  @Column({ name: 'noson', type: 'int', nullable: true }) noson: number;
  @Column({ name: 'dates', type: 'date' }) dates: Date;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'namea', type: 'varchar', length: 200, nullable: true }) namea: string;
  @Column({ name: 'totals', type: 'decimal', precision: 18, scale: 2, default: 0 }) totals: number;
  @Column({ name: 'notes', type: 'text', nullable: true }) notes: string;
  @Column({ name: 'amr', type: 'int', default: 0 }) amr: number;
  @Column({ name: 'nousx', type: 'int', nullable: true }) nousx: number;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @OneToMany(() => PurchaseInvoiceDetailEntity, (d) => d.invoice, { cascade: true, eager: true }) details: PurchaseInvoiceDetailEntity[];
  @ManyToOne(() => SubAccountEntity) @JoinColumn({ name: 'noa', referencedColumnName: 'noa' }) account: SubAccountEntity;
}

@Entity('fatbf')
export class PurchaseInvoiceDetailEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos_parent', type: 'int' }) nosParent: number;
  @Column({ name: 'item_name', type: 'varchar', length: 200, nullable: true }) itemName: string;
  @Column({ name: 'quantity', type: 'decimal', precision: 10, scale: 2, default: 0 }) quantity: number;
  @Column({ name: 'price', type: 'decimal', precision: 18, scale: 2, default: 0 }) price: number;
  @Column({ name: 'total', type: 'decimal', precision: 18, scale: 2, default: 0 }) total: number;
  @Column({ name: 'notes', type: 'text', nullable: true }) notes: string;
  @ManyToOne(() => PurchaseInvoiceEntity, (i) => i.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'nos_parent', referencedColumnName: 'nos' }) invoice: PurchaseInvoiceEntity;
}
