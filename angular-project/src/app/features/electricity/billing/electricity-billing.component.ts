import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import {
  ElectricityWorkflowService,
  LegacyBillingRecord,
} from '../../../core/services/electricity-workflow.service';
import { electricityPageStyles } from '../electricity-page.styles';

@Component({
  selector: 'app-electricity-billing',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
  ],
  template: `
    <div class="electricity-page" dir="rtl">
      <section class="hero">
        <div class="hero-copy">
          <span class="hero-kicker">FTORA / DATAFFX / DATAFY</span>
          <h1>الفوترة الشهرية لقراءات العدادات</h1>
          <p>
            تعرض هذه الشاشة سجلات الفوترة الشهرية الناتجة عن القراءة: القراءة السابقة
            والحالية، الاستهلاك، قيمة الفاتورة، رقم الفاتورة، وشهر الفوترة.
          </p>
          <div class="hero-actions">
            <button mat-flat-button (click)="switchSource('dataffx')">مسار DATAFFX</button>
            <button mat-stroked-button (click)="switchSource('datafy')">مسار DATAFY</button>
            <a mat-stroked-button routerLink="/electricity/posting">متابعة الترحيل</a>
          </div>
        </div>

        <div class="hero-side">
          <div class="metric-row">
            <span>المصدر الحالي</span>
            <strong>{{ sourceLabel() }}</strong>
          </div>
          <div class="metric-row">
            <span>عدد السجلات المعروضة</span>
            <strong>{{ billingRows().length }}</strong>
          </div>
          <div class="metric-row">
            <span>قيمة الفواتير</span>
            <strong>{{ totalAmount() | number:'1.0-2' }}</strong>
          </div>
        </div>
      </section>

      @if (loading()) {
        <section class="panel empty-state">
          <mat-spinner diameter="42"></mat-spinner>
        </section>
      } @else {
        <section class="summary-grid">
          <mat-card class="stat-card">
            <div class="stat-head">
              <div>
                <span>إجمالي الاستهلاك</span>
                <strong>{{ totalConsumption() | number:'1.0-2' }}</strong>
              </div>
              <mat-icon>flash_on</mat-icon>
            </div>
            <span>مجموع الحقل AST من السجلات الحالية.</span>
          </mat-card>

          <mat-card class="stat-card">
            <div class="stat-head">
              <div>
                <span>إجمالي المبالغ</span>
                <strong>{{ totalAmount() | number:'1.0-2' }}</strong>
              </div>
              <mat-icon>payments</mat-icon>
            </div>
            <span>مجموع الحقل KAST للفواتير الظاهرة.</span>
          </mat-card>

          <mat-card class="stat-card">
            <div class="stat-head">
              <div>
                <span>فواتير برقم فاتورة</span>
                <strong>{{ invoiceCount() }}</strong>
              </div>
              <mat-icon>confirmation_number</mat-icon>
            </div>
            <span>السجلات التي تحتوي على حقل رقم فاتورة.</span>
          </mat-card>
        </section>
      }

      <section class="panel">
        <div class="toolbar-row">
          <div>
            <h2 class="section-title">
              <mat-icon>receipt_long</mat-icon>
              معاينة سجلات الفوترة
            </h2>
            <p class="muted">الجدول أدناه هو أقرب تمثيل مباشر لبيانات الفوترة القديمة داخل النظام الجديد.</p>
          </div>
          <div class="legacy-tag">{{ sourceLabel() }}</div>
        </div>

        @if (!billingRows().length && !loading()) {
          <div class="empty-state">لا توجد سجلات فوترة في المصدر المحدد.</div>
        } @else {
          <div class="table-wrap">
            <table mat-table [dataSource]="billingRows()" class="data-table">
              <ng-container matColumnDef="noa">
                <th mat-header-cell *matHeaderCellDef>المشترك</th>
                <td mat-cell *matCellDef="let row">{{ row.noa || '-' }}</td>
              </ng-container>

              <ng-container matColumnDef="kh">
                <th mat-header-cell *matHeaderCellDef>الحالية</th>
                <td mat-cell *matCellDef="let row">{{ row.kh ?? 0 }}</td>
              </ng-container>

              <ng-container matColumnDef="ks">
                <th mat-header-cell *matHeaderCellDef>السابقة</th>
                <td mat-cell *matCellDef="let row">{{ row.ks ?? 0 }}</td>
              </ng-container>

              <ng-container matColumnDef="ast">
                <th mat-header-cell *matHeaderCellDef>الاستهلاك</th>
                <td mat-cell *matCellDef="let row">{{ row.ast ?? 0 }}</td>
              </ng-container>

              <ng-container matColumnDef="kast">
                <th mat-header-cell *matHeaderCellDef>قيمة الفاتورة</th>
                <td mat-cell *matCellDef="let row" class="amount-positive">
                  {{ row.kast ?? 0 | number:'1.0-2' }}
                </td>
              </ng-container>

              <ng-container matColumnDef="month">
                <th mat-header-cell *matHeaderCellDef>الشهر</th>
                <td mat-cell *matCellDef="let row">{{ row.month || '-' }}</td>
              </ng-container>

              <ng-container matColumnDef="nofat">
                <th mat-header-cell *matHeaderCellDef>رقم الفاتورة</th>
                <td mat-cell *matCellDef="let row">{{ row.nofat || '-' }}</td>
              </ng-container>

              <ng-container matColumnDef="memoa">
                <th mat-header-cell *matHeaderCellDef>البيان</th>
                <td mat-cell *matCellDef="let row">{{ row.memoa || '-' }}</td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
            </table>
          </div>
        }
      </section>
    </div>
  `,
  styles: [
    electricityPageStyles,
    `
      .hero-actions button[mat-flat-button] {
        background: #ffd54f;
        color: #102542;
      }
    `,
  ],
})
export class ElectricityBillingComponent implements OnInit {
  displayedColumns = ['noa', 'kh', 'ks', 'ast', 'kast', 'month', 'nofat', 'memoa'];

  loading = signal(true);
  source = signal<'dataffx' | 'datafy'>('dataffx');
  billingRows = signal<LegacyBillingRecord[]>([]);

  constructor(private workflowService: ElectricityWorkflowService) {}

  ngOnInit(): void {
    this.loadBilling();
  }

  switchSource(source: 'dataffx' | 'datafy'): void {
    this.source.set(source);
    this.loadBilling();
  }

  loadBilling(): void {
    this.loading.set(true);
    this.workflowService.getLegacyBilling(this.source(), 0, 30).subscribe({
      next: (response) => {
        this.billingRows.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.billingRows.set([]);
        this.loading.set(false);
      },
    });
  }

  sourceLabel(): string {
    return this.source() === 'dataffx' ? 'فوترة DATAFFX' : 'فوترة DATAFY';
  }

  totalConsumption(): number {
    return this.billingRows().reduce((sum, row) => sum + Number(row.ast || 0), 0);
  }

  totalAmount(): number {
    return this.billingRows().reduce((sum, row) => sum + Number(row.kast || 0), 0);
  }

  invoiceCount(): number {
    return this.billingRows().filter((row) => !!row.nofat).length;
  }
}
