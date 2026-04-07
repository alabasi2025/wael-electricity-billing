// =============================================
// متحكم الفواتير (Invoices Controller)
// =============================================
import {
  Controller, Get, Post, Put, Patch, Delete,
  Body, Param, Query, ParseIntPipe,
  UseGuards, Request, HttpCode, HttpStatus,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery,
} from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import {
  CreateSalesInvoiceDto, UpdateSalesInvoiceDto,
  CreatePurchaseInvoiceDto, UpdatePurchaseInvoiceDto,
  InvoiceListQueryDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('invoices')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  // ═══════ فواتير المبيعات (FATM) ═══════

  @Post('sales')
  @ApiOperation({ summary: 'إنشاء فاتورة مبيعات جديدة' })
  @ApiResponse({ status: 201, description: 'تم إنشاء الفاتورة' })
  createSales(@Body() dto: CreateSalesInvoiceDto, @Request() req) {
    return this.invoicesService.createSales(dto, req.user.userId);
  }

  @Get('sales')
  @ApiOperation({ summary: 'جلب فواتير المبيعات مع فلترة وترقيم' })
  findAllSales(@Query() query: InvoiceListQueryDto) {
    return this.invoicesService.findAllSales(query, query);
  }

  @Get('sales/:id')
  @ApiOperation({ summary: 'جلب فاتورة مبيعات بالرقم' })
  @ApiParam({ name: 'id', description: 'رقم الفاتورة (NOS)' })
  findOneSales(@Param('id', ParseIntPipe) id: number) {
    return this.invoicesService.findOneSales(id);
  }

  @Put('sales/:id')
  @ApiOperation({ summary: 'تحديث فاتورة مبيعات' })
  updateSales(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSalesInvoiceDto) {
    return this.invoicesService.updateSales(id, dto);
  }

  @Delete('sales/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'حذف فاتورة مبيعات' })
  removeSales(@Param('id', ParseIntPipe) id: number) {
    return this.invoicesService.removeSales(id);
  }

  @Patch('sales/:id/post')
  @ApiOperation({ summary: 'ترحيل فاتورة مبيعات' })
  postSales(@Param('id', ParseIntPipe) id: number) {
    return this.invoicesService.postSales(id);
  }

  // ═══════ فواتير المشتريات (FATB) ═══════

  @Post('purchase')
  @ApiOperation({ summary: 'إنشاء فاتورة مشتريات جديدة' })
  createPurchase(@Body() dto: CreatePurchaseInvoiceDto, @Request() req) {
    return this.invoicesService.createPurchase(dto, req.user.userId);
  }

  @Get('purchase')
  @ApiOperation({ summary: 'جلب فواتير المشتريات مع فلترة وترقيم' })
  findAllPurchase(@Query() query: InvoiceListQueryDto) {
    return this.invoicesService.findAllPurchase(query, query);
  }

  @Get('purchase/:id')
  @ApiOperation({ summary: 'جلب فاتورة مشتريات بالرقم' })
  findOnePurchase(@Param('id', ParseIntPipe) id: number) {
    return this.invoicesService.findOnePurchase(id);
  }

  @Put('purchase/:id')
  @ApiOperation({ summary: 'تحديث فاتورة مشتريات' })
  updatePurchase(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePurchaseInvoiceDto) {
    return this.invoicesService.updatePurchase(id, dto);
  }

  @Delete('purchase/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'حذف فاتورة مشتريات' })
  removePurchase(@Param('id', ParseIntPipe) id: number) {
    return this.invoicesService.removePurchase(id);
  }

  @Patch('purchase/:id/post')
  @ApiOperation({ summary: 'ترحيل فاتورة مشتريات' })
  postPurchase(@Param('id', ParseIntPipe) id: number) {
    return this.invoicesService.postPurchase(id);
  }

  // ═══════ إحصائيات ═══════

  @Get('stats')
  @ApiOperation({ summary: 'إحصائيات الفواتير (مبيعات + مشتريات)' })
  @ApiQuery({ name: 'year', required: false, description: 'السنة', example: 2026 })
  getStats(@Query('year') year?: number) {
    return this.invoicesService.getStats(year);
  }
}
