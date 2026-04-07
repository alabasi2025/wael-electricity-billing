// =============================================
// محرك طباعة PDF/HTML للفواتير والسندات والتقارير
// بديل: Oracle Reports (.rep)
// يستخدم HTML templates + طباعة المتصفح
// =============================================
import { Injectable, Module, Controller, Get, Param, Query, ParseIntPipe, UseGuards, Res } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Response } from 'express';

import { ElectricitySubscriberEntity } from './subscribers/entities/electricity-subscriber.entity';
import { BillingInvoiceEntity, BillingInvoiceItemEntity, BillingCycleEntity } from './billing-engine/entities/billing.entity';
import { MeterReadingEntity, MeterReadingCycleEntity } from './meter-readings/entities/meter-reading.entity';

@Injectable()
export class PrintService {
  constructor(
    @InjectRepository(ElectricitySubscriberEntity) private subRepo: Repository<ElectricitySubscriberEntity>,
    @InjectRepository(BillingInvoiceEntity) private invRepo: Repository<BillingInvoiceEntity>,
    @InjectRepository(BillingInvoiceItemEntity) private itemRepo: Repository<BillingInvoiceItemEntity>,
    @InjectRepository(MeterReadingEntity) private readRepo: Repository<MeterReadingEntity>,
  ) {}

  private wrapHtml(title: string, body: string): string {
    return `<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8">
    <title>${title}</title>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body { font-family:'Segoe UI',Tahoma,Arial,sans-serif; padding:20px; color:#333; direction:rtl; }
      .header { text-align:center; border-bottom:3px double #333; padding-bottom:15px; margin-bottom:20px; }
      .header h1 { font-size:22px; margin:5px 0; }
      .header .sub { color:#666; font-size:14px; }
      .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin:15px 0; padding:15px; background:#f8f9fa; border-radius:8px; }
      .info-grid div { font-size:13px; }
      .info-grid strong { color:#1a237e; }
      table { width:100%; border-collapse:collapse; margin:15px 0; font-size:13px; }
      th { background:#1a237e; color:#fff; padding:8px; text-align:right; }
      td { padding:6px 8px; border-bottom:1px solid #e0e0e0; }
      tr:nth-child(even) { background:#f5f5f5; }
      .total-row { background:#e8eaf6 !important; font-weight:bold; }
      .summary { background:#e8f5e9; padding:15px; border-radius:8px; margin:15px 0; }
      .summary h3 { margin-bottom:10px; color:#2e7d32; }
      .amount { font-size:18px; font-weight:bold; color:#1a237e; }
      .footer { text-align:center; margin-top:30px; padding-top:15px; border-top:1px solid #ccc; font-size:11px; color:#999; }
      .stamp-area { display:flex; justify-content:space-between; margin-top:40px; }
      .stamp-area div { text-align:center; min-width:150px; }
      .stamp-area .line { border-top:1px solid #333; margin-top:60px; padding-top:5px; }
      .red { color:#f44336; } .green { color:#4caf50; }
      @media print { body { padding:10px; } .no-print { display:none; } }
    </style></head><body>
    <div class="no-print" style="margin-bottom:20px;text-align:center">
      <button onclick="window.print()" style="padding:10px 30px;background:#1a237e;color:#fff;border:none;border-radius:5px;cursor:pointer;font-size:16px">🖨️ طباعة</button>
      <button onclick="window.close()" style="padding:10px 30px;background:#666;color:#fff;border:none;border-radius:5px;cursor:pointer;font-size:16px;margin-right:10px">إغلاق</button>
    </div>
    ${body}
    <div class="footer">نظام الفوترة الكهربائية - تم الطباعة: ${new Date().toLocaleDateString('ar-EG')} ${new Date().toLocaleTimeString('ar-EG')}</div>
    </body></html>`;
  }

