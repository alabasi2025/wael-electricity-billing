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
  selector: 'app-electricity-readings',
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
          <span class="hero-kicker">ADDMZ / TRK</span>
          <h1>قراءات العدادات وتسوية الاستهلاك</h1>
          <p>
            هذه الشاشة تمثل مرحلة القراءة في النظام القديم: القراءة الحالية، القراءة السابقة،
            فرق القراءة، ومراجعة حالة العداد قبل الانتقال إلى الفوترة.
          </p>
          <div class="hero-actions">
            <a mat-flat-button routerLink="/electricity/meters">فتح سجل العدادات</a>
            <a mat-stroked-button routerLink="/electricity/billing">الانتقال للفوترة</a>
          </div>
        </div>

        <div class="hero-side">
          <div class="metric-row">
            <span>العداد المحدد</span>
            <strong>{{ selectedMeter()?.meterNumber || 'اختر عدادًا' }}</strong>
          </div>
          <div class="metric-row">
            <span>القراءة السابقة</span>
            <strong>{{ selectedMeter()?.prevReading ?? 0 }}</strong>
          </div>
          <div class="metric-row">
            <span>استهلاك متوقع</span>
            <strong>{{ projectedConsumption() }}</strong>
          </div>
        </div>
      </section>

      <div class="panel-grid">
        <section class="panel">
          <div class="toolbar-row">
            <div>
              <h2 class="section-title">
                <mat-icon>speed</mat-icon>
                قائمة العدادات الجاهزة للقراءة
              </h2>
              <p class="muted">ابحث باسم المشترك أو رقم العداد ثم اختر السجل لتحديث القراءة.</p>
            </div>
            <button mat-button (click)="loadMeters()">تحديث</button>
          </div>

          <mat-form-field appearance="outline" class="search-field">
            <mat-label>بحث</mat-label>
            <input
              matInput
              [(ngModel)]="searchTerm"
              placeholder="رقم العداد أو اسم المشترك"
              (keyup.enter)="loadMeters()"
            />
            <button matSuffix mat-icon-button type="button" (click)="loadMeters()">
              <mat-icon>search</mat-icon>
            </button>
          </mat-form-field>

          @if (loadingList()) {
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

                <ng-container matColumnDef="reading">
                  <th mat-header-cell *matHeaderCellDef>الحالية</th>
                  <td mat-cell *matCellDef="let row">{{ row.reading ?? 0 }}</td>
                </ng-container>

                <ng-container matColumnDef="prevReading">
                  <th mat-header-cell *matHeaderCellDef>السابقة</th>
                  <td mat-cell *matCellDef="let row">{{ row.prevReading ?? 0 }}</td>
                </ng-container>

                <ng-container matColumnDef="pick">
                  <th mat-header-cell *matHeaderCellDef></th>
                  <td mat-cell *matCellDef="let row">
                    <button mat-button color="primary" (click)="selectMeter(row.id || 0)">
                      اختيار
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr
                  mat-row
                  *matRowDef="let row; columns: displayedColumns"
                  (click)="selectMeter(row.id || 0)"
                  [class.selected-row]="selectedMeter()?.id === row.id"
                ></tr>
              </table>
            </div>
          }
        </section>

        <section class="panel">
          <div class="toolbar-row">
            <div>
              <h2 class="section-title">
                <mat-icon>edit_note</mat-icon>
                تسجيل قراءة جديدة
              </h2>
              <p class="muted">يتم حفظ القراءة الحالية كقراءة جديدة وترحيل القديمة تلقائيًا.</p>
            </div>
          </div>

          @if (loadingDetail()) {
            <div class="empty-state">
              <mat-spinner diameter="40"></mat-spinner>
            </div>
          } @else if (!selectedMeter()) {
            <div class="empty-state">اختر عدادًا من القائمة لبدء تسجيل القراءة.</div>
          } @else {
            <div class="metric-list">
              <div class="metric-row">
                <span>المشترك</span>
                <strong>{{ selectedMeter()?.subscriberName || 'غير محدد' }}</strong>
              </div>
              <div class="metric-row">
                <span>الموقع</span>
                <strong>{{ selectedMeter()?.location || 'بدون موقع' }}</strong>
              </div>
              <div class="metric-row">
                <span>آخر قراءة</span>
                <strong>{{ selectedMeter()?.reading ?? 0 }}</strong>
              </div>
              <div class="metric-row">
                <span>القراءة السابقة</span>
                <strong>{{ selectedMeter()?.prevReading ?? 0 }}</strong>
              </div>
            </div>

            <mat-form-field appearance="outline" class="search-field">
              <mat-label>القراءة الحالية الجديدة</mat-label>
              <input
                matInput
                type="number"
                min="0"
                [(ngModel)]="newReading"
                placeholder="أدخل القراءة الحالية"
              />
            </mat-form-field>

            <div class="metric-row">
              <span>فرق القراءة المتوقع</span>
              <strong>{{ projectedConsumption() }}</strong>
            </div>

            @if (feedback()) {
              <div class="note-box">{{ feedback() }}</div>
            }

            <div class="hero-actions">
              <button mat-flat-button (click)="saveReading()" [disabled]="saving() || newReading === null">
                @if (saving()) {
                  <mat-spinner diameter="20"></mat-spinner>
                } @else {
                  <span>حفظ القراءة</span>
                }
              </button>
              <a mat-stroked-button routerLink="/electricity/billing">فتح الفوترة</a>
            </div>
          }
        </section>
      </div>
    </div>
  `,
  styles: [
    electricityPageStyles,
    `
      .hero-actions button[mat-flat-button],
      .hero-actions a[mat-flat-button] {
        background: #ffd54f;
        color: #102542;
      }
    `,
  ],
})
export class ElectricityReadingsComponent implements OnInit {
  displayedColumns = ['meterNumber', 'subscriberName', 'reading', 'prevReading', 'pick'];

  meters = signal<ElectricityMeterRecord[]>([]);
  selectedMeter = signal<ElectricityMeterRecord | null>(null);
  loadingList = signal(true);
  loadingDetail = signal(false);
  saving = signal(false);
  feedback = signal('');
  searchTerm = '';
  newReading: number | null = null;

  constructor(private workflowService: ElectricityWorkflowService) {}

  ngOnInit(): void {
    this.loadMeters();
  }

  loadMeters(): void {
    this.loadingList.set(true);
    this.feedback.set('');

    this.workflowService
      .getMeters({
        page: 1,
        pageSize: 20,
        search: this.searchTerm.trim() || undefined,
      })
      .subscribe({
        next: (response) => {
          this.meters.set(response.data);
          this.loadingList.set(false);

          const current = this.selectedMeter();
          if (response.data.length && !current) {
            this.selectMeter(response.data[0].id || 0);
          }
        },
        error: () => this.loadingList.set(false),
      });
  }

  selectMeter(id: number): void {
    if (!id) {
      return;
    }

    this.loadingDetail.set(true);
    this.feedback.set('');

    this.workflowService.getMeter(id).subscribe({
      next: (response) => {
        this.selectedMeter.set(response.data);
        this.newReading = response.data.reading ?? null;
        this.loadingDetail.set(false);
      },
      error: () => this.loadingDetail.set(false),
    });
  }

  projectedConsumption(): number {
    const selected = this.selectedMeter();
    if (!selected || this.newReading === null || this.newReading === undefined) {
      return 0;
    }

    return Number(this.newReading) - Number(selected.reading ?? 0);
  }

  saveReading(): void {
    const selected = this.selectedMeter();
    if (!selected?.id || this.newReading === null) {
      return;
    }

    this.saving.set(true);
    this.feedback.set('');

    this.workflowService.recordReading(selected.id, Number(this.newReading)).subscribe({
      next: (response) => {
        this.selectedMeter.set({
          ...selected,
          ...response.data,
        });
        this.feedback.set(response.message || 'تم حفظ القراءة الجديدة.');
        this.saving.set(false);
        this.loadMeters();
      },
      error: () => {
        this.feedback.set('تعذر حفظ القراءة الجديدة في الوقت الحالي.');
        this.saving.set(false);
      },
    });
  }
}
