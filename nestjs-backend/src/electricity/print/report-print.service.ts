// =============================================
// طباعة التقارير الـ 19 المتبقية - HTML Templates
// كل تقرير له صفحة طباعة عربية RTL احترافية
// =============================================
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ElectricitySubscriberEntity } from '../subscribers/entities/electricity-subscriber.entity';
import { BillingInvoiceEntity, BillingCycleEntity } from '../billing-engine/entities/billing.entity';
import { MeterReadingEntity } from '../meter-readings/entities/meter-reading.entity';

@Injectable()
export class ReportPrintService {
  constructor(
    @InjectRepository(ElectricitySubscriberEntity) private subRepo: Repository<ElectricitySubscriberEntity>,
    @InjectRepository(BillingInvoiceEntity) private invRepo: Repository<BillingInvoiceEntity>,
    @InjectRepository(BillingCycleEntity) private cycleRepo: Repository<BillingCycleEntity>,
    @InjectRepository(MeterReadingEntity) private readRepo: Repository<MeterReadingEntity>,
  ) {}

  private wrap(title: string, body: string): string {
    return `<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>${title}</title>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',Tahoma,Arial;padding:15px;color:#333;direction:rtl;font-size:12px}
    .hdr{text-align:center;border-bottom:3px double #1a237e;padding-bottom:10px;margin-bottom:15px}
    .hdr h1{font-size:18px;color:#1a237e}.hdr .sub{color:#666;font-size:12px}
    table{width:100%;border-collapse:collapse;margin:10px 0;font-size:11px}
    th{background:#1a237e;color:#fff;padding:6px;text-align:right}td{padding:5px;border-bottom:1px solid #e0e0e0}
    tr:nth-child(even){background:#f5f5f5}.tot{background:#e8eaf6!important;font-weight:bold}
    .sum{background:#e8f5e9;padding:10px;border-radius:6px;margin:10px 0}
    .r{color:#f44336}.g{color:#4caf50}.b{font-weight:bold}
    .foot{text-align:center;margin-top:20px;padding-top:10px;border-top:1px solid #ccc;font-size:10px;color:#999}
    .nopr{margin-bottom:15px;text-align:center}
    @media print{.nopr{display:none}body{padding:5px}}</style></head><body>
    <div class="nopr"><button onclick="window.print()" style="padding:8px 25px;background:#1a237e;color:#fff;border:none;border-radius:4px;cursor:pointer">🖨️ طباعة</button></div>
    ${body}<div class="foot">نظام الفوترة الكهربائية - ${new Date().toLocaleDateString('ar-EG')}</div></body></html>`;
  }

  // ═══ طباعة كشف تفصيلي بحالات الفواتير (R1: repkh2+) ═══
  async printDetailedV2(noa: number): Promise<string> {
    const sub = await this.subRepo.findOne({ where: { noa } });
    const invs = await this.invRepo.find({ where: { subscriberNoa: noa }, order: { invoiceDate: 'ASC' } });
    const rows = invs.map(i => `<tr><td>${i.invoiceNo}</td><td>${new Date(i.invoiceDate).toLocaleDateString('ar-EG')}</td><td>${i.consumption}</td><td>${(+i.totalAmount).toLocaleString()}</td><td>${(+i.paidAmount).toLocaleString()}</td><td class="${+i.remainingAmount>0?'r':'g'} b">${(+i.remainingAmount).toLocaleString()}</td><td>${i.status===4?'✅ مسددة':i.status===3?'⚠️ جزئي':i.status===2?'📋 مرحّلة':'📝 مسودة'}</td></tr>`).join('');
    return this.wrap(`كشف تفصيلي ${sub?.namea}`, `<div class="hdr"><h1>📋 كشف حساب تفصيلي بحالات الفواتير</h1><div class="sub">${sub?.namea} (${noa}) | عداد: ${sub?.meterNo||'-'}</div></div>
    <table><tr><th>فاتورة</th><th>التاريخ</th><th>استهلاك</th><th>المبلغ</th><th>مسدد</th><th>متبقي</th><th>الحالة</th></tr>${rows}
    <tr class="tot"><td colspan="3">الإجمالي (${invs.length})</td><td>${invs.reduce((s,i)=>s+ +i.totalAmount,0).toLocaleString()}</td><td class="g">${invs.reduce((s,i)=>s+ +i.paidAmount,0).toLocaleString()}</td><td class="r">${(+sub?.balance||0).toLocaleString()}</td><td></td></tr></table>`);
  }

