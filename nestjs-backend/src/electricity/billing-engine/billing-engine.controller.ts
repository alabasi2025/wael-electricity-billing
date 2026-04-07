// =============================================
// متحكم الفوترة - REST API
// =============================================
import { Controller, Get, Post, Patch, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BillingEngineService } from './billing-engine.service';
import { CreateTariffPlanDto, GenerateBillingDto, PostBillingDto, RecordPaymentDto } from './dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('electricity/billing')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('electricity/billing')
export class BillingEngineController {
  constructor(private readonly svc: BillingEngineService) {}

  // ─── إحصائيات ───
  @Get('stats')
  @ApiOperation({ summary: 'إحصائيات الفوترة' })
  getStats() { return this.svc.getBillingStats(); }

  // ═══ التعرفة ═══
  @Post('tariffs')
  @ApiOperation({ summary: 'إنشاء خطة تعرفة جديدة' })
  createTariff(@Body() dto: CreateTariffPlanDto) { return this.svc.createTariff(dto); }

  @Get('tariffs')
  @ApiOperation({ summary: 'قائمة خطط التعرفة' })
  findAllTariffs() { return this.svc.findAllTariffs(); }

  // ═══ إصدار الفوترة ═══
  @Post('generate')
  @ApiOperation({ summary: '🔥 إصدار الفوترة الشهرية (العملية الرئيسية)' })
  generateBilling(@Body() dto: GenerateBillingDto) { return this.svc.generateBilling(dto); }

  // ═══ الترحيل ═══
  @Post('post')
  @ApiOperation({ summary: '✅ ترحيل الفوترة (إنشاء قيود محاسبية)' })
  postBilling(@Body() dto: PostBillingDto) { return this.svc.postBilling(dto); }

  // ═══ السداد ═══
  @Post('payments')
  @ApiOperation({ summary: '💰 تسجيل سداد فاتورة' })
  recordPayment(@Body() dto: RecordPaymentDto) { return this.svc.recordPayment(dto); }

  // ═══ الاستعلامات ═══
  @Get('cycles')
  @ApiOperation({ summary: 'دورات الفوترة' })
  findAllCycles() { return this.svc.findAllBillingCycles(); }

  @Get('invoices/subscriber/:noa')
  @ApiOperation({ summary: 'فواتير مشترك محدد' })
  findBySubscriber(@Param('noa', ParseIntPipe) noa: number) { return this.svc.findInvoicesBySubscriber(noa); }

  @Get('invoices/unpaid')
  @ApiOperation({ summary: 'الفواتير غير المسددة' })
  findUnpaid(@Query('noa') noa?: number) { return this.svc.findUnpaidInvoices(noa ? +noa : undefined); }
}
