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
import {
  ElectricityMeterRecord,
  ElectricityWorkflowService,
} from '../../../core/services/electricity-workflow.service';
import { electricityPageStyles } from '../electricity-page.styles';

@Component({
  selector: 'app-meters',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTableModule,
  ],
  template: `
    <div class="electricity-page" dir="rtl">
      <section class="hero">
        <div class="hero-copy">
          <span class="hero-kicker">MZ</span>
          <h1>سجل العدادات</h1>
          <p>الملف المرجعي للعدادات وربطها بالمشتركين والموقع وحالة التشغيل والقراءة الحالية.</p>
          <div class="hero-actions">
            <a mat-flat-button routerLink="/electricity/readings">تسجيل قراءة</a>
            <a mat-stroked-button routerLink="/electricity/subscribers">ملف المشتركين</a>
          </div>
        </div>
        <div class="hero-side">
          <div class="metric-row">
            <span>إجمالي العدادات المعروضة</span>
            <strong>{{ meters().length }}</strong>
          </div>
          <div class="metric-row">
            <span>عدادات فعالة</span>
            <strong>{{ activeCount() }}</strong>
          </div>
          <div class="metric-row">
            <span>مرتبطة بمشترك</span>
            <strong>{{ linkedCount() }}</strong>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="toolbar-row">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>بحث</mat-label>
            <input matInput [(ngModel)]="searchTerm" (keyup.enter)="loadMeters()" placeholder="رقم العداد أو اسم المشترك" />
            <button matSuffix mat-icon-button type="button" (click)="loadMeters()">
              <mat-icon>search</mat-icon>
            </button>
          </mat-form-field>

          <button mat-button (click)="loadMeters()">تحديث</button>
        </div>

        @if (loading()) {
          <div class="empty-state">
            <mat-spinner diameter="40"></mat-spinner>
          </div>
        } @else if (!meters().length) {
          <div class="empty-state">لا توجد عدادات مطابقة.</div>
        } @else {
          <div class="table-wrap">
            <table mat-table [dataSource]="meters()" class="data-table">
              <ng-container matColumnDef="meterNumber">
                <th mat-header-cell *matHeaderCellDef>رقم العداد</th>
                <td mat-cell *matCellDef="let row">{{ row.meterNumber }}</td>
              </ng-container>
              <ng-container matColumnDef="subscriberName">
                <th mat-header-cell *matHeaderCellDef>المشترك</th>
                <td mat-cell *matCellDef="let row">{{ row.subscriberName || 'غير مرتبط' }}</td>
              </ng-container>
              <ng-container matColumnDef="location">
                <th mat-header-cell *matHeaderCellDef>الموقع</th>
                <td mat-cell *matCellDef="let row">{{ row.location || '-' }}</td>
              </ng-container>
              <ng-container matColumnDef="reading">
                <th mat-header-cell *matHeaderCellDef>القراءة</th>
                <td mat-cell *matCellDef="let row">{{ row.reading ?? 0 }}</td>
              </ng-container>
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>الحالة</th>
                <td mat-cell *matCellDef="let row">
                  <span class="status-pill" [class.warning-pill]="row.status !== 1">
                    {{ row.status === 1 ? 'فعال' : 'غير فعال' }}
                  </span>
                </td>
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
export class MetersComponent implements OnInit {
  displayedColumns = ['meterNumber', 'subscriberName', 'location', 'reading', 'status'];

  meters = signal<ElectricityMeterRecord[]>([]);
  loading = signal(true);
  searchTerm = '';

  constructor(private workflowService: ElectricityWorkflowService) {}

  ngOnInit(): void {
    this.loadMeters();
  }

  loadMeters(): void {
    this.loading.set(true);
    this.workflowService
      .getMeters({
        page: 1,
        pageSize: 25,
        search: this.searchTerm.trim() || undefined,
      })
      .subscribe({
        next: (response) => {
          this.meters.set(response.data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  activeCount(): number {
    return this.meters().filter((meter) => meter.status === 1).length;
  }

  linkedCount(): number {
    return this.meters().filter((meter) => !!meter.subscriberName).length;
  }
}
