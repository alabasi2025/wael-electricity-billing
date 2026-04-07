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
  LegacyCollectionRecord,
} from '../../../core/services/electricity-workflow.service';
import { electricityPageStyles } from '../electricity-page.styles';

@Component({
  selector: 'app-electricity-collections',
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
          <span class="hero-kicker">SNDK / SNDKF</span>
          <h1>التحصيل والسداد المرتبط بالفاتورة</h1>
          <p>
            هذه الشاشة تعرض سندات القبض الفعلية المسترجعة من النظام القديم مع تفاصيل
            السداد التابعة لها، بحيث يظهر الصندوق أو الحساب الرئيسي مع عدد التفاصيل
            وأول مشترك داخل السند.
          </p>
          <div class="hero-actions">
            <a mat-flat-button routerLink="/electricity/posting">الرجوع للترحيل</a>
            <a mat-stroked-button routerLink="/electricity/messages">فتح الرسائل والمتابعة</a>
          </div>
        </div>

        <div class="hero-side">
          <div class="metric-row">
            <span>عدد السندات</span>
            <strong>{{ rows().length }}</strong>
          </div>
          <div class="metric-row">
            <span>إجمالي المقبوض</span>
            <strong>{{ totalCollected() | number:'1.0-2' }}</strong>
          </div>
          <div class="metric-row">
            <span>إجمالي التسوية</span>
            <strong>{{ totalSettled() | number:'1.0-2' }}</strong>
          </div>
          <div class="metric-row">
            <span>عدد التفاصيل</span>
            <strong>{{ totalDetails() }}</strong>
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
                <span>سندات لها بيان</span>
                <strong>{{ describedCount() }}</strong>
              </div>
              <mat-icon>description</mat-icon>
            </div>
            <span>السندات التي تحتوي على بيان أو ملاحظة.</span>
          </mat-card>

          <mat-card class="stat-card">
            <div class="stat-head">
              <div>
                <span>سندات مرحّلة</span>
                <strong>{{ postedCount() }}</strong>
              </div>
              <mat-icon>tag</mat-icon>
            </div>
            <span>السندات التي تحمل علم ترحيل أو اعتماد تشغيلي.</span>
          </mat-card>
        </section>
      }

      <section class="panel">
        <div class="toolbar-row">
          <div>
            <h2 class="section-title">
              <mat-icon>payments</mat-icon>
              سندات السداد
            </h2>
            <p class="muted">هذه البيانات تُقرأ الآن من جداول SNDK و SNDKF المسترجعة من النسخة القديمة.</p>
          </div>
        </div>

        @if (!rows().length && !loading()) {
          <div class="empty-state">لا توجد سندات سداد معروضة.</div>
        } @else {
          <div class="table-wrap">
            <table mat-table [dataSource]="rows()" class="data-table">
              <ng-container matColumnDef="nos">
                <th mat-header-cell *matHeaderCellDef>رقم السند</th>
                <td mat-cell *matCellDef="let row">{{ row.nos || '-' }}</td>
              </ng-container>

              <ng-container matColumnDef="dates">
                <th mat-header-cell *matHeaderCellDef>التاريخ</th>
                <td mat-cell *matCellDef="let row">{{ row.dates || '-' }}</td>
              </ng-container>

              <ng-container matColumnDef="noa">
                <th mat-header-cell *matHeaderCellDef>الحساب الرئيسي</th>
                <td mat-cell *matCellDef="let row">
                  <div>{{ row.namea || '-' }}</div>
                  <small class="muted">رقم {{ row.noa || '-' }}</small>
                </td>
              </ng-container>

              <ng-container matColumnDef="total">
                <th mat-header-cell *matHeaderCellDef>الإجمالي</th>
                <td mat-cell *matCellDef="let row" class="amount-positive">
                  {{ row.total ?? 0 | number:'1.0-2' }}
                </td>
              </ng-container>

              <ng-container matColumnDef="detailCount">
                <th mat-header-cell *matHeaderCellDef>عدد التفاصيل</th>
                <td mat-cell *matCellDef="let row">{{ row.detailCount ?? 0 }}</td>
              </ng-container>

              <ng-container matColumnDef="sampleSubscriber">
                <th mat-header-cell *matHeaderCellDef>أول مشترك</th>
                <td mat-cell *matCellDef="let row">{{ row.sampleSubscriber || row.nms || '-' }}</td>
              </ng-container>

              <ng-container matColumnDef="memo">
                <th mat-header-cell *matHeaderCellDef>البيان</th>
                <td mat-cell *matCellDef="let row">{{ row.memo || row.nms || '-' }}</td>
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
export class ElectricityCollectionsComponent implements OnInit {
  displayedColumns = ['nos', 'dates', 'noa', 'total', 'detailCount', 'sampleSubscriber', 'memo'];

  loading = signal(true);
  rows = signal<LegacyCollectionRecord[]>([]);

  constructor(private workflowService: ElectricityWorkflowService) {}

  ngOnInit(): void {
    this.workflowService.getLegacyCollections(0, 30).subscribe({
      next: (response) => {
        this.rows.set(response.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  totalCollected(): number {
    return this.rows().reduce((sum, row) => sum + Number(row.total || 0), 0);
  }

  totalSettled(): number {
    return this.rows().reduce((sum, row) => sum + Number(row.totalm || 0), 0);
  }

  totalDetails(): number {
    return this.rows().reduce((sum, row) => sum + Number(row.detailCount || 0), 0);
  }

  describedCount(): number {
    return this.rows().filter((row) => !!row.memo || !!row.nms).length;
  }

  postedCount(): number {
    return this.rows().filter((row) => Number(row.ts || 0) > 0).length;
  }
}
