// =============================================
// كيان المستخدم (User Entity)
// مطابق لجدول USER_U من Oracle Forms
// =============================================
import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user_u')
export class UserEntity {
  @ApiProperty({ description: 'رقم المستخدم', example: 1 })
  @PrimaryColumn({ name: 'nou', type: 'int' })
  nou: number;

  @ApiProperty({ description: 'اسم المستخدم', example: 'مدير النظام' })
  @Column({ name: 'nameu', type: 'varchar', length: 100 })
  nameu: string;

  @Exclude()
  @Column({ name: 'pass', type: 'varchar', length: 255 })
  pass: string;

  @Exclude()
  @Column({ name: 'passs', type: 'varchar', length: 255, nullable: true })
  passs: string;

  @ApiProperty({ description: 'الحالة (1=فعال, 0=معطل)', example: 1 })
  @Column({ name: 'statu', type: 'int', default: 1 })
  statu: number;

  @ApiProperty({ description: 'صلاحية التعديل' })
  @Column({ name: 'ed', type: 'varchar', length: 10, nullable: true })
  ed: string;

  @ApiProperty({ description: 'صلاحية الحذف' })
  @Column({ name: 'de', type: 'varchar', length: 10, nullable: true })
  de: string;

  @ApiProperty({ description: 'صلاحية التقارير' })
  @Column({ name: 'repa', type: 'varchar', length: 100, nullable: true })
  repa: string;

  @Column({ name: 'kokogo', type: 'int', default: 0 })
  kokogo: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // ─── Hash password before save ───
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.pass && !this.pass.startsWith('$2b$')) {
      this.pass = await bcrypt.hash(this.pass, 10);
    }
  }

  // ─── Validate password ───
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.pass);
  }
}
