// =============================================
// DTOs - الفواتير
// =============================================
import {
  IsNotEmpty, IsString, IsInt, IsOptional, IsNumber,
  IsDateString, IsArray, ValidateNested, Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { PaginationDto } from '../../common/dto/pagination.dto';

// ─── سطر فاتورة ───
export class InvoiceDetailDto {
  @ApiProperty({ description: 'اسم الصنف', example: 'كابل كهربائي 16مم' })
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @ApiProperty({ description: 'الكمية', example: 100 })
  @IsNumber()
  @Min(0.01)
  quantity: number;

  @ApiProperty({ description: 'سعر الوحدة', example: 25000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ description: 'ملاحظات' })
  @IsOptional()
  @IsString()
  notes?: string;
}

// ─── إنشاء فاتورة مبيعات ───
export class CreateSalesInvoiceDto {
  @ApiProperty({ description: 'التاريخ', example: '2026-04-07' })
  @IsDateString()
  dates: string;

  @ApiProperty({ description: 'رقم حساب العميل', example: 101 })
  @IsInt()
  noa: number;

  @ApiPropertyOptional({ description: 'اسم العميل', example: 'شركة النور للكهرباء' })
  @IsOptional()
  @IsString()
  namea?: string;

  @ApiPropertyOptional({ description: 'ملاحظات' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'تفاصيل الفاتورة', type: [InvoiceDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceDetailDto)
  details: InvoiceDetailDto[];
}

// ─── تحديث فاتورة مبيعات ───
export class UpdateSalesInvoiceDto extends PartialType(CreateSalesInvoiceDto) {}

// ─── إنشاء فاتورة مشتريات ───
export class CreatePurchaseInvoiceDto {
  @ApiProperty({ description: 'التاريخ', example: '2026-04-07' })
  @IsDateString()
  dates: string;

  @ApiProperty({ description: 'رقم حساب المورد', example: 201 })
  @IsInt()
  noa: number;

  @ApiPropertyOptional({ description: 'اسم المورد', example: 'مصنع المحولات' })
  @IsOptional()
  @IsString()
  namea?: string;

  @ApiPropertyOptional({ description: 'ملاحظات' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'تفاصيل الفاتورة', type: [InvoiceDetailDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceDetailDto)
  details: InvoiceDetailDto[];
}

// ─── تحديث فاتورة مشتريات ───
export class UpdatePurchaseInvoiceDto extends PartialType(CreatePurchaseInvoiceDto) {}

// ─── فلتر الفواتير ───
export class InvoiceFilterDto {
  @ApiPropertyOptional({ description: 'نوع الفاتورة', enum: ['sales', 'purchase', 'all'] })
  @IsOptional()
  @IsString()
  type?: string = 'all';

  @ApiPropertyOptional({ description: 'من تاريخ', example: '2026-01-01' })
  @IsOptional()
  @IsString()
  from?: string;

  @ApiPropertyOptional({ description: 'إلى تاريخ', example: '2026-12-31' })
  @IsOptional()
  @IsString()
  to?: string;

  @ApiPropertyOptional({ description: 'رقم حساب العميل/المورد' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  noa?: number;

  @ApiPropertyOptional({ description: 'الحالة (0=معلق, 1=مرحل)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  amr?: number;
}

// ─── استعلام قائمة الفواتير (Pagination + Filter) ───
export class InvoiceListQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'نوع الفاتورة', enum: ['sales', 'purchase', 'all'] })
  @IsOptional()
  @IsString()
  type?: string = 'all';

  @ApiPropertyOptional({ description: 'من تاريخ', example: '2026-01-01' })
  @IsOptional()
  @IsString()
  from?: string;

  @ApiPropertyOptional({ description: 'إلى تاريخ', example: '2026-12-31' })
  @IsOptional()
  @IsString()
  to?: string;

  @ApiPropertyOptional({ description: 'رقم حساب العميل/المورد' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  noa?: number;

  @ApiPropertyOptional({ description: 'الحالة (0=معلق, 1=مرحل)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  amr?: number;
}
