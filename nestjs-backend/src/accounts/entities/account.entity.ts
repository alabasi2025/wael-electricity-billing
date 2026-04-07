// =============================================
// كيانات الحسابات (Accounts Entities)
// DATA_A + DATA_AC + DATA_AM + GRP
// =============================================
import {
  Entity, Column, PrimaryColumn, PrimaryGeneratedColumn,
  ManyToOne, OneToMany, JoinColumn, CreateDateColumn,
} from 'typeorm';

// ─── دليل الحسابات الرئيسي (DATA_A) ───
@Entity('data_a')
export class ChartOfAccountEntity {
  @PrimaryColumn({ name: 'no_a', type: 'int' })
  noA: number;

  @Column({ name: 'name_a', type: 'varchar', length: 200 })
  nameA: string;

  @Column({ name: 'rep_a', type: 'varchar', length: 100, nullable: true })
  repA: string;

  @Column({ name: 'ind', type: 'int', nullable: true })
  ind: number;

  @Column({ name: 'ts', type: 'int', default: 0, comment: '0=أصول,1=خصوم,2=إيرادات,3=مصروفات,4=حقوق ملكية' })
  ts: number;

  @Column({ name: 'typea', type: 'int', nullable: true })
  typea: number;

  @OneToMany(() => SubAccountEntity, (sub) => sub.parentAccount)
  subAccounts: SubAccountEntity[];
}

// ─── الحسابات الفرعية (DATA_AC) ───
@Entity('data_ac')
export class SubAccountEntity {
  @PrimaryColumn({ name: 'noa', type: 'int' })
  noa: number;

  @Column({ name: 'namea', type: 'varchar', length: 200 })
  namea: string;

  @Column({ name: 'typea', type: 'int', nullable: true })
  typea: number;

  @Column({ name: 'noan', type: 'int', nullable: true })
  noan: number;

  @Column({ name: 'amlhh', type: 'decimal', precision: 15, scale: 2, nullable: true })
  amlhh: number;

  @Column({ name: 'saram', type: 'int', nullable: true })
  saram: number;

  @ManyToOne(() => ChartOfAccountEntity, (chart) => chart.subAccounts)
  @JoinColumn({ name: 'typea', referencedColumnName: 'noA' })
  parentAccount: ChartOfAccountEntity;

  @OneToMany(() => AccountDetailEntity, (detail) => detail.account)
  details: AccountDetailEntity[];
}

// ─── تفاصيل الحسابات (DATA_AM) ───
@Entity('data_am')
export class AccountDetailEntity {
  @PrimaryColumn({ name: 'noa', type: 'int' })
  noa: number;

  @Column({ name: 'namea', type: 'varchar', length: 200, nullable: true })
  namea: string;

  @Column({ name: 'mhlt', type: 'varchar', length: 200, nullable: true })
  mhlt: string;

  @Column({ name: 'tel', type: 'varchar', length: 50, nullable: true })
  tel: string;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => SubAccountEntity, (sub) => sub.details)
  @JoinColumn({ name: 'noa', referencedColumnName: 'noa' })
  account: SubAccountEntity;
}

// ─── المجموعات (GRP) ───
@Entity('grp')
export class GroupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 200 })
  name: string;

  @Column({ name: 'type', type: 'int', nullable: true })
  type: number;

  @Column({ name: 'accounts', type: 'text', nullable: true, comment: 'JSON array of account numbers' })
  accounts: string;
}
