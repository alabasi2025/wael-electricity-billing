import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ElectricityWorkflowService } from '../../../core/services/electricity-workflow.service';
import { electricityPageStyles } from '../electricity-page.styles';

@Component({
  selector: 'app-electricity-collections',
  imports: [CommonModule, FormsModule, RouterModule, MatButtonModule, MatCardModule, MatIconModule, MatTableModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatTooltipModule],
  template: `
    <div class="electricity-page" dir="rtl">
      <section class="hero">
        <div class="hero-copy">
          <span class="hero-kicker">SNDK22 + SNDK / التحصيل والسداد</span>
          <h1>التحصيل والسداد</h1>
          <p>البحث عن فواتير المشتركين المستحقة وتسجيل المدفوعات مع تحديث الأرصدة تلقائياً.</p>
          <div class="hero-actions">
            <a mat-stroked-button routerLink="/electricity/billing"><mat-icon>receipt</mat-icon> الفوترة</a>
            <a mat-stroked-button routerLink="/electricity/reports"><mat-icon>analytics</mat-icon> التقارير</a>
          </div>
        </div>
        <div class="hero-side">
          <div class="metric-row"><span>إجمالي غير المسدد</span><strong style="color:#f44336">{{(billStats()?.totalUnpaid || 0) | number}}</strong></div>
          <div class="metric-row"><span>فواتير مستحقة</span><strong>{{billStats()?.unpaidInvoices || 0}}</strong></div>
          <div class="metric-row"><span>نسبة التحصيل</span><strong style="color:#4caf50">{{billStats()?.collectionRate || 0}}%</strong></div>
        </div>
      </section>

      <!-- بحث -->
      <mat-card style="margin:1rem 0;padding:1.5rem">
        <div style="display:flex;gap:1rem;align-items:end">
          <mat-form-field appearance="outline" style="flex:1">
            <mat-label>بحث برقم المشترك</mat-label>
            <input matInput type="number" [(ngModel)]="searchNoa" (keyup.enter)="loadUnpaid()" placeholder="أدخل رقم المشترك">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          <button mat-flat-button color="primary" (click)="loadUnpaid()"><mat-icon>search</mat-icon> بحث</button>
          <button mat-stroked-button (click)="searchNoa = undefined; loadUnpaid()"><mat-icon>clear</mat-icon> عرض الكل</button>
        </div>
      </mat-card>

      <!-- الفواتير المستحقة -->
      <mat-card style="margin:1rem 0;padding:1.5rem">
        <h3><mat-icon>receipt_long</mat-icon> الفواتير المستحقة ({{unpaidInvoices()?.length || 0}} فاتورة - إجمالي: {{totalUnpaid() | number}})</h3>
        <table mat-table [dataSource]="unpaidInvoices()" style="width:100%">
          <ng-container matColumnDef="invoiceNo"><th mat-header-cell *matHeaderCellDef>رقم الفاتورة</th><td mat-cell *matCellDef="let r">{{r.invoiceNo}}</td></ng-container>
          <ng-container matColumnDef="subscriberNoa"><th mat-header-cell *matHeaderCellDef>رقم المشترك</th><td mat-cell *matCellDef="let r">{{r.subscriberNoa}}</td></ng-container>
          <ng-container matColumnDef="subscriberName"><th mat-header-cell *matHeaderCellDef>الاسم</th><td mat-cell *matCellDef="let r">{{r.subscriberName}}</td></ng-container>
          <ng-container matColumnDef="invoiceDate"><th mat-header-cell *matHeaderCellDef>التاريخ</th><td mat-cell *matCellDef="let r">{{r.invoiceDate | date:'shortDate'}}</td></ng-container>
          <ng-container matColumnDef="grandTotal"><th mat-header-cell *matHeaderCellDef>الإجمالي</th><td mat-cell *matCellDef="let r">{{r.grandTotal | number}}</td></ng-container>
          <ng-container matColumnDef="paidAmount"><th mat-header-cell *matHeaderCellDef>المسدد</th><td mat-cell *matCellDef="let r" style="color:#4caf50">{{r.paidAmount | number}}</td></ng-container>
          <ng-container matColumnDef="remainingAmount"><th mat-header-cell *matHeaderCellDef>المتبقي</th><td mat-cell *matCellDef="let r" style="color:#f44336;font-weight:bold">{{r.remainingAmount | number}}</td></ng-container>
          <ng-container matColumnDef="pay"><th mat-header-cell *matHeaderCellDef>سداد</th><td mat-cell *matCellDef="let r">
            <div style="display:flex;gap:4px;align-items:center">
              <input type="number" [(ngModel)]="r._payAmount" [placeholder]="r.remainingAmount" style="width:90px;border:1px solid #ccc;border-radius:4px;padding:6px;text-align:center">
              <button mat-mini-fab color="primary" (click)="payInvoice(r)" matTooltip="تسجيل سداد"><mat-icon>payment</mat-icon></button>
              <button mat-mini-fab color="accent" (click)="r._payAmount = r.remainingAmount" matTooltip="سداد كامل"><mat-icon>done_all</mat-icon></button>
            </div>
          </td></ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        <p *ngIf="!unpaidInvoices()?.length" style="text-align:center;color:#999;padding:2rem">لا توجد فواتير مستحقة {{searchNoa ? 'لهذا المشترك' : ''}}</p>
      </mat-card>
    </div>
  `,
  styles: [electricityPageStyles, `.metric-row { display:flex;justify-content:space-between;padding:0.3rem 0; }`],
})
export class ElectricityCollectionsComponent implements OnInit {
  unpaidInvoices = signal<any[]>([]);
  billStats = signal<any>(null);
  totalUnpaid = signal(0);
  searchNoa: number | undefined;
  displayedColumns = ['invoiceNo','subscriberNoa','subscriberName','invoiceDate','grandTotal','paidAmount','remainingAmount','pay'];

  constructor(private svc: ElectricityWorkflowService, private snack: MatSnackBar) {}
  ngOnInit() { this.loadUnpaid(); this.svc.getBillingStats().subscribe(r => this.billStats.set(r.data)); }

  loadUnpaid() {
    this.svc.getUnpaidInvoices(this.searchNoa).subscribe(r => {
      this.unpaidInvoices.set((r.data || []).map((x: any) => ({ ...x, _payAmount: null })));
      this.totalUnpaid.set(r.totalUnpaid || 0);
    });
  }

  payInvoice(inv: any) {
    const amount = inv._payAmount || inv.remainingAmount;
    if (!amount || amount <= 0) return;
    this.svc.recordPayment({ invoiceId: inv.id, amount }).subscribe({
      next: r => { this.snack.open(r.message, 'حسناً', { duration: 3000 }); this.loadUnpaid(); this.svc.getBillingStats().subscribe(r2 => this.billStats.set(r2.data)); },
      error: e => this.snack.open(e.error?.message || 'خطأ', 'حسناً', { duration: 3000 }),
    });
  }
}
