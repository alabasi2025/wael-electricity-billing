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
  ElectricitySubscriberProfile,
  ElectricityWorkflowService,
} from '../../../core/services/electricity-workflow.service';
import { electricityPageStyles } from '../electricity-page.styles';

@Component({
  selector: 'app-subscribers',
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
          <span class="hero-kicker">TEL / ملف المشترك</span>
          <h1>بيانات المشتركين الكهربائية</h1>
          <p>
            هذه الشاشة تمثل ملف المشترك الكهربائي كما كان يبدأ منه النظام القديم:
            بيانات الحساب، المحلة، الهاتف، والانتقال السريع إلى القراءة والفوترة والسداد.
          </p>
          <div class="hero-actions">
            <a mat-flat-button routerLink="/electricity/readings">الذهاب للقراءات</a>
            <a mat-stroked-button routerLink="/electricity/billing">الذهاب للفوترة</a>
          </div>
        </div>

        <div class="hero-side">
          <div class="metric-row">
            <span>عدد المشتركين</span>
            <strong>{{ totalCount() }}</strong>
          </div>
          <div class="metric-row">
            <span>المشترك المحدد</span>
            <strong>{{ selectedSubscriber()?.namea || 'لا يوجد' }}</strong>
          </div>
          <div class="metric-row">
            <span>المجموعة الحسابية</span>
            <strong>{{ selectedSubscriber()?.parentAccount?.nameA || 'غير مرتبطة' }}</strong>
          </div>
        </div>
      </section>

      <div class="panel-grid">
        <section class="panel">
          <div class="toolbar-row">
            <div>
              <h2 class="section-title">
                <mat-icon>people</mat-icon>
                قائمة المشتركين
              </h2>
              <p class="muted">المصدر الحالي: accounts/sub مع فلتر typea = 2.</p>
            </div>
            <button mat-button (click)="loadSubscribers()">تحديث</button>
          </div>

          <mat-form-field appearance="outline" class="search-field">
            <mat-label>بحث برقم أو اسم المشترك</mat-label>
            <input
              matInput
              [(ngModel)]="searchTerm"
              placeholder="مثال: 1201 أو اسم المشترك"
              (keyup.enter)="loadSubscribers()"
            />
            <button matSuffix mat-icon-button type="button" (click)="loadSubscribers()">
              <mat-icon>search</mat-icon>
            </button>
          </mat-form-field>

          @if (loadingList()) {
            <div class="empty-state">
              <mat-spinner diameter="40"></mat-spinner>
            </div>
          } @else if (!subscribers().length) {
            <div class="empty-state">لا توجد حسابات كهرباء مطابقة.</div>
          } @else {
            <div class="table-wrap">
              <table mat-table [dataSource]="subscribers()" class="data-table">
                <ng-container matColumnDef="noa">
                  <th mat-header-cell *matHeaderCellDef>الرقم الداخلي</th>
                  <td mat-cell *matCellDef="let row">{{ row.noa }}</td>
                </ng-container>

                <ng-container matColumnDef="noan">
                  <th mat-header-cell *matHeaderCellDef>رقم المشترك</th>
                  <td mat-cell *matCellDef="let row">{{ row.noan || '-' }}</td>
                </ng-container>

                <ng-container matColumnDef="namea">
                  <th mat-header-cell *matHeaderCellDef>الاسم</th>
                  <td mat-cell *matCellDef="let row">{{ row.namea }}</td>
                </ng-container>

                <ng-container matColumnDef="typea">
                  <th mat-header-cell *matHeaderCellDef>الحساب الأب</th>
                  <td mat-cell *matCellDef="let row">{{ row.parentAccount?.nameA || row.typea }}</td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr
                  mat-row
                  *matRowDef="let row; columns: displayedColumns"
                  (click)="selectSubscriber(row.noa)"
                  [class.selected-row]="selectedSubscriber()?.noa === row.noa"
                ></tr>
              </table>
            </div>
          }
        </section>

        <section class="panel">
          <div class="toolbar-row">
            <div>
              <h2 class="section-title">
                <mat-icon>badge</mat-icon>
                ملف المشترك
              </h2>
              <p class="muted">تفاصيل الحساب المحدد وربطه التشغيلي في الدورة الكهربائية.</p>
            </div>
          </div>

          @if (loadingDetail()) {
            <div class="empty-state">
              <mat-spinner diameter="40"></mat-spinner>
            </div>
          } @else if (!selectedSubscriber()) {
            <div class="empty-state">اختر مشتركًا من القائمة لعرض ملفه الكامل.</div>
          } @else {
            <div class="metric-list">
              <div class="metric-row">
                <span>رقم الحساب</span>
                <strong>{{ selectedSubscriber()?.noa }}</strong>
              </div>
              <div class="metric-row">
                <span>رقم المشترك الظاهر</span>
                <strong>{{ selectedSubscriber()?.noan || '-' }}</strong>
              </div>
              <div class="metric-row">
                <span>اسم المشترك</span>
                <strong>{{ selectedSubscriber()?.namea }}</strong>
              </div>
              <div class="metric-row">
                <span>المحلة / العنوان</span>
                <strong>{{ detail()?.mhlt || 'غير مسجل' }}</strong>
              </div>
              <div class="metric-row">
                <span>الهاتف</span>
                <strong>{{ detail()?.tel || 'غير مسجل' }}</strong>
              </div>
              <div class="metric-row">
                <span>ملاحظات</span>
                <strong>{{ detail()?.notes || 'لا توجد ملاحظات' }}</strong>
              </div>
              <div class="metric-row">
                <span>الحساب الأب</span>
                <strong>{{ selectedSubscriber()?.parentAccount?.nameA || '-' }}</strong>
              </div>
              <div class="metric-row">
                <span>العمولة / الكلفة</span>
                <strong>{{ selectedSubscriber()?.amlhh ?? 0 }}</strong>
              </div>
            </div>

            <div class="action-grid" style="margin-top: 16px;">
              <a class="action-tile" routerLink="/electricity/readings">
                <mat-icon>speed</mat-icon>
                <strong>قراءة العداد</strong>
                <span>الانتقال مباشرة إلى شاشة القراءة.</span>
              </a>

              <a class="action-tile" routerLink="/electricity/billing">
                <mat-icon>receipt_long</mat-icon>
                <strong>فوترة المشترك</strong>
                <span>فتح شاشة الفوترة الشهرية.</span>
              </a>

              <a class="action-tile" routerLink="/electricity/collections">
                <mat-icon>payments</mat-icon>
                <strong>تحصيل وسداد</strong>
                <span>متابعة السداد والرصيد.</span>
              </a>
            </div>
          }
        </section>
      </div>
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
export class SubscribersComponent implements OnInit {
  displayedColumns = ['noa', 'noan', 'namea', 'typea'];

  subscribers = signal<ElectricitySubscriberProfile[]>([]);
  selectedSubscriber = signal<ElectricitySubscriberProfile | null>(null);
  totalCount = signal(0);
  loadingList = signal(true);
  loadingDetail = signal(false);
  searchTerm = '';

  constructor(private workflowService: ElectricityWorkflowService) {}

  ngOnInit(): void {
    this.loadSubscribers();
  }

  loadSubscribers(): void {
    this.loadingList.set(true);

    this.workflowService
      .getSubscribers({
        page: 1,
        pageSize: 18,
        search: this.searchTerm.trim() || undefined,
      })
      .subscribe({
        next: (response) => {
          this.subscribers.set(response.data);
          this.totalCount.set(response.totalCount || response.data.length);
          this.loadingList.set(false);

          if (response.data.length && !this.selectedSubscriber()) {
            this.selectSubscriber(response.data[0].noa);
          }
        },
        error: () => this.loadingList.set(false),
      });
  }

  selectSubscriber(noa: number): void {
    this.loadingDetail.set(true);
    this.workflowService.getSubscriberProfile(noa).subscribe({
      next: (response) => {
        this.selectedSubscriber.set(response.data);
        this.loadingDetail.set(false);
      },
      error: () => this.loadingDetail.set(false),
    });
  }

  detail() {
    return this.selectedSubscriber()?.details?.[0];
  }
}
