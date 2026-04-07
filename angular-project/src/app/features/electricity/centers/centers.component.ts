import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Center } from '../../../core/models';
import { ElectricityWorkflowService } from '../../../core/services/electricity-workflow.service';
import { electricityPageStyles } from '../electricity-page.styles';

@Component({
  selector: 'app-centers',
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="electricity-page" dir="rtl">
      <section class="hero">
        <div class="hero-copy">
          <span class="hero-kicker">MRCZE</span>
          <h1>المراكز والمناطق التشغيلية</h1>
          <p>المراكز هي نقاط التنظيم الجغرافي والتشغيلي التي تتوزع عليها أعمال القراءة والتحصيل.</p>
        </div>
        <div class="hero-side">
          <div class="metric-row">
            <span>إجمالي المراكز</span>
            <strong>{{ rows().length }}</strong>
          </div>
          <div class="metric-row">
            <span>مراكز فعالة</span>
            <strong>{{ activeCount() }}</strong>
          </div>
          <div class="metric-row">
            <span>أنواع معرّفة</span>
            <strong>{{ typedCount() }}</strong>
          </div>
        </div>
      </section>

      @if (loading()) {
        <section class="panel empty-state">
          <mat-spinner diameter="40"></mat-spinner>
        </section>
      } @else {
        <section class="workflow-grid">
          @for (row of rows(); track row.id) {
            <mat-card class="workflow-card">
              <span class="legacy-tag">
                <mat-icon>location_city</mat-icon>
                {{ row.type || 'مركز عام' }}
              </span>
              <strong>{{ row.name }}</strong>
              <span>{{ row.location || 'بدون موقع محدد' }}</span>
              <span class="status-pill" [class.warning-pill]="row.status !== 1">
                {{ row.status === 1 ? 'فعال' : 'غير فعال' }}
              </span>
            </mat-card>
          }
        </section>
      }
    </div>
  `,
  styles: [electricityPageStyles],
})
export class CentersComponent implements OnInit {
  rows = signal<Center[]>([]);
  loading = signal(true);

  constructor(private workflowService: ElectricityWorkflowService) {}

  ngOnInit(): void {
    this.workflowService.getCenters().subscribe({
      next: (response) => {
        this.rows.set(response.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  activeCount(): number {
    return this.rows().filter((row) => row.status === 1).length;
  }

  typedCount(): number {
    return this.rows().filter((row) => !!row.type).length;
  }
}
