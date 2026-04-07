import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import {
  ElectricityInstallationRecord,
  ElectricityWorkflowService,
} from '../../../core/services/electricity-workflow.service';
import { electricityPageStyles } from '../electricity-page.styles';

@Component({
  selector: 'app-installations',
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
          <span class="hero-kicker">TRKB / تغيير عداد</span>
          <h1>التركيبات والتغييرات الميدانية</h1>
          <p>سجل الأعمال الميدانية مثل تركيب عداد، تغيير عداد، أو أي إجراء تشغيلي مرتبط بالمشترك.</p>
        </div>
        <div class="hero-side">
          <div class="metric-row">
            <span>إجمالي السجلات</span>
            <strong>{{ rows().length }}</strong>
          </div>
          <div class="metric-row">
            <span>إجمالي الكلفة</span>
            <strong>{{ totalAmount() | number:'1.0-2' }}</strong>
          </div>
          <div class="metric-row">
            <span>سجلات مرتبطة بعداد</span>
            <strong>{{ linkedMeters() }}</strong>
          </div>
        </div>
      </section>

      <section class="panel">
        @if (loading()) {
          <div class="empty-state">
            <mat-spinner diameter="40"></mat-spinner>
          </div>
        } @else if (!rows().length) {
          <div class="empty-state">لا توجد أعمال ميدانية معروضة.</div>
        } @else {
          <div class="table-wrap">
            <table mat-table [dataSource]="rows()" class="data-table">
              <ng-container matColumnDef="nos">
                <th mat-header-cell *matHeaderCellDef>الرقم</th>
                <td mat-cell *matCellDef="let row">{{ row.nos || '-' }}</td>
              </ng-container>
              <ng-container matColumnDef="dates">
                <th mat-header-cell *matHeaderCellDef>التاريخ</th>
                <td mat-cell *matCellDef="let row">{{ row.dates || '-' }}</td>
              </ng-container>
              <ng-container matColumnDef="subscriberName">
                <th mat-header-cell *matHeaderCellDef>المشترك</th>
                <td mat-cell *matCellDef="let row">{{ row.subscriberName || '-' }}</td>
              </ng-container>
              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef>الوصف</th>
                <td mat-cell *matCellDef="let row">{{ row.description || '-' }}</td>
              </ng-container>
              <ng-container matColumnDef="amount">
                <th mat-header-cell *matHeaderCellDef>المبلغ</th>
                <td mat-cell *matCellDef="let row">{{ row.amount ?? 0 | number:'1.0-2' }}</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
            </table>
          </div>
        }
      </section>
    </div>
  `,
  styles: [electricityPageStyles],
})
export class InstallationsComponent implements OnInit {
  displayedColumns = ['nos', 'dates', 'subscriberName', 'description', 'amount'];

  rows = signal<ElectricityInstallationRecord[]>([]);
  loading = signal(true);

  constructor(private workflowService: ElectricityWorkflowService) {}

  ngOnInit(): void {
    this.workflowService.getInstallations({ page: 1, pageSize: 25 }).subscribe({
      next: (response) => {
        this.rows.set(response.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  totalAmount(): number {
    return this.rows().reduce((sum, row) => sum + Number(row.amount || 0), 0);
  }

  linkedMeters(): number {
    return this.rows().filter((row) => Number(row.meterId || 0) > 0).length;
  }
}
