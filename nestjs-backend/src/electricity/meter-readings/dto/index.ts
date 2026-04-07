// =============================================
// DTOs لنظام القراءات
// =============================================
import { IsString, IsOptional, IsNumber, IsBoolean, IsInt, IsNotEmpty, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

// ─── إنشاء دورة قراءة ───
export class CreateReadingCycleDto {
  @ApiProperty({ description: 'تاريخ بداية الدورة' }) @IsDateString() dateFrom: string;
  @ApiProperty({ description: 'تاريخ نهاية الدورة' }) @IsDateString() dateTo: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() groupId?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() centerId?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

// ─── إدخال قراءة مشترك ───
export class RecordReadingDto {
  @ApiProperty({ description: 'رقم المشترك' }) @IsInt() subscriberNoa: number;
  @ApiProperty({ description: 'القراءة الحالية' }) @IsNumber() currReading: number;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

// ─── إدخال قراءات جماعية ───
export class BulkRecordReadingsDto {
  @ApiProperty({ type: [RecordReadingDto] })
  readings: RecordReadingDto[];
}

// ─── تغيير عداد ───
export class CreateMeterChangeDto {
  @ApiProperty() @IsInt() subscriberNoa: number;
  @ApiPropertyOptional() @IsOptional() @IsString() oldMeterNo?: string;
  @ApiProperty() @IsString() @IsNotEmpty() newMeterNo: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() removalReading?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() installReading?: number;
  @ApiProperty() @IsDateString() changeDate: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reason?: string;
}

// ─── تسوية قراءة ───
export class CreateReadingAdjustmentDto {
  @ApiProperty() @IsInt() subscriberNoa: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() cycleId?: number;
  @ApiProperty() @IsString() adjustmentType: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() oldValue?: number;
  @ApiProperty() @IsNumber() newValue: number;
  @ApiProperty() @IsString() @IsNotEmpty() reason: string;
}

// ─── استعلام القراءات ───
export class ReadingQueryDto {
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() page?: number = 1;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() pageSize?: number = 50;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() cycleId?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() groupId?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() status?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;

  get skip(): number { return ((this.page || 1) - 1) * (this.pageSize || 50); }
}
