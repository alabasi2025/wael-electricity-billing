// =============================================
// DTOs - المستخدمين
// =============================================
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  MinLength,
  Min,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

// ─── إنشاء مستخدم ───
export class CreateUserDto {
  @ApiProperty({ description: 'رقم المستخدم', example: 2 })
  @IsInt()
  @Min(1)
  nou: number;

  @ApiProperty({ description: 'اسم المستخدم', example: 'أحمد محمد' })
  @IsString()
  @IsNotEmpty({ message: 'اسم المستخدم مطلوب' })
  nameu: string;

  @ApiProperty({ description: 'كلمة السر', example: 'password123', minLength: 4 })
  @IsString()
  @MinLength(4, { message: 'كلمة السر يجب أن تكون 4 أحرف على الأقل' })
  pass: string;

  @ApiPropertyOptional({ description: 'الحالة (1=فعال, 0=معطل)', default: 1, enum: [0, 1] })
  @IsOptional()
  @IsInt()
  @IsIn([0, 1])
  statu?: number = 1;

  @ApiPropertyOptional({ description: 'صلاحية التعديل', example: 'Y' })
  @IsOptional()
  @IsString()
  ed?: string;

  @ApiPropertyOptional({ description: 'صلاحية الحذف', example: 'Y' })
  @IsOptional()
  @IsString()
  de?: string;

  @ApiPropertyOptional({ description: 'صلاحية التقارير', example: 'ALL' })
  @IsOptional()
  @IsString()
  repa?: string;
}

// ─── تحديث مستخدم ───
export class UpdateUserDto extends PartialType(CreateUserDto) {}

// ─── تغيير كلمة السر ───
export class ChangePasswordDto {
  @ApiProperty({ description: 'كلمة السر الحالية' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ description: 'كلمة السر الجديدة', minLength: 4 })
  @IsString()
  @MinLength(4, { message: 'كلمة السر الجديدة يجب أن تكون 4 أحرف على الأقل' })
  newPassword: string;
}

// ─── تحديث الصلاحيات ───
export class UpdatePermissionsDto {
  @ApiProperty({ description: 'صلاحية التعديل', example: 'Y' })
  @IsOptional()
  @IsString()
  ed?: string;

  @ApiProperty({ description: 'صلاحية الحذف', example: 'Y' })
  @IsOptional()
  @IsString()
  de?: string;

  @ApiProperty({ description: 'صلاحية التقارير', example: 'ALL' })
  @IsOptional()
  @IsString()
  repa?: string;
}
