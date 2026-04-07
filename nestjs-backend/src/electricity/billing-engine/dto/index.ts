// =============================================
// DTOs لنظام الفوترة
// =============================================
import { IsString, IsOptional, IsNumber, IsInt, IsNotEmpty, IsDateString, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateTariffPlanDto {
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() billingType?: string;
  @ApiProperty() @IsNumber() unitPrice: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() minCharge?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() fixedFee?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() taxRate?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() serviceFee?: number;
  @ApiPropertyOptional() @IsOptional() @IsDateString() effectiveFrom?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() effectiveTo?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() tiers?: { tierOrder: number; fromUnits: number; toUnits?: number; pricePerUnit: number }[];
}

export class GenerateBillingDto {
  @ApiProperty({ description: 'الشهر' }) @IsInt() billingMonth: number;
  @ApiProperty({ description: 'السنة' }) @IsInt() billingYear: number;
  @ApiProperty({ description: 'رقم دورة القراءة' }) @IsInt() readingCycleId: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() groupId?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() tariffId?: number;
}

export class PostBillingDto {
  @ApiProperty({ description: 'رقم دورة الفوترة' }) @IsInt() billingCycleId: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() debitAccount?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() creditAccount?: number;
}

export class RecordPaymentDto {
  @ApiProperty() @IsInt() invoiceId: number;
  @ApiProperty() @IsNumber() amount: number;
  @ApiPropertyOptional() @IsOptional() @IsString() paymentMethod?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() voucherNos?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}