  // ═══ طباعة ملخص شهري (R3: repkhm) ═══
  async printMonthlySummary(noa: number): Promise<string> {
    const sub = await this.subRepo.findOne({ where: { noa } });
    const invs = await this.invRepo.find({ where: { subscriberNoa: noa }, order: { invoiceDate: 'ASC' } });
    const byMonth: Record<string, any> = {};
    invs.forEach(i => { const k = `${new Date(i.invoiceDate).getFullYear()}-${String(new Date(i.invoiceDate).getMonth()+1).padStart(2,'0')}`; if(!byMonth[k]) byMonth[k]={month:k,billed:0,paid:0,consumption:0,count:0}; byMonth[k].billed+= +i.totalAmount; byMonth[k].paid+= +i.paidAmount; byMonth[k].consumption+= +i.consumption; byMonth[k].count++; });
    const months = Object.values(byMonth);
    const rows = months.map((m:any) => `<tr><td>${m.month}</td><td>${m.count}</td><td>${m.consumption}</td><td>${m.billed.toLocaleString()}</td><td class="g">${m.paid.toLocaleString()}</td><td class="r b">${(m.billed-m.paid).toLocaleString()}</td></tr>`).join('');
    return this.wrap(`ملخص شهري ${sub?.namea}`, `<div class="hdr"><h1>📊 ملخص شهري</h1><div class="sub">${sub?.namea} (${noa})</div></div>
    <table><tr><th>الشهر</th><th>فواتير</th><th>استهلاك</th><th>مفوتر</th><th>مسدد</th><th>متبقي</th></tr>${rows}</table>`);
  }

  // ═══ طباعة مقارنة شهرين (R6: repfm4) ═══
  async printCompareMonths(m1: number, y1: number, m2: number, y2: number): Promise<string> {
    const getData = async (m: number, y: number) => {
      const invs = await this.invRepo.createQueryBuilder('i').innerJoin(BillingCycleEntity,'c','i.billingCycleId=c.id').where('c.billingMonth=:m AND c.billingYear=:y',{m,y}).getMany();
      return { count: invs.length, billed: invs.reduce((s,i)=>s+ +i.totalAmount,0), paid: invs.reduce((s,i)=>s+ +i.paidAmount,0), consumption: invs.reduce((s,i)=>s+ +i.consumption,0) };
    };
    const d1 = await getData(m1,y1); const d2 = await getData(m2,y2);
    return this.wrap('مقارنة شهرين', `<div class="hdr"><h1>📊 مقارنة فواتير شهرين</h1></div>
    <table><tr><th>البند</th><th>${m1}/${y1}</th><th>${m2}/${y2}</th><th>الفرق</th><th>النسبة</th></tr>
    <tr><td>عدد الفواتير</td><td>${d1.count}</td><td>${d2.count}</td><td>${d2.count-d1.count}</td><td>${d1.count?Math.round((d2.count-d1.count)/d1.count*100):0}%</td></tr>
    <tr><td>الاستهلاك</td><td>${d1.consumption.toLocaleString()}</td><td>${d2.consumption.toLocaleString()}</td><td>${(d2.consumption-d1.consumption).toLocaleString()}</td><td>${d1.consumption?Math.round((d2.consumption-d1.consumption)/d1.consumption*100):0}%</td></tr>
    <tr><td>المفوتر</td><td>${d1.billed.toLocaleString()}</td><td>${d2.billed.toLocaleString()}</td><td class="b">${(d2.billed-d1.billed).toLocaleString()}</td><td>${d1.billed?Math.round((d2.billed-d1.billed)/d1.billed*100):0}%</td></tr>
    <tr><td>المحصّل</td><td class="g">${d1.paid.toLocaleString()}</td><td class="g">${d2.paid.toLocaleString()}</td><td>${(d2.paid-d1.paid).toLocaleString()}</td><td>${d1.paid?Math.round((d2.paid-d1.paid)/d1.paid*100):0}%</td></tr></table>`);
  }

