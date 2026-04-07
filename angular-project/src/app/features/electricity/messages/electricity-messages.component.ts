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
  LegacyMessageRecord,
} from '../../../core/services/electricity-workflow.service';
import { electricityPageStyles } from '../electricity-page.styles';

@Component({
  selector: 'app-electricity-messages',
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
          <span class="hero-kicker">REPMSM / MSM</span>
          <h1>الرسائل والمتابعة الميدانية</h1>
          <p>
            تعرض هذه الصفحة المشتركين الذين تُستخدم معهم رسائل التذكير، أرصدتهم،
            أرقام الهواتف، ونوع قناة الإشعار كما كانت تُدار في النظام القديم.
          </p>
          <div class="hero-actions">
            <a mat-flat-button routerLink="/electricity/collections">العودة إلى السداد</a>
            <a mat-stroked-button routerLink="/electricity/reports">فتح تقارير الكهرباء</a>
          </div>
        </div>

        <div class="hero-side">
          <div class="metric-row">
            <span>سجلات المتابعة</span>
            <strong>{{ rows().length }}</strong>
          </div>
          <div class="metric-row">
            <span>سجلات بهاتف</span>
            <strong>{{ withPhoneCount() }}</strong>
          </div>
          <div class="metric-row">
            <span>إجمالي الذمم</span>
            <strong>{{ totalBalance() | number:'1.0-2' }}</strong>
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
                <span>رسائل صريحة</span>
                <strong>{{ customMessageCount() }}</strong>
              </div>
              <mat-icon>sms</mat-icon>
            </div>
            <span>عدد السجلات التي تحتوي على نص متابعة.</span>
          </mat-card>

          <mat-card class="stat-card">
            <div class="stat-head">
              <div>
                <span>قنوات معرّفة</span>
                <strong>{{ typedChannelCount() }}</strong>
              </div>
              <mat-icon>alternate_email</mat-icon>
            </div>
            <span>السجلات التي تحتوي على توصيف قناة أو نوع إشعار.</span>
          </mat-card>
        </section>
      }

      <section class="panel">
        <div class="toolbar-row">
          <div>
            <h2 class="section-title">
              <mat-icon>contact_phone</mat-icon>
              قائمة المتابعة
            </h2>
            <p class="muted">القائمة مأخوذة من جدول المتابعة المرتبط بالمديونية والرسائل في النظام القديم.</p>
          </div>
        </div>

        @if (!rows().length && !loading()) {
          <div class="empty-state">لا توجد بيانات رسائل للعرض.</div>
        } @else {
          <div class="table-wrap">
            <table mat-table [dataSource]="rows()" class="data-table">
              <ng-container matColumnDef="noa">
                <th mat-header-cell *matHeaderCellDef>رقم المشترك</th>
                <td mat-cell *matCellDef="let row">{{ row.noa || '-' }}</td>
              </ng-container>

              <ng-container matColumnDef="namea">
                <th mat-header-cell *matHeaderCellDef>الاسم</th>
                <td mat-cell *matCellDef="let row">{{ row.namea || '-' }}</td>
              </ng-container>

              <ng-container matColumnDef="rsd">
                <th mat-header-cell *matHeaderCellDef>الرصيد</th>
                <td mat-cell *matCellDef="let row" [class.amount-negative]="(row.rsd || 0) > 0">
                  {{ row.rsd ?? 0 }}
                </td>
              </ng-container>

              <ng-container matColumnDef="notms">
                <th mat-header-cell *matHeaderCellDef>الهاتف</th>
                <td mat-cell *matCellDef="let row">{{ row.notms || '-' }}</td>
              </ng-container>

              <ng-container matColumnDef="typc">
                <th mat-header-cell *matHeaderCellDef>القناة</th>
                <td mat-cell *matCellDef="let row">{{ row.typc || '-' }}</td>
              </ng-container>

              <ng-container matColumnDef="mem">
                <th mat-header-cell *matHeaderCellDef>نص المتابعة</th>
                <td mat-cell *matCellDef="let row">{{ row.mem || '-' }}</td>
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
export class ElectricityMessagesComponent implements OnInit {
  displayedColumns = ['noa', 'namea', 'rsd', 'notms', 'typc', 'mem'];

  loading = signal(true);
  rows = signal<LegacyMessageRecord[]>([]);

  constructor(private workflowService: ElectricityWorkflowService) {}

  ngOnInit(): void {
    this.workflowService.getLegacyMessages(0, 30).subscribe({
      next: (response) => {
        this.rows.set(response.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  withPhoneCount(): number {
    return this.rows().filter((row) => Number(row.notms || 0) > 0).length;
  }

  totalBalance(): number {
    return this.rows().reduce((sum, row) => sum + Number(row.rsd || 0), 0);
  }

  customMessageCount(): number {
    return this.rows().filter((row) => !!row.mem).length;
  }

  typedChannelCount(): number {
    return this.rows().filter((row) => !!row.typc).length;
  }
}