  // ═══ طباعة فاتورة كهرباء (بديل SNDK.rep + fatt.rep) ═══
  async printInvoice(invoiceId: number): Promise<string> {
    const inv = await this.invRepo.findOne({ where: { id: invoiceId } });
    if (!inv) return this.wrapHtml('خطأ', '<h1>الفاتورة غير موجودة</h1>');
    const sub = await this.subRepo.findOne({ where: { noa: inv.subscriberNoa } });
    const items = await this.itemRepo.find({ where: { invoiceId }, order: { itemOrder: 'ASC' } });

    const body = `
      <div class="header">
        <h1>⚡ فاتورة كهرباء</h1>
        <div class="sub">رقم الفاتورة: <strong>${inv.invoiceNo}</strong> | التاريخ: ${new Date(inv.invoiceDate).toLocaleDateString('ar-EG')}</div>
      </div>
      <div class="info-grid">
        <div>رقم المشترك: <strong>${inv.subscriberNoa}</strong></div>
        <div>الاسم: <strong>${inv.subscriberName || sub?.namea || ''}</strong></div>
        <div>العنوان: <strong>${sub?.addressText || '-'}</strong></div>
        <div>رقم العداد: <strong>${sub?.meterNo || '-'}</strong></div>
        <div>القراءة السابقة: <strong>${inv.prevReading}</strong></div>
        <div>القراءة الحالية: <strong>${inv.currReading}</strong></div>
        <div>الاستهلاك: <strong>${inv.consumption} وحدة</strong></div>
        <div>الفئة: <strong>${sub?.billingCategory || '-'}</strong></div>
      </div>
      <table>
        <tr><th>البند</th><th>الوصف</th><th>الكمية</th><th>السعر</th><th>المبلغ</th></tr>
        ${items.map(i => `<tr><td>${i.itemType === 'consumption' ? 'استهلاك' : i.itemType === 'fixed_fee' ? 'رسوم ثابتة' : i.itemType === 'service' ? 'خدمة' : i.itemType === 'tax' ? 'ضريبة' : i.itemType}</td><td>${i.description || ''}</td><td>${i.quantity || '-'}</td><td>${i.unitPrice || '-'}</td><td>${(+i.amount).toLocaleString()}</td></tr>`).join('')}
        <tr class="total-row"><td colspan="4">إجمالي الفاتورة</td><td class="amount">${(+inv.totalAmount).toLocaleString()}</td></tr>
        <tr><td colspan="4">الرصيد السابق</td><td>${(+inv.previousBalance).toLocaleString()}</td></tr>
        <tr class="total-row"><td colspan="4">الإجمالي المستحق</td><td class="amount red">${(+inv.grandTotal).toLocaleString()}</td></tr>
        ${+inv.paidAmount > 0 ? `<tr><td colspan="4">المسدد</td><td class="green">${(+inv.paidAmount).toLocaleString()}</td></tr><tr class="total-row"><td colspan="4">المتبقي</td><td class="red">${(+inv.remainingAmount).toLocaleString()}</td></tr>` : ''}
      </table>
      <div class="stamp-area">
        <div>المحاسب<div class="line">التوقيع</div></div>
        <div>المدير<div class="line">التوقيع والختم</div></div>
      </div>`;
    return this.wrapHtml(`فاتورة ${inv.invoiceNo}`, body);
  }

  // ═══ طباعة سند قبض (بديل SNDK.rep) ═══
  async printReceipt(invoiceId: number, amount: number, receiptNo?: number): Promise<string> {
    const inv = await this.invRepo.findOne({ where: { id: invoiceId } });
    const sub = inv ? await this.subRepo.findOne({ where: { noa: inv.subscriberNoa } }) : null;
    const body = `
      <div class="header">
        <h1>💰 سند قبض</h1>
        <div class="sub">رقم السند: <strong>${receiptNo || '-'}</strong> | التاريخ: ${new Date().toLocaleDateString('ar-EG')}</div>
      </div>
      <div class="info-grid">
        <div>استلمنا من السيد/ة: <strong>${inv?.subscriberName || sub?.namea || '-'}</strong></div>
        <div>رقم المشترك: <strong>${inv?.subscriberNoa || '-'}</strong></div>
        <div>مبلغ وقدره: <strong class="amount">${(amount || 0).toLocaleString()} </strong></div>
        <div>وذلك عن: <strong>سداد فاتورة كهرباء رقم ${inv?.invoiceNo || '-'}</strong></div>
      </div>
      <div class="summary"><h3>تفاصيل الدفع</h3>
        <div>إجمالي الفاتورة: ${(+(inv?.grandTotal || 0)).toLocaleString()}</div>
        <div>المبلغ المسدد: <strong class="green">${(amount || 0).toLocaleString()}</strong></div>
        <div>المتبقي: <strong class="red">${((+(inv?.grandTotal || 0)) - (+(inv?.paidAmount || 0)) - amount).toLocaleString()}</strong></div>
      </div>
      <div class="stamp-area">
        <div>المستلم<div class="line">التوقيع</div></div>
        <div>أمين الصندوق<div class="line">التوقيع</div></div>
        <div>المدير<div class="line">التوقيع والختم</div></div>
      </div>`;
    return this.wrapHtml(`سند قبض ${receiptNo || ''}`, body);
  }