  // ═══ طباعة مديونية تفصيلية (R11: repkredA) ═══
  async printDetailedDebt(minBalance: number = 0): Promise<string> {
    const subs = await this.subRepo.find({ where: { status: 1 }, order: { balance: 'DESC' } });
    const debtors = subs.filter(s => +s.balance > minBalance);
    const rows = debtors.slice(0,200).map((s,i) => `<tr><td>${i+1}</td><td>${s.noa}</td><td>${s.namea}</td><td>${s.meterNo||'-'}</td><td>${s.mobile||'-'}</td><td>${s.groupId||'-'}</td><td class="r b">${(+s.balance).toLocaleString()}</td></tr>`).join('');
    const total = debtors.reduce((s,d)=>s+ +d.balance,0);
    return this.wrap('مديونية تفصيلية', `<div class="hdr"><h1>⚠️ تقرير المديونية التفصيلي</h1><div class="sub">${debtors.length} مشترك | إجمالي: ${total.toLocaleString()}</div></div>
    <table><tr><th>#</th><th>الرقم</th><th>الاسم</th><th>العداد</th><th>الهاتف</th><th>المجموعة</th><th>المديونية</th></tr>${rows}
    <tr class="tot"><td colspan="6">الإجمالي (${debtors.length} مشترك)</td><td class="r">${total.toLocaleString()}</td></tr></table>`);
  }

  // ═══ طباعة مديونية حسب المجموعة (R12: repkredg) ═══
  async printDebtByGroup(): Promise<string> {
    const result = await this.subRepo.createQueryBuilder('s')
      .select('s.groupId','groupId').addSelect('COUNT(*)','count')
      .addSelect('SUM(CASE WHEN s.balance>0 THEN s.balance ELSE 0 END)','totalDebt')
      .addSelect('COUNT(CASE WHEN s.balance>0 THEN 1 END)','debtorCount')
      .where('s.status=1').groupBy('s.groupId').orderBy('"totalDebt"','DESC').getRawMany();
    const rows = result.map((r:any,i:number) => `<tr><td>${i+1}</td><td>${r.groupId||'-'}</td><td>${r.count}</td><td>${r.debtorCount}</td><td class="r b">${(+r.totalDebt).toLocaleString()}</td></tr>`).join('');
    const total = result.reduce((s:number,r:any)=>s+ +(r.totalDebt||0),0);
    return this.wrap('مديونية حسب المجموعة', `<div class="hdr"><h1>📊 تقرير المديونية حسب المجموعة</h1></div>
    <table><tr><th>#</th><th>المجموعة</th><th>المشتركين</th><th>المدينين</th><th>المديونية</th></tr>${rows}
    <tr class="tot"><td colspan="4">الإجمالي</td><td class="r">${total.toLocaleString()}</td></tr></table>`);
  }

  // ═══ طباعة قراءات مع أسماء (R9: repmzn) ═══
  async printReadingsWithNames(cycleId: number): Promise<string> {
    const readings = await this.readRepo.find({ where: { cycleId }, order: { subscriberNoa: 'ASC' } });
    const rows: string[] = [];
    for (const r of readings) {
      const sub = await this.subRepo.findOne({ where: { noa: r.subscriberNoa } });
      rows.push(`<tr><td>${r.subscriberNoa}</td><td>${sub?.namea||'-'}</td><td>${r.meterName||'-'}</td><td>${r.prevReading}</td><td>${r.currReading}</td><td class="b">${r.consumption}</td><td>${r.isAnomaly?'<span class="r">⚠️ شاذة</span>':'✅'}</td></tr>`);
    }
    const totalC = readings.reduce((s,r)=>s+ +r.consumption,0);
    return this.wrap('قراءات مع أسماء', `<div class="hdr"><h1>📖 كشف القراءات مع أسماء المشتركين</h1><div class="sub">الدورة ${cycleId} | ${readings.length} مشترك</div></div>
    <table><tr><th>الرقم</th><th>الاسم</th><th>العداد</th><th>سابقة</th><th>حالية</th><th>استهلاك</th><th>حالة</th></tr>${rows.join('')}
    <tr class="tot"><td colspan="5">الإجمالي</td><td class="b">${totalC.toLocaleString()}</td><td>${readings.filter(r=>r.isAnomaly).length} شاذة</td></tr></table>`);
  }

