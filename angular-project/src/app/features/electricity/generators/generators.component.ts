import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  ElectricityGeneratorRecord,
  ElectricityWorkflowService,
} from '../../../core/services/electricity-workflow.service';
import { electricityPageStyles } from '../electricity-page.styles';

@Component({
  selector: 'app-generators',
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="electricity-page" dir="rtl">
      <section class="hero">
        <div class="hero-copy">
          <span class="hero-kicker">MOLDAT / MOLDATS</span>
          <h1>المولدات وساعات التشغيل</h1>
          <p>سجل المولدات الداعمة للتشغيل مع السعة والموقع وساعات العمل واستهلاك الوقود.</p>
        </div>
        <div class="hero-side">
          <div class="metric-row">
            <span>عدد المولدات</span>
            <strong>{{ rows().length }}</strong>
          </div>
          <div class="metric-row">
            <span>إجمالي السعة</span>
            <strong>{{ totalCapacity() | number:'1.0-2' }}</strong>
          </div>
          <div class="metric-row">
            <span>ساعات التشغيل</span>
            <strong>{{ totalHours() | number:'1.0-2' }}</strong>
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
                <mat-icon>offline_bolt</mat-icon>
                {{ row.status === 1 ? 'فعال' : 'موقف' }}
              </span>
              <strong>{{ row.name }}</strong>
              <span>{{ row.location || 'بدون موقع محدد' }}</span>
              <span>السعة: {{ row.capacity || 0 | number:'1.0-2' }}</span>
              <span>الوقود: {{ row.fuelConsumption || 0 | number:'1.0-2' }}</span>
              <span>الساعات: {{ row.workingHours || 0 | number:'1.0-2' }}</span>
            </mat-card>
          }
        </section>
      }
    </div>
  `,
  styles: [electricityPageStyles],
})
export class GeneratorsComponent implements OnInit {
  rows = signal<ElectricityGeneratorRecord[]>([]);
  loading = signal(true);

  constructor(private workflowService: ElectricityWorkflowService) {}

  ngOnInit(): void {
    this.workflowService.getGenerators({ page: 1, pageSize: 24 }).subscribe({
      next: (response) => {
        this.rows.set(response.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  totalCapacity(): number {
    return this.rows().reduce((sum, row) => sum + Number(row.capacity || 0), 0);
  }

  totalHours(): number {
    return this.rows().reduce((sum, row) => sum + Number(row.workingHours || 0), 0);
  }
}
