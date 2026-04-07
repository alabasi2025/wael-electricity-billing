// =============================================
// خدمة ربط السندات بالفواتير الكهربائية
// وصلاحيات الفوترة (HMH)
// =============================================
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillingInvoiceEntity } from '../billing-engine/entities/billing.entity';
import { ElectricitySubscriberEntity } from '../subscribers/entities/electricity-subscriber.entity';

@Injectable()
export class VoucherInvoiceLinkService {
  private readonly logger = new Logger(VoucherInvoiceLinkService.name);

  constructor(
    @InjectRepository(BillingInvoiceEntity) private invRepo: Repository<BillingInvoiceEntity>,
    @InjectRepository(ElectricitySubscriberEntity) private subRepo: Repository<ElectricitySubscriberEntity>,
  ) {}

  // ─── ربط سند قبض موجود بفاتورة كهرباء ───
  async linkVoucherToInvoice(voucherNos: number, invoiceId: number, amount: number) {
    const inv = await this.invRepo.findOne({ where: { id: invoiceId } });
    if (!inv) return { success: false, error: 'الفاتورة غير موجودة' };

    inv.paidAmount = +inv.paidAmount + amount;
    inv.remainingAmount = +inv.grandTotal - +inv.paidAmount;
    inv.status = inv.remainingAmount <= 0 ? 4 : 3;
    await this.invRepo.save(inv);

    // تحديث رصيد المشترك
    const sub = await this.subRepo.findOne({ where: { noa: inv.subscriberNoa } });
    if (sub) { sub.balance = +sub.balance - amount; await this.subRepo.save(sub); }

    this.logger.log(`ربط سند ${voucherNos} بفاتورة ${inv.invoiceNo} - مبلغ: ${amount}`);
    return { success: true, message: `تم ربط سند ${voucherNos} بفاتورة ${inv.invoiceNo}`, newStatus: inv.status, remaining: inv.remainingAmount };
  }

  // ─── البحث عن فواتير مشترك لربطها بسند ───
  async findLinkableInvoices(subscriberNoa: number) {
    const invoices = await this.invRepo.find({
      where: { subscriberNoa, status: 2 }, // مرحّلة وغير مسددة
      order: { invoiceDate: 'ASC' },
    });
    return {
      data: invoices.filter(i => +i.remainingAmount > 0).map(i => ({
        id: i.id, invoiceNo: i.invoiceNo, date: i.invoiceDate,
        total: +i.grandTotal, paid: +i.paidAmount, remaining: +i.remainingAmount,
      })),
    };
  }

  // ─── سداد تلقائي (أقدم فاتورة أولاً) ───
  async autoPayFromVoucher(subscriberNoa: number, totalAmount: number, voucherNos: number) {
    const invoices = await this.invRepo.find({
      where: { subscriberNoa },
      order: { invoiceDate: 'ASC' },
    });
    const unpaid = invoices.filter(i => +i.remainingAmount > 0 && i.status >= 2);

    let remaining = totalAmount;
    const payments = [];

    for (const inv of unpaid) {
      if (remaining <= 0) break;
      const payAmount = Math.min(remaining, +inv.remainingAmount);
      inv.paidAmount = +inv.paidAmount + payAmount;
      inv.remainingAmount = +inv.grandTotal - +inv.paidAmount;
      inv.status = inv.remainingAmount <= 0 ? 4 : 3;
      await this.invRepo.save(inv);
      remaining -= payAmount;
      payments.push({ invoiceNo: inv.invoiceNo, amount: payAmount, remaining: inv.remainingAmount });
    }

    // تحديث رصيد المشترك
    const sub = await this.subRepo.findOne({ where: { noa: subscriberNoa } });
    if (sub) { sub.balance = +sub.balance - totalAmount; await this.subRepo.save(sub); }

    return {
      data: { payments, totalPaid: totalAmount - remaining, unallocated: remaining },
      message: `تم توزيع ${(totalAmount - remaining).toLocaleString()} على ${payments.length} فاتورة`,
    };
  }
}
