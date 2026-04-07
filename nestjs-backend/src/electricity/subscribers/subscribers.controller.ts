// =============================================
// متحكم المشتركين الكهربائيين
// REST API كامل مع Swagger
// =============================================
import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ElectricitySubscribersService } from './subscribers.service';
import { CreateElectricitySubscriberDto, UpdateElectricitySubscriberDto, SubscriberQueryDto } from './dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('electricity/subscribers')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('electricity/subscribers')
export class ElectricitySubscribersController {
  constructor(private readonly svc: ElectricitySubscribersService) {}

  // ─── إحصائيات ───
  @Get('stats')
  @ApiOperation({ summary: 'إحصائيات المشتركين الكهربائيين' })
  getStats() { return this.svc.getStats(); }

  // ─── بحث سريع ───
  @Get('quick-search')
  @ApiOperation({ summary: 'بحث سريع (للقوائم المنسدلة)' })
  @ApiQuery({ name: 'term', required: true })
  quickSearch(@Query('term') term: string, @Query('limit') limit?: number) {
    return this.svc.quickSearch(term, limit || 10);
  }

  // ─── المشتركين المتأخرين ───
  @Get('overdue')
  @ApiOperation({ summary: 'المشتركين المطلوب فصلهم (مديونية عالية)' })
  getOverdue(@Query('minBalance') minBalance?: number) {
    return this.svc.getOverdueSubscribers(minBalance || 10000);
  }

  // ─── إنشاء ───
  @Post()
  @ApiOperation({ summary: 'إنشاء مشترك كهربائي جديد' })
  create(@Body() dto: CreateElectricitySubscriberDto) { return this.svc.create(dto); }

  // ─── قائمة مع بحث متقدم ───
  @Get()
  @ApiOperation({ summary: 'قائمة المشتركين (بحث متقدم + صفحات)' })
  findAll(@Query() query: SubscriberQueryDto) { return this.svc.findAll(query); }

  // ─── مشترك واحد بالرقم ───
  @Get(':noa')
  @ApiOperation({ summary: 'بيانات مشترك بالرقم' })
  findOne(@Param('noa', ParseIntPipe) noa: number) { return this.svc.findOne(noa); }

  // ─── تحديث ───
  @Put(':noa')
  @ApiOperation({ summary: 'تحديث بيانات مشترك' })
  update(@Param('noa', ParseIntPipe) noa: number, @Body() dto: UpdateElectricitySubscriberDto) {
    return this.svc.update(noa, dto);
  }

  // ─── حذف ───
  @Delete(':noa')
  @ApiOperation({ summary: 'حذف مشترك' })
  remove(@Param('noa', ParseIntPipe) noa: number) { return this.svc.remove(noa); }

  // ─── فصل/إعادة توصيل ───
  @Patch(':noa/toggle-disconnect')
  @ApiOperation({ summary: 'فصل/إعادة توصيل مشترك' })
  toggleDisconnect(@Param('noa', ParseIntPipe) noa: number) { return this.svc.toggleDisconnect(noa); }

  // ─── تحديث رصيد ───
  @Patch(':noa/balance')
  @ApiOperation({ summary: 'تحديث رصيد مشترك' })
  updateBalance(
    @Param('noa', ParseIntPipe) noa: number,
    @Body('amount') amount: number,
    @Body('operation') operation: 'add' | 'subtract',
  ) { return this.svc.updateBalance(noa, amount, operation); }
}
