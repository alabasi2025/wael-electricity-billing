// =============================================
// DTOs - التقارير
// =============================================
import { IsOptional, IsInt, IsString, IsIn, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ─── تقرير يومي ───
export class DailyReportDto {
  @ApiProperty({ description: 'التاريخ', example: '2026-04-07' })
  @IsDateString()
  date: string;
}

// ─── كشف حساب ───
export class AccountStatementDto {
  @ApiProperty({ description: 'رقم الحساب', example: 101 })
  @Type(() => Number)
  @IsInt()
  accountNo: number;

  @ApiProperty({ description: 'من تاريخ', example: '2026-01-01' })
  @IsDateString()
  from: string;

  @ApiProperty({ description: 'إلى تاريخ', example: '2026-12-31' })
  @IsDateString()
  to: string;
}

// ─── ميزان المراجعة ───
export class TrialBalanceDto {
  @ApiProperty({ description: 'السنة', example: 2026 })
  @Type(() => Number)
  @IsInt()
  year: number;

  @ApiPropertyOptional({ description: 'الشهر (اختياري)', example: 4 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  month?: number;
}

// ─── تقرير الفواتير ───
export class InvoiceReportDto {
  @ApiProperty({ description: 'نوع الفواتير', enum: ['sales', 'purchase', 'all'] })
  @IsIn(['sales', 'purchase', 'all'])
  type: string;

  @ApiProperty({ description: 'من تاريخ', example: '2026-01-01' })
  @IsDateString()
  from: string;

  @ApiProperty({ description: 'إلى تاريخ', example: '2026-12-31' })
  @IsDateString()
  to: string;

  @ApiPropertyOptional({ description: 'رقم حساب العميل/المورد' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  accountNo?: number;
}

// ─── تقرير السندات ───
export class VoucherReportDto {
  @ApiProperty({ description: 'نوع السندات', enum: ['receipt', 'payment', 'all'] })
  @IsIn(['receipt', 'payment', 'all'])
  type: string;

  @ApiProperty({ description: 'من تاريخ', example: '2026-01-01' })
  @IsDateString()
  from: string;

  @ApiProperty({ description: 'إلى تاريخ', example: '2026-12-31' })
  @IsDateString()
  to: string;
}

// ─── تصدير ───
export class ExportReportDto {
  @ApiProperty({ description: 'صيغة التصدير', enum: ['excel', 'pdf'] })
  @IsIn(['excel', 'pdf'])
  format: string;
}