  // ═══ طباعة أرصدة المشتركين (R14: repkast) ═══
  async printAllBalances(): Promise<string> {
    const subs = await this.subRepo.find({ where: { status: 1 }, order: { balance: 'DESC' } });
    const rows = subs.slice(0,300).map((s,i) => `<tr><td>${i+1}</td><td>${s.noa}</td><td>${s.namea}</td><td>${s.groupId||'-'}</td><td class="${+s.balance>0?'r':'g'} b">${(+s.balance).toLocaleString()}</td></tr>`).join('');
    const pos = subs.filter(s=>+s.balance>0).reduce((sum,s)=>sum+ +s.balance,0);
    const neg = subs.filter(s=>+s.balance<0).reduce((sum,s)=>sum+ +s.balance,0);
    return this.wrap('أرصدة المشتركين', `<div class="hdr"><h1>💰 أرصدة كل المشتركين</h1><div class="sub">${subs.length} مشترك | مدين: ${pos.toLocaleString()} | دائن: ${Math.abs(neg).toLocaleString()}</div></div>
    <table><tr><th>#</th><th>الرقم</th><th>الاسم</th><th>المجموعة</th><th>الرصيد</th></tr>${rows}</table>`);
  }

  // ═══ طباعة إحصائي جغرافي (R13: gsas) ═══
  async printGeographicStats(): Promise<string> {
    const byGroup = await this.subRepo.createQueryBuilder('s').select('s.groupId','gid').addSelect('COUNT(*)','cnt').addSelect('SUM(s.balance)','bal').addSelect('COUNT(CASE WHEN s.disconnectFlag=1 THEN 1 END)','disc').groupBy('s.groupId').getRawMany();
    const byCat = await this.subRepo.createQueryBuilder('s').select('s.billingCategory','cat').addSelect('COUNT(*)','cnt').groupBy('s.billingCategory').getRawMany();
    const gRows = byGroup.map((r:any) => `<tr><td>${r.gid||'-'}</td><td>${r.cnt}</td><td>${(+r.bal).toLocaleString()}</td><td>${r.disc}</td></tr>`).join('');
    const cRows = byCat.map((r:any) => `<tr><td>${r.cat}</td><td>${r.cnt}</td></tr>`).join('');
    return this.wrap('إحصائي جغرافي', `<div class="hdr"><h1>🗺️ التقرير الإحصائي الجغرافي</h1></div>
    <h3>حسب المجموعة:</h3><table><tr><th>المجموعة</th><th>المشتركين</th><th>الرصيد</th><th>مفصولين</th></tr>${gRows}</table>
    <h3 style="margin-top:15px">حسب الفئة:</h3><table><tr><th>الفئة</th><th>العدد</th></tr>${cRows}</table>`);
  }

  // ═══ طباعة سندات حسب الفترة (R8: repsnda) ═══
  async printVouchersByPeriod(dateFrom: string, dateTo: string): Promise<string> {
    const invs = await this.invRepo.createQueryBuilder('i').where('i.invoiceDate BETWEEN :f AND :t AND i.paidAmount>0',{f:dateFrom,t:dateTo}).orderBy('i.invoiceDate').getMany();
    const total = invs.reduce((s,i)=>s+ +i.paidAmount,0);
    const rows = invs.map((i,idx) => `<tr><td>${idx+1}</td><td>${i.invoiceNo}</td><td>${new Date(i.invoiceDate).toLocaleDateString('ar-EG')}</td><td>${i.subscriberNoa}</td><td>${i.subscriberName||'-'}</td><td class="g b">${(+i.paidAmount).toLocaleString()}</td></tr>`).join('');
    return this.wrap('سندات حسب الفترة', `<div class="hdr"><h1>🧾 تقرير السندات حسب الفترة</h1><div class="sub">من ${dateFrom} إلى ${dateTo}</div></div>
    <table><tr><th>#</th><th>الفاتورة</th><th>التاريخ</th><th>المشترك</th><th>الاسم</th><th>المبلغ</th></tr>${rows}
    <tr class="tot"><td colspan="5">الإجمالي (${invs.length} عملية)</td><td class="g b">${total.toLocaleString()}</td></tr></table>`);
  }
}
