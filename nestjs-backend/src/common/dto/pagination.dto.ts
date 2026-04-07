// =============================================
// Pagination DTO + Decorator
// =============================================
import { IsOptional, IsInt, Min, Max, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({ description: 'رقم الصفحة', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ description: 'عدد العناصر في الصفحة', default: 25, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize: number = 25;

  @ApiPropertyOptional({ description: 'الترتيب حسب الحقل' })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ description: 'اتجاه الترتيب', enum: ['ASC', 'DESC'], default: 'DESC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({ description: 'نص البحث' })
  @IsOptional()
  @IsString()
  search?: string;

  get skip(): number {
    return (this.page - 1) * this.pageSize;
  }
}

export class DateRangeDto {
  @ApiPropertyOptional({ description: 'من تاريخ', example: '2026-01-01' })
  @IsOptional()
  @IsString()
  from?: string;

  @ApiPropertyOptional({ description: 'إلى تاريخ', example: '2026-12-31' })
  @IsOptional()
  @IsString()
  to?: string;
}
