// =============================================
// متحكم التقارير (Reports Controller)
// =============================================
import {
  Controller, Get, Query, UseGuards, Res, StreamableFile,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery,
} from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import {
  DailyReportDto, AccountStatementDto, TrialBalanceDto,
  InvoiceReportDto, VoucherReportDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('reports')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // ─── GET /api/reports/dashboard ───
  @Get('dashboard')
  @ApiOperation({ summary: 'ملخص لوحة التحكم (الإحصائيات والرسوم البيانية)' })
  getDashboard() {
    return this.reportsService.getDashboardSummary();
  }

  // ─── GET /api/reports/daily ───
  @Get('daily')
  @ApiOperation({ summary: 'التقرير اليومي الشامل (قيود + سندات + فواتير)' })
  @ApiResponse({ status: 200, description: 'التقرير اليومي' })
  getDailyReport(@Query() dto: DailyReportDto) {
    return this.reportsService.getDailyReport(dto);
  }

  // ─── GET /api/reports/account-statement ───
  @Get('account-statement')
  @ApiOperation({ summary: 'كشف حساب تفصيلي مع الأرصدة المتراكمة' })
  @ApiResponse({ status: 200, description: 'كشف حساب' })
  @ApiResponse({ status: 404, description: 'الحساب غير موجود' })
  getAccountStatement(@Query() dto: AccountStatementDto) {
    return this.reportsService.getAccountStatement(dto);
  }

  // ─── GET /api/reports/trial-balance ───
  @Get('trial-balance')
  @ApiOperation({ summary: 'ميزان المراجعة (سنوي أو شهري)' })
  @ApiResponse({ status: 200, description: 'ميزان المراجعة' })
  getTrialBalance(@Query() dto: TrialBalanceDto) {
    return this.reportsService.getTrialBalance(dto);
  }

  // ─── GET /api/reports/income-statement ───
  @Get('income-statement')
  @ApiOperation({ summary: 'قائمة الدخل (الإيرادات والمصروفات)' })
  @ApiQuery({ name: 'year', required: true, example: 2026 })
  @ApiQuery({ name: 'month', required: false, example: 4 })
  getIncomeStatement(
    @Query('year') year: number,
    @Query('month') month?: number,
  ) {
    return this.reportsService.getIncomeStatement(+year, month ? +month : undefined);
  }

  // ─── GET /api/reports/invoices ───
  @Get('invoices')
  @ApiOperation({ summary: 'تقرير الفواتير (مبيعات و/أو مشتريات)' })
  getInvoiceReport(@Query() dto: InvoiceReportDto) {
    return this.reportsService.getInvoiceReport(dto);
  }

  // ─── GET /api/reports/vouchers ───
  @Get('vouchers')
  @ApiOperation({ summary: 'تقرير السندات مع ملخص يومي' })
  getVoucherReport(@Query() dto: VoucherReportDto) {
    return this.reportsService.getVoucherReport(dto);
  }
}
