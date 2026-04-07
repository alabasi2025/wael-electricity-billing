// =============================================
// DTOs - المصادقة
// =============================================
import { IsNotEmpty, IsInt, IsString, Min, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'رقم المستخدم', example: 1 })
  @IsInt()
  @Min(1)
  userId: number;

  @ApiProperty({ description: 'كلمة السر', example: 'admin123' })
  @IsString()
  @IsNotEmpty({ message: 'كلمة السر مطلوبة' })
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'توكن JWT' })
  token: string;

  @ApiProperty({ description: 'بيانات المستخدم' })
  user: {
    nou: number;
    nameu: string;
    statu: number;
    ed: string;
    de: string;
    repa: string;
  };

  @ApiProperty({ description: 'الصلاحيات' })
  permissions: string[];
}
