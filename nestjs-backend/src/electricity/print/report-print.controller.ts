// =============================================
// Controller موحد لطباعة التقارير + API التقارير الـ 19
// =============================================
import { Controller, Get, Param, Query, ParseIntPipe, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ReportPrintService } from './report-print.service';
import { FullReportsService } from '../reports-engine/full-reports.service';

@ApiTags('electricity/print-reports')
@Controller('electricity/print-reports')
export class ReportPrintController {
  constructor(private printSvc: ReportPrintService, private reportSvc: FullReportsService) {}

  // ═══ طباعة HTML ═══
  @Get('detailed-v2/:noa') @ApiOperation({ summary: '🖨️ كشف تفصيلي بحالات' })
  async p1(@Param('noa',ParseIntPipe) noa:number, @Res() res:Response) { res.setHeader('Content-Type','text/html;charset=utf-8'); res.send(await this.printSvc.printDetailedV2(noa)); }

  @Get('monthly-summary/:noa') @ApiOperation({ summary: '🖨️ ملخص شهري' })
  async p3(@Param('noa',ParseIntPipe) noa:number, @Res() res:Response) { res.setHeader('Content-Type','text/html;charset=utf-8'); res.send(await this.printSvc.printMonthlySummary(noa)); }

  @Get('compare-months') @ApiOperation({ summary: '🖨️ مقارنة شهرين' })
  async p6(@Query('m1') m1:number, @Query('y1') y1:number, @Query('m2') m2:number, @Query('y2') y2:number, @Res() res:Response) { res.setHeader('Content-Type','text/html;charset=utf-8'); res.send(await this.printSvc.printCompareMonths(+m1,+y1,+m2,+y2)); }

  @Get('detailed-debt') @ApiOperation({ summary: '🖨️ مديونية تفصيلية' })
  async p11(@Query('min') min:number, @Res() res:Response) { res.setHeader('Content-Type','text/html;charset=utf-8'); res.send(await this.printSvc.printDetailedDebt(+(min||0))); }

  @Get('debt-by-group') @ApiOperation({ summary: '🖨️ مديونية حسب المجموعة' })
  async p12(@Res() res:Response) { res.setHeader('Content-Type','text/html;charset=utf-8'); res.send(await this.printSvc.printDebtByGroup()); }

  @Get('readings-names/:cycleId') @ApiOperation({ summary: '🖨️ قراءات مع أسماء' })
  async p9(@Param('cycleId',ParseIntPipe) id:number, @Res() res:Response) { res.setHeader('Content-Type','text/html;charset=utf-8'); res.send(await this.printSvc.printReadingsWithNames(id)); }

  @Get('all-balances') @ApiOperation({ summary: '🖨️ أرصدة المشتركين' })
  async p14(@Res() res:Response) { res.setHeader('Content-Type','text/html;charset=utf-8'); res.send(await this.printSvc.printAllBalances()); }

  @Get('geographic') @ApiOperation({ summary: '🖨️ إحصائي جغرافي' })
  async p13(@Res() res:Response) { res.setHeader('Content-Type','text/html;charset=utf-8'); res.send(await this.printSvc.printGeographicStats()); }

  @Get('vouchers-period') @ApiOperation({ summary: '🖨️ سندات حسب الفترة' })
  async p8(@Query('from') f:string, @Query('to') t:string, @Res() res:Response) { res.setHeader('Content-Type','text/html;charset=utf-8'); res.send(await this.printSvc.printVouchersByPeriod(f,t)); }

  // ═══ API JSON للتقارير الـ 19 ═══
  @Get('api/detailed-v2/:noa') @ApiOperation({ summary: 'كشف تفصيلي V2' })
  r1(@Param('noa',ParseIntPipe) noa:number) { return this.reportSvc.detailedStatementV2(noa); }

  @Get('api/by-voucher/:noa') @ApiOperation({ summary: 'كشف حسب السند' })
  r2(@Param('noa',ParseIntPipe) noa:number) { return this.reportSvc.statementByVoucher(noa); }

  @Get('api/monthly-summary/:noa') @ApiOperation({ summary: 'ملخص شهري' })
  r3(@Param('noa',ParseIntPipe) noa:number) { return this.reportSvc.monthlySummary(noa); }

  @Get('api/with-voucher-details/:noa') @ApiOperation({ summary: 'كشف مع سندات' })
  r4(@Param('noa',ParseIntPipe) noa:number) { return this.reportSvc.statementWithVoucherDetails(noa); }

  @Get('api/invoices-by-type') @ApiOperation({ summary: 'فواتير حسب النوع' })
  r5(@Query('type') type:number) { return this.reportSvc.invoicesByType(+type); }

  @Get('api/compare-months') @ApiOperation({ summary: 'مقارنة شهرين' })
  r6(@Query('m1') m1:number, @Query('y1') y1:number, @Query('m2') m2:number, @Query('y2') y2:number) { return this.reportSvc.compareTwoMonths(+m1,+y1,+m2,+y2); }

  @Get('api/receipt-details/:id') @ApiOperation({ summary: 'تفاصيل سند' })
  r7(@Param('id',ParseIntPipe) id:number) { return this.reportSvc.receiptDetails(id); }

  @Get('api/vouchers-period') @ApiOperation({ summary: 'سندات حسب الفترة' })
  r8(@Query('from') f:string, @Query('to') t:string) { return this.reportSvc.vouchersByPeriod(f,t); }

  @Get('api/readings-names/:cycleId') @ApiOperation({ summary: 'قراءات مع أسماء' })
  r9(@Param('cycleId',ParseIntPipe) id:number) { return this.reportSvc.readingsWithNames(id); }

  @Get('api/readings-by-group/:cycleId') @ApiOperation({ summary: 'قراءات حسب المنطقة' })
  r10(@Param('cycleId',ParseIntPipe) id:number, @Query('groupId') gid?:number) { return this.reportSvc.readingsByGroup(id,gid?+gid:undefined); }

  @Get('api/detailed-debt') @ApiOperation({ summary: 'مديونية تفصيلية' })
  r11() { return this.reportSvc.detailedDebtReport(); }

  @Get('api/debt-by-group') @ApiOperation({ summary: 'مديونية حسب المجموعة' })
  r12() { return this.reportSvc.debtByGroup(); }

  @Get('api/geographic') @ApiOperation({ summary: 'إحصائي جغرافي' })
  r13() { return this.reportSvc.geographicStats(); }

  @Get('api/all-balances') @ApiOperation({ summary: 'أرصدة المشتركين' })
  r14(@Query('min') min?:number) { return this.reportSvc.allBalances(min?+min:undefined); }

  @Get('api/export') @ApiOperation({ summary: 'تصدير CSV' })
  r16(@Query('type') type:string) { return this.reportSvc.exportCSV(type, {}); }

  @Get('api/discounts') @ApiOperation({ summary: 'حسومات' })
  r17() { return this.reportSvc.discountsReport(); }

  @Get('api/full-list') @ApiOperation({ summary: 'قائمة كل التقارير (37)' })
  fullList() { return this.reportSvc.getFullReportsList(); }
}