  // ═══ طباعة كشف حساب مشترك (بديل repkh1.rep) ═══
  async printStatement(noa: number): Promise<string> {
    const sub = await this.subRepo.findOne({ where: { noa } });
    if (!sub) return this.wrapHtml('خطأ', '<h1>المشترك غير موجود</h1>');
    const invoices = await this.invRepo.find({ where: { subscriberNoa: noa }, order: { invoiceDate: 'ASC' } });
    let balance = 0;
    const rows = invoices.map(inv => {
      balance += +inv.totalAmount - +inv.paidAmount;
      return `<tr><td>${inv.invoiceNo}</td><td>${new Date(inv.invoiceDate).toLocaleDateString('ar-EG')}</td><td>${inv.consumption}</td><td>${(+inv.totalAmount).toLocaleString()}</td><td class="green">${(+inv.paidAmount).toLocaleString()}</td><td class="${balance > 0 ? 'red' : 'green'}" style="font-weight:bold">${balance.toLocaleString()}</td></tr>`;
    }).join('');

    const body = `
      <div class="header"><h1>📋 كشف حساب مشترك</h1></div>
      <div class="info-grid">
        <div>رقم المشترك: <strong>${sub.noa}</strong></div><div>الاسم: <strong>${sub.namea}</strong></div>
        <div>العداد: <strong>${sub.meterNo || '-'}</strong></div><div>الهاتف: <strong>${sub.mobile || '-'}</strong></div>
        <div>العنوان: <strong>${sub.addressText || '-'}</strong></div><div>الفئة: <strong>${sub.billingCategory}</strong></div>
      </div>
      <table><tr><th>الفاتورة</th><th>التاريخ</th><th>الاستهلاك</th><th>المبلغ</th><th>المسدد</th><th>الرصيد</th></tr>${rows}
      <tr class="total-row"><td colspan="3">الإجمالي</td><td>${invoices.reduce((s, i) => s + +i.totalAmount, 0).toLocaleString()}</td><td class="green">${invoices.reduce((s, i) => s + +i.paidAmount, 0).toLocaleString()}</td><td class="red amount">${(+sub.balance).toLocaleString()}</td></tr></table>`;
    return this.wrapHtml(`كشف حساب ${sub.namea}`, body);
  }

  // ═══ طباعة تقرير يومي (بديل repday.rep) ═══
  async printDailyReport(date: string): Promise<string> {
    const invoices = await this.invRepo.createQueryBuilder('i')
      .where("i.status >= 3 AND CAST(i.updatedAt AS DATE) = :d", { d: date }).orderBy('i.subscriberNoa').getMany();
    const total = invoices.reduce((s, i) => s + +i.paidAmount, 0);
    const rows = invoices.map((i, idx) => `<tr><td>${idx + 1}</td><td>${i.invoiceNo}</td><td>${i.subscriberNoa}</td><td>${i.subscriberName}</td><td>${(+i.paidAmount).toLocaleString()}</td></tr>`).join('');
    const body = `
      <div class="header"><h1>📊 تقرير التحصيل اليومي</h1><div class="sub">التاريخ: ${date}</div></div>
      <table><tr><th>#</th><th>الفاتورة</th><th>المشترك</th><th>الاسم</th><th>المبلغ</th></tr>${rows}
      <tr class="total-row"><td colspan="4">الإجمالي (${invoices.length} عملية)</td><td class="amount">${total.toLocaleString()}</td></tr></table>`;
    return this.wrapHtml(`تقرير يومي ${date}`, body);
  }

