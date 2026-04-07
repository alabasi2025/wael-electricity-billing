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
  LegacyPostingRecord,
} from '../../../core/services/electricity-workflow.service';
import { electricityPageStyles } from '../electricity-page.styles';

@Component({
  selector: 'app-electricity-posting',
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
          <span class="hero-kicker">THOEL</span>
          <h1>اعتماد وترحيل الفوترة</h1>
          <p>
            هذه الشاشة تعرض البيانات التي تمثل مرحلة تثبيت الفوترة وترحيلها إلى القيود
            والحركات اللاحقة، وهي أقرب ما يقابل شاشة thoel في النظام القديم.
          </p>
          <div class="hero-actions">
            <a mat-flat-button routerLink="/electricity/billing">العودة للفوترة</a>
            <a mat-stroked-button routerLink="/electricity/collections">فتح السداد</a>
          </div>
        </div>

        <div class="hero-side">
          <div class="metric-row">
            <span>عمليات الترحيل</span>
            <strong>{{ rows().length }}</strong>
          </div>
          <div class="metric-row">
            <span>إجمالي الترحيل</span>
            <strong>{{ totalPosting() | number:'1.0-2' }}</strong>
          </div>
          <div class="metric-row">
            <span>المبالغ النقدية</span>
            <strong>{{ totalCash() | number:'1.0-2' }}</strong>
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
                <span>قيود محاسبية</span>
                <strong>{{ linkedEntries() }}</strong>
              </div>
              <mat-icon>account_tree</mat-icon>
            </div>
            <span>عدد السجلات المرتبطة بقيود محاسبية.</span>
          </mat-card>

          <mat-card class="stat-card">
            <div class="stat-head">
              <div>
                <span>سجلات محدثة</span>
                <strong>{{ updatedRows() }}</strong>
              </div>
              <mat-icon>update</mat-icon>
            </div>
            <span>السجلات التي تحمل علم تحديث تشغيلي.</span>
          </mat-card>
        </section>
      }

      <section class="panel">
        <div class="toolbar-row">
          <div>
            <h2 class="section-title">
              <mat-icon>published_with_changes</mat-icon>
              سجل الترحيل
            </h2>
            <p class="muted">المبالغ هنا تمثل ما تم تمريره من الفاتورة إلى القيود والسندات.</p>
          </div>
        </div>

        @if (!rows().length && !loading()) {
          <div class="empty-state">لا توجد بيانات ترحيل متاحة حاليًا.</div>
        } @else {
          <div class="table-wrap">
            <table mat-table [dataSource]="rows()" class="data-table">
              <ng-container matColumnDef="nos">
                <th mat-header-cell *matHeaderCellDef>رقم الحركة</th>
                <td mat-cell *matCellDef="let row">{{ row.nos || '-' }}</td>
              </ng-container>

              <ng-container matColumnDef="dates">
                <th mat-header-cell *matHeaderCellDef>التاريخ</th>
                <td mat-cell *matCellDef="let row">{{ row.dates || '-' }}</td>
              </ng-container>

              <ng-container matColumnDef="noa">
                <th mat-header-cell *matHeaderCellDef>المشترك</th>
                <td mat-cell *matCellDef="let row">{{ row.noa || '-' }}</td>
              </ng-container>

              <ng-container matColumnDef="totl">
                <th mat-header-cell *matHeaderCellDef>الإجمالي</th>
                <td mat-cell *matCellDef="let row" class="amount-positive">
                  {{ row.totl ?? 0 | number:'1.0-2' }}
                </td>
              </ng-container>

              <ng-container matColumnDef="sara">
                <th mat-header-cell *matHeaderCellDef>النقدي</th>
                <td mat-cell *matCellDef="let row">{{ row.sara ?? 0 | number:'1.0-2' }}</td>
              </ng-container>

              <ng-container matColumnDef="nok">
                <th mat-header-cell *matHeaderCellDef>القيد</th>
                <td mat-cell *matCellDef="let row">{{ row.nok || '-' }}</td>
              </ng-container>

              <ng-container matColumnDef="memos">
                <th mat-header-cell *matHeaderCellDef>البيان</th>
                <td mat-cell *matCellDef="let row">{{ row.memos || row.nms || '-' }}</td>
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
      .hero-actions a[mat-flat-button] {
        background: #ffd54f;
        color: #102542;
      }
    `,
  ],
})
export class ElectricityPostingComponent implements OnInit {
  displayedColumns = ['nos', 'dates', 'noa', 'totl', 'sara', 'nok', 'memos'];

  loading = signal(true);
  rows = signal<LegacyPostingRecord[]>([]);

  constructor(private workflowService: ElectricityWorkflowService) {}

  ngOnInit(): void {
    this.workflowService.getLegacyPosting(0, 30).subscribe({
      next: (response) => {
        this.rows.set(response.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  totalPosting(): number {
    return this.rows().reduce((sum, row) => sum + Number(row.totl || 0), 0);
  }

  totalCash(): number {
    return this.rows().reduce((sum, row) => sum + Number(row.sara || 0), 0);
  }

  linkedEntries(): number {
    return this.rows().filter((row) => !!row.nok || !!row.nokon).length;
  }

  updatedRows(): number {
    return this.rows().filter((row) => Number(row.upd || 0) > 0).length;
  }
}
