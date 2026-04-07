// =============================================
// DTOs - الحسابات
// =============================================
import { IsNotEmpty, IsString, IsInt, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

// ─── دليل الحسابات ───
export class CreateChartAccountDto {
  @ApiProperty({ example: 10 }) @IsInt() noA: number;
  @ApiProperty({ example: 'الأصول المتداولة' }) @IsString() @IsNotEmpty() nameA: string;
  @ApiPropertyOptional() @IsOptional() @IsString() repA?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() ind?: number;
  @ApiProperty({ example: 0, description: '0=أصول,1=خصوم,2=إيرادات,3=مصروفات,4=حقوق ملكية' }) @IsInt() ts: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() typea?: number;
}
export class UpdateChartAccountDto extends PartialType(CreateChartAccountDto) {}

// ─── الحسابات الفرعية ───
export class CreateSubAccountDto {
  @ApiProperty({ example: 1001 }) @IsInt() noa: number;
  @ApiProperty({ example: 'شركة النور للكهرباء' }) @IsString() @IsNotEmpty() namea: string;
  @ApiProperty({ example: 6 }) @IsInt() typea: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() noan?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() amlhh?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() saram?: number;
}
export class UpdateSubAccountDto extends PartialType(CreateSubAccountDto) {}

export class SubAccountQueryDto extends PaginationDto {
  @ApiPropertyOptional({ example: 2, description: 'نوع الحساب الفرعي، مثل 2 لمشتركي الكهرباء' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  typea?: number;
}

// ─── تفاصيل الحسابات ───
export class CreateAccountDetailDto {
  @ApiProperty({ example: 1001 }) @IsInt() noa: number;
  @ApiPropertyOptional() @IsOptional() @IsString() namea?: string;
  @ApiPropertyOptional({ example: 'بغداد - الكرادة' }) @IsOptional() @IsString() mhlt?: string;
  @ApiPropertyOptional({ example: '07701234567' }) @IsOptional() @IsString() tel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}
export class UpdateAccountDetailDto extends PartialType(CreateAccountDetailDto) {}

// ─── المجموعات ───
export class CreateGroupDto {
  @ApiProperty({ example: 'مجموعة العملاء' }) @IsString() @IsNotEmpty() name: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() type?: number;
  @ApiPropertyOptional({ example: '[1001,1002,1003]' }) @IsOptional() @IsString() accounts?: string;
}
export class UpdateGroupDto extends PartialType(CreateGroupDto) {}
