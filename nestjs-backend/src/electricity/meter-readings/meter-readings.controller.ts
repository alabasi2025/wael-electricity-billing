// =============================================
// متحكم القراءات - REST API
// =============================================
import { Controller, Get, Post, Put, Patch, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MeterReadingsService } from './meter-readings.service';
import {
  CreateReadingCycleDto, RecordReadingDto, BulkRecordReadingsDto,
  CreateMeterChangeDto, CreateReadingAdjustmentDto, ReadingQueryDto,
} from './dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('electricity/readings')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('electricity/readings')
export class MeterReadingsController {
  constructor(private readonly svc: MeterReadingsService) {}

  // ─── إحصائيات ───
  @Get('stats')
  @ApiOperation({ summary: 'إحصائيات القراءات' })
  getStats() { return this.svc.getReadingStats(); }

  // ═══ دورات القراءة ═══
  @Post('cycles')
  @ApiOperation({ summary: 'إنشاء دورة قراءة جديدة' })
  createCycle(@Body() dto: CreateReadingCycleDto) { return this.svc.createCycle(dto); }

  @Get('cycles')
  @ApiOperation({ summary: 'قائمة دورات القراءة' })
  findAllCycles() { return this.svc.findAllCycles(); }

  @Patch('cycles/:id/close')
  @ApiOperation({ summary: 'إغلاق دورة قراءة' })
  closeCycle(@Param('id', ParseIntPipe) id: number) { return this.svc.closeCycle(id); }

  // ═══ القراءات التفصيلية ═══
  @Get('cycles/:cycleId/readings')
  @ApiOperation({ summary: 'قراءات دورة معينة' })
  findReadings(@Param('cycleId', ParseIntPipe) cycleId: number, @Query() query: ReadingQueryDto) {
    return this.svc.findReadingsByCycle(cycleId, query);
  }

  @Post('cycles/:cycleId/record')
  @ApiOperation({ summary: 'تسجيل قراءة مشترك واحد' })
  recordReading(@Param('cycleId', ParseIntPipe) cycleId: number, @Body() dto: RecordReadingDto) {
    return this.svc.recordReading(cycleId, dto);
  }

  @Post('cycles/:cycleId/bulk-record')
  @ApiOperation({ summary: 'تسجيل قراءات جماعية' })
  bulkRecord(@Param('cycleId', ParseIntPipe) cycleId: number, @Body() dto: BulkRecordReadingsDto) {
    return this.svc.bulkRecordReadings(cycleId, dto);
  }

  // ═══ تغيير العدادات ═══
  @Post('meter-changes')
  @ApiOperation({ summary: 'تسجيل تغيير عداد' })
  createMeterChange(@Body() dto: CreateMeterChangeDto) { return this.svc.createMeterChange(dto); }

  @Get('meter-changes')
  @ApiOperation({ summary: 'سجل تغيير العدادات' })
  findMeterChanges(@Query('subscriberNoa') noa?: number) { return this.svc.findAllMeterChanges(noa); }

  // ═══ التسويات ═══
  @Post('adjustments')
  @ApiOperation({ summary: 'إنشاء تسوية قراءة' })
  createAdjustment(@Body() dto: CreateReadingAdjustmentDto) { return this.svc.createAdjustment(dto); }
}
