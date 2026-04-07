import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { ElectricityWorkflowService } from '../../../core/services/electricity-workflow.service';
import { electricityPageStyles } from '../electricity-page.styles';

@Component({
  selector: 'app-electricity-reports',
  imports: [ CommonModule, FormsModule, RouterModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, MatTableModule, MatSelectModule, MatSnackBarModule, MatTabsModule ],
  template: `
    <div class="electricity-page" dir="rtl">
      <section class="hero">
        <div class="hero-copy">
          <span class="hero-kicker">REPKH + REPFM + REPDAY + REPMZA + REPKRED / التقارير</span>
          <h1>تقارير الكهرباء</h1>
          <p>8 تقارير شاملة تغطي كل تقارير النظام القديم: كشف حساب، فواتير شهرية، غير مسددة، قراءات، تحصيل يومي، استهلاك مجموعات، كشف فصل، تقرير مالي.</p>
        </div>
      </section>

      <mat-tab-group>
        <!-- تقرير 1: كشف حساب مشترك -->
        <mat-tab label="📋 كشف حساب">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>person</mat-icon> كشف حساب مشترك (repkh1)</h3>
            <div style="display:flex;gap:1rem;align-items:end">
              <mat-form-field appearance="outline"><mat-label>رقم المشترك</mat-label><input matInput type="number" [(ngModel)]="statementNoa"></mat-form-field>
              <button mat-flat-button color="primary" (click)="loadStatement()"><mat-icon>search</mat-icon> عرض</button>
              <button mat-stroked-button *ngIf="statementData()" (click)="printReport()"><mat-icon>print</mat-icon> طباعة</button>
            </div>
            <div *ngIf="statementData()" style="margin-top:1rem">
              <div style="background:#f5f5f5;padding:1rem;border-radius:8px;margin-bottom:1rem">
                <strong>{{statementData()?.subscriber?.name}}</strong> | عداد: {{statementData()?.subscriber?.meter}} | هاتف: {{statementData()?.subscriber?.mobile || '-'}}
                <div>إجمالي المفوتر: <strong>{{statementData()?.summary?.totalBilled | number}}</strong> | المسدد: <strong style="color:#4caf50">{{statementData()?.summary?.totalPaid | number}}</strong> | الرصيد: <strong style="color:#f44336">{{statementData()?.summary?.currentBalance | number}}</strong></div>
              </div>
              <table mat-table [dataSource]="statementData()?.statement || []" style="width:100%">
                <ng-container matColumnDef="invoiceNo"><th mat-header-cell *matHeaderCellDef>الفاتورة</th><td mat-cell *matCellDef="let r">{{r.invoiceNo}}</td></ng-container>
                <ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef>التاريخ</th><td mat-cell *matCellDef="let r">{{r.date | date:'shortDate'}}</td></ng-container>
                <ng-container matColumnDef="consumption"><th mat-header-cell *matHeaderCellDef>الاستهلاك</th><td mat-cell *matCellDef="let r">{{r.consumption}}</td></ng-container>
                <ng-container matColumnDef="amount"><th mat-header-cell *matHeaderCellDef>المبلغ</th><td mat-cell *matCellDef="let r">{{r.amount | number}}</td></ng-container>
                <ng-container matColumnDef="paid"><th mat-header-cell *matHeaderCellDef>المسدد</th><td mat-cell *matCellDef="let r" style="color:#4caf50">{{r.paid | number}}</td></ng-container>
                <ng-container matColumnDef="balance"><th mat-header-cell *matHeaderCellDef>الرصيد</th><td mat-cell *matCellDef="let r" [style.color]="r.balance > 0 ? '#f44336' : '#4caf50'" style="font-weight:bold">{{r.balance | number}}</td></ng-container>
                <tr mat-header-row *matHeaderRowDef="['invoiceNo','date','consumption','amount','paid','balance']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['invoiceNo','date','consumption','amount','paid','balance'];"></tr>
              </table>
            </div>
          </mat-card>
        </mat-tab>

        <!-- تقرير 2: الفواتير الشهرية -->
        <mat-tab label="📊 فواتير شهرية">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>calendar_month</mat-icon> تقرير الفواتير الشهرية (repfm2)</h3>
            <div style="display:flex;gap:1rem;align-items:end">
              <mat-form-field appearance="outline"><mat-label>الشهر</mat-label><input matInput type="number" [(ngModel)]="monthlyMonth" min="1" max="12"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>السنة</mat-label><input matInput type="number" [(ngModel)]="monthlyYear"></mat-form-field>
              <button mat-flat-button color="primary" (click)="loadMonthlyReport()"><mat-icon>search</mat-icon> عرض</button>
            </div>
            <div *ngIf="monthlyData()" style="margin-top:1rem">
              <div style="background:#e3f2fd;padding:1rem;border-radius:8px;margin-bottom:1rem">
                الفترة: <strong>{{monthlyData()?.period}}</strong> | الفواتير: <strong>{{monthlyData()?.summary?.count}}</strong> | الاستهلاك: <strong>{{monthlyData()?.summary?.totalConsumption | number}}</strong> | المفوتر: <strong>{{monthlyData()?.summary?.totalBilled | number}}</strong> | غير مسدد: <strong style="color:#f44336">{{monthlyData()?.summary?.totalUnpaid | number}}</strong>
              </div>
              <table mat-table [dataSource]="monthlyData()?.invoices || []" style="width:100%">
                <ng-container matColumnDef="noa"><th mat-header-cell *matHeaderCellDef>المشترك</th><td mat-cell *matCellDef="let r">{{r.noa}}</td></ng-container>
                <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>الاسم</th><td mat-cell *matCellDef="let r">{{r.name}}</td></ng-container>
                <ng-container matColumnDef="consumption"><th mat-header-cell *matHeaderCellDef>الاستهلاك</th><td mat-cell *matCellDef="let r">{{r.consumption}}</td></ng-container>
                <ng-container matColumnDef="amount"><th mat-header-cell *matHeaderCellDef>المبلغ</th><td mat-cell *matCellDef="let r">{{r.amount | number}}</td></ng-container>
                <ng-container matColumnDef="remaining"><th mat-header-cell *matHeaderCellDef>المتبقي</th><td mat-cell *matCellDef="let r" style="color:#f44336">{{r.remaining | number}}</td></ng-container>
                <tr mat-header-row *matHeaderRowDef="['noa','name','consumption','amount','remaining']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['noa','name','consumption','amount','remaining'];"></tr>
              </table>
            </div>
          </mat-card>
        </mat-tab>

        <!-- تقرير 3: التقرير المالي الشامل -->
        <mat-tab label="📈 التقرير المالي">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>analytics</mat-icon> التقرير المالي الشامل</h3>
            <button mat-flat-button color="primary" (click)="loadFinancialSummary()"><mat-icon>refresh</mat-icon> تحديث</button>
            <div *ngIf="financialData()" style="margin-top:1rem;display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1rem">
              <div class="stat-card"><mat-icon>people</mat-icon><div><span>المشتركين النشطين</span><strong>{{financialData()?.subscribers?.total}}</strong></div></div>
              <div class="stat-card" style="border-color:#f44336"><mat-icon style="color:#f44336">power_off</mat-icon><div><span>مفصولين</span><strong>{{financialData()?.subscribers?.disconnected}}</strong></div></div>
              <div class="stat-card" style="border-color:#ff9800"><mat-icon style="color:#ff9800">warning</mat-icon><div><span>مدينين</span><strong>{{financialData()?.subscribers?.debtors}}</strong></div></div>
              <div class="stat-card"><mat-icon>receipt</mat-icon><div><span>إجمالي المفوتر</span><strong>{{financialData()?.financial?.totalBilled | number}}</strong></div></div>
              <div class="stat-card" style="border-color:#4caf50"><mat-icon style="color:#4caf50">payments</mat-icon><div><span>إجمالي المحصّل</span><strong>{{financialData()?.financial?.totalPaid | number}}</strong></div></div>
              <div class="stat-card" style="border-color:#f44336"><mat-icon style="color:#f44336">money_off</mat-icon><div><span>غير مسدد</span><strong>{{financialData()?.financial?.totalUnpaid | number}}</strong></div></div>
              <div class="stat-card" style="border-color:#2196f3"><mat-icon style="color:#2196f3">trending_up</mat-icon><div><span>نسبة التحصيل</span><strong>{{financialData()?.financial?.collectionRate}}%</strong></div></div>
              <div class="stat-card"><mat-icon>bolt</mat-icon><div><span>إجمالي الاستهلاك</span><strong>{{financialData()?.consumption?.total | number}}</strong></div></div>
            </div>
          </mat-card>
        </mat-tab>

        <!-- تقرير 4: كشف الفصل -->
        <mat-tab label="⛔ كشف الفصل">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>block</mat-icon> المشتركين المراد فصلهم</h3>
            <div style="display:flex;gap:1rem;align-items:end">
              <mat-form-field appearance="outline"><mat-label>الحد الأدنى للمديونية</mat-label><input matInput type="number" [(ngModel)]="disconnectMinBalance"></mat-form-field>
              <button mat-flat-button color="warn" (click)="loadDisconnectionList()"><mat-icon>search</mat-icon> عرض</button>
            </div>
            <div *ngIf="disconnectionData()" style="margin-top:1rem">
              <div style="background:#ffebee;padding:1rem;border-radius:8px;margin-bottom:1rem">
                عدد المشتركين: <strong>{{disconnectionData()?.summary?.count}}</strong> | إجمالي المديونية: <strong style="color:#f44336">{{disconnectionData()?.summary?.totalDebt | number}}</strong>
              </div>
              <table mat-table [dataSource]="disconnectionData()?.subscribers || []" style="width:100%">
                <ng-container matColumnDef="noa"><th mat-header-cell *matHeaderCellDef>الرقم</th><td mat-cell *matCellDef="let r">{{r.noa}}</td></ng-container>
                <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>الاسم</th><td mat-cell *matCellDef="let r">{{r.name}}</td></ng-container>
                <ng-container matColumnDef="meter"><th mat-header-cell *matHeaderCellDef>العداد</th><td mat-cell *matCellDef="let r">{{r.meter}}</td></ng-container>
                <ng-container matColumnDef="mobile"><th mat-header-cell *matHeaderCellDef>الهاتف</th><td mat-cell *matCellDef="let r">{{r.mobile || '-'}}</td></ng-container>
                <ng-container matColumnDef="balance"><th mat-header-cell *matHeaderCellDef>المديونية</th><td mat-cell *matCellDef="let r" style="color:#f44336;font-weight:bold">{{r.balance | number}}</td></ng-container>
                <tr mat-header-row *matHeaderRowDef="['noa','name','meter','mobile','balance']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['noa','name','meter','mobile','balance'];"></tr>
              </table>
            </div>
          </mat-card>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [electricityPageStyles, `
    .stat-card { display:flex;align-items:center;gap:1rem;padding:1.5rem;border:2px solid #e0e0e0;border-radius:12px;background:#fff; }
    .stat-card div { display:flex;flex-direction:column; }
    .stat-card span { font-size:0.85rem;color:#666; }
    .stat-card strong { font-size:1.5rem; }
  `],
})
export class ElectricityReportsComponent implements OnInit {
  statementData = signal<any>(null);
  monthlyData = signal<any>(null);
  financialData = signal<any>(null);
  disconnectionData = signal<any>(null);
  statementNoa = 0;
  monthlyMonth = new Date().getMonth() + 1;
  monthlyYear = new Date().getFullYear();
  disconnectMinBalance = 50000;

  constructor(private svc: ElectricityWorkflowService, private snack: MatSnackBar) {}
  ngOnInit() { this.loadFinancialSummary(); }

  loadStatement() {
    if (!this.statementNoa) return;
    this.svc.getSubscriberStatement(this.statementNoa).subscribe({ next: r => this.statementData.set(r.data), error: e => this.snack.open(e.error?.message||'خطأ','حسناً',{duration:3000}) });
  }
  loadMonthlyReport() { this.svc.getMonthlyBillingReport(this.monthlyMonth, this.monthlyYear).subscribe(r => this.monthlyData.set(r.data)); }
  loadFinancialSummary() { this.svc.getFinancialSummaryReport().subscribe(r => this.financialData.set(r.data)); }
  loadDisconnectionList() { this.svc.getDisconnectionReport(this.disconnectMinBalance).subscribe(r => this.disconnectionData.set(r.data)); }
  printReport() { window.print(); }
}
