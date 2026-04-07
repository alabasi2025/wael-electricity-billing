import { Component } from '@angular/core';


@Component({
    selector: 'app-voucher-report',
    imports: [],
    template: `
    <section class="page-placeholder" dir="rtl">
      <h2>Voucher Report</h2>
      <p>هذه الواجهة قيد التطوير حالياً.</p>
    </section>
  `,
    styles: [`
    .page-placeholder {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 24px;
    }

    h2 {
      margin: 0 0 8px;
      color: #1a237e;
      font-size: 22px;
    }

    p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }
  `]
})
export class VoucherReportComponent {}
