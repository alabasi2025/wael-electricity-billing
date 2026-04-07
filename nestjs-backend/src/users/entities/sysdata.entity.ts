// =============================================
// كيان سجل النظام (SysData Entity)
// مطابق لجدول SYSDATA
// =============================================
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('sysdata')
export class SysDataEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ name: 'login_time', type: 'varchar', length: 20, nullable: true })
  loginTime: string;

  @Column({ name: 'login_date', type: 'date', nullable: true })
  loginDate: Date;

  @Column({ name: 'user_name', type: 'varchar', length: 100, nullable: true })
  userName: string;

  @Column({ name: 'action', type: 'varchar', length: 200, nullable: true })
  action: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'nou' })
  user: UserEntity;
}
