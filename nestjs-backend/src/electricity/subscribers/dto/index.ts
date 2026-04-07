// =============================================
// DTOs للمشتركين الكهربائيين
// =============================================
import { IsString, IsOptional, IsNumber, IsBoolean, IsInt, IsNotEmpty, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateElectricitySubscriberDto {
  @ApiProperty({ description: 'رقم المشترك' }) @IsInt() noa: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() noan?: number;
  @ApiProperty({ description: 'اسم المشترك' }) @IsString() @IsNotEmpty() namea: string;
  @ApiPropertyOptional() @IsOptional() @IsString() namegar?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() addressText?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() qm?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mobile?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() tel?: string;

  // المجموعة والمنطقة
  @ApiPropertyOptional() @IsOptional() @IsInt() groupId?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() subGroupId?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() collectorId?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() areaId?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() centerId?: number;

  // العداد
  @ApiPropertyOptional() @IsOptional() @IsString() meterNo?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() meterCatalog?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() meterType?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() meterExtra?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() installationYear?: number;

  // الفوترة
  @ApiPropertyOptional() @IsOptional() @IsString() billingCategory?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() unitPrice?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() diffPrice?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() monthlyFee?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() minAmount?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() minAmount2?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() subscriberType?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() kmGroup?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() kmType?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() prepaidFlag?: boolean;

  // الحالة
  @ApiPropertyOptional() @IsOptional() @IsInt() status?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() disconnectFlag?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() networkFlag?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() activeFlag?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() electricityStatus?: number;

  // الرسائل
  @ApiPropertyOptional() @IsOptional() @IsBoolean() smsEnabled?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsInt() smsType?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() messageType?: number;

  // مالية
  @ApiPropertyOptional() @IsOptional() @IsInt() debitAccount?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() debitAccount2?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() serialNum?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() categoryCode?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() balance?: number;

  // إضافية
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() billingDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() registrationDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() billingDay?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() extraAddress?: string;
}

export class UpdateElectricitySubscriberDto extends PartialType(CreateElectricitySubscriberDto) {}

export class SubscriberQueryDto {
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() page?: number = 1;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() pageSize?: number = 30;
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() groupId?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() collectorId?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() centerId?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() status?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() disconnectFlag?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() billingCategory?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sortBy?: string = 'noa';
  @ApiPropertyOptional() @IsOptional() @IsString() sortOrder?: 'ASC' | 'DESC' = 'ASC';

  get skip(): number { return ((this.page || 1) - 1) * (this.pageSize || 30); }
}