  // ═══ طباعة فواتير شهرية (بديل repfm2.rep) ═══
  async printMonthlyBilling(month: number, year: number): Promise<string> {
    const invoices = await this.invRepo.createQueryBuilder('i')
      .innerJoin(BillingCycleEntity, 'c', 'i.billingCycleId = c.id')
      .where('c.billingMonth = :m AND c.billingYear = :y', { m: month, y: year })
      .orderBy('i.subscriberNoa').getMany();
    const totalBilled = invoices.reduce((s, i) => s + +i.totalAmount, 0);
    const totalConsumption = invoices.reduce((s, i) => s + +i.consumption, 0);
    const rows = invoices.map((i, idx) => `<tr><td>${idx+1}</td><td>${i.subscriberNoa}</td><td>${i.subscriberName}</td><td>${i.prevReading}</td><td>${i.currReading}</td><td>${i.consumption}</td><td>${(+i.totalAmount).toLocaleString()}</td><td>${(+i.paidAmount).toLocaleString()}</td><td class="red">${(+i.remainingAmount).toLocaleString()}</td></tr>`).join('');
    const body = `
      <div class="header"><h1>📊 تقرير الفواتير الشهرية</h1><div class="sub">الفترة: ${month}/${year}</div></div>
      <table><tr><th>#</th><th>المشترك</th><th>الاسم</th><th>سابقة</th><th>حالية</th><th>استهلاك</th><th>المبلغ</th><th>مسدد</th><th>متبقي</th></tr>${rows}
      <tr class="total-row"><td colspan="5">الإجمالي (${invoices.length} فاتورة)</td><td>${totalConsumption.toLocaleString()}</td><td class="amount">${totalBilled.toLocaleString()}</td><td></td><td></td></tr></table>`;
    return this.wrapHtml(`فواتير شهر ${month}/${year}`, body);
  }
}

// ═══════ CONTROLLER ═══════
@ApiTags('electricity/print')
@Controller('electricity/print')
export class PrintController {
  constructor(private svc: PrintService) {}

  @Get('invoice/:id') @ApiOperation({ summary: '🖨️ طباعة فاتورة كهرباء' })
  async printInvoice(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const html = await this.svc.printInvoice(id);
    res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.send(html);
  }

  @Get('receipt/:invoiceId') @ApiOperation({ summary: '🖨️ طباعة سند قبض' })
  async printReceipt(@Param('invoiceId', ParseIntPipe) id: number, @Query('amount') amount: number, @Query('receiptNo') rno?: number, @Res() res?: Response) {
    const html = await this.svc.printReceipt(id, +amount, rno ? +rno : undefined);
    res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.send(html);
  }

  @Get('statement/:noa') @ApiOperation({ summary: '🖨️ طباعة كشف حساب مشترك' })
  async printStatement(@Param('noa', ParseIntPipe) noa: number, @Res() res: Response) {
    const html = await this.svc.printStatement(noa);
    res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.send(html);
  }

  @Get('daily-report') @ApiOperation({ summary: '🖨️ طباعة تقرير يومي' })
  async printDaily(@Query('date') date: string, @Res() res: Response) {
    const html = await this.svc.printDailyReport(date);
    res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.send(html);
  }

  @Get('monthly-billing') @ApiOperation({ summary: '🖨️ طباعة فواتير شهرية' })
  async printMonthly(@Query('month') m: number, @Query('year') y: number, @Res() res: Response) {
    const html = await this.svc.printMonthlyBilling(+m, +y);
    res.setHeader('Content-Type', 'text/html; charset=utf-8'); res.send(html);
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([ElectricitySubscriberEntity, BillingInvoiceEntity, BillingInvoiceItemEntity, BillingCycleEntity, MeterReadingEntity, MeterReadingCycleEntity])],
  controllers: [PrintController], providers: [PrintService], exports: [PrintService],
})
export class PrintModule {}
