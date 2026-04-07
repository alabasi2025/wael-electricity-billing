import { Component, OnInit, signal, computed } from '@angular/core';
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
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ElectricityWorkflowService, ElectricitySubscriber } from '../../../core/services/electricity-workflow.service';
import { electricityPageStyles } from '../electricity-page.styles';

@Component({
  selector: 'app-subscribers',
  imports: [
    CommonModule, FormsModule, RouterModule,
    MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule,
    MatInputModule, MatProgressSpinnerModule, MatTableModule, MatPaginatorModule,
    MatSelectModule, MatChipsModule, MatDialogModule, MatSnackBarModule,
    MatTabsModule, MatBadgeModule, MatTooltipModule,
  ],
  template: `
    <div class="electricity-page" dir="rtl">
      <!-- ═══ الترويسة ═══ -->
      <section class="hero">
        <div class="hero-copy">
          <span class="hero-kicker">TEL + DATA_AM / ملف المشترك الكهربائي الكامل</span>
          <h1>إدارة المشتركين</h1>
          <p>ملف المشترك الكهربائي الكامل بـ 48 حقل - بديل شاشة tel القديمة مع كل التفاصيل: البيانات الأساسية، العداد، الفوترة، المجموعة، الرسائل.</p>
          <div class="hero-actions">
            <button mat-flat-button (click)="showForm = true; editMode = false; resetForm()"><mat-icon>add</mat-icon> مشترك جديد</button>
            <a mat-stroked-button routerLink="/electricity/readings"><mat-icon>speed</mat-icon> القراءات</a>
            <a mat-stroked-button routerLink="/electricity/billing"><mat-icon>receipt</mat-icon> الفوترة</a>
          </div>
        </div>
        <div class="hero-side">
          <div class="metric-row"><span>إجمالي المشتركين</span><strong>{{ stats()?.total || 0 }}</strong></div>
          <div class="metric-row"><span>نشط</span><strong style="color:#4caf50">{{ stats()?.active || 0 }}</strong></div>
          <div class="metric-row"><span>مفصول</span><strong style="color:#f44336">{{ stats()?.disconnected || 0 }}</strong></div>
          <div class="metric-row"><span>إجمالي المديونية</span><strong style="color:#ff9800">{{ (stats()?.totalDebt || 0) | number }}</strong></div>
          <div class="metric-row"><span>مشتركين SMS</span><strong>{{ stats()?.withSms || 0 }}</strong></div>
        </div>
      </section>

      <!-- ═══ فلاتر البحث المتقدم ═══ -->
      <mat-card class="filter-card">
        <div class="filters-row">
          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>بحث (اسم / رقم / هاتف / عداد)</mat-label>
            <input matInput [(ngModel)]="searchTerm" (keyup.enter)="loadSubscribers()" placeholder="ابحث...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline" class="filter-field-sm">
            <mat-label>فئة الفوترة</mat-label>
            <mat-select [(ngModel)]="filterCategory" (selectionChange)="loadSubscribers()">
              <mat-option value="">الكل</mat-option>
              <mat-option value="ampere">أمبير</mat-option>
              <mat-option value="kilo">كيلو</mat-option>
              <mat-option value="special">خاص</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" class="filter-field-sm">
            <mat-label>الحالة</mat-label>
            <mat-select [(ngModel)]="filterStatus" (selectionChange)="loadSubscribers()">
              <mat-option [value]="undefined">الكل</mat-option>
              <mat-option [value]="1">نشط</mat-option>
              <mat-option [value]="0">غير نشط</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" class="filter-field-sm">
            <mat-label>الفصل</mat-label>
            <mat-select [(ngModel)]="filterDisconnect" (selectionChange)="loadSubscribers()">
              <mat-option [value]="undefined">الكل</mat-option>
              <mat-option [value]="0">موصول</mat-option>
              <mat-option [value]="1">مفصول</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-icon-button (click)="loadSubscribers()" matTooltip="تحديث"><mat-icon>refresh</mat-icon></button>
        </div>
      </mat-card>

      <!-- ═══ جدول المشتركين ═══ -->
      <mat-card *ngIf="!showForm">
        <div style="overflow-x:auto">
          <table mat-table [dataSource]="subscribers()" class="full-width-table">
            <ng-container matColumnDef="noa"><th mat-header-cell *matHeaderCellDef>رقم</th><td mat-cell *matCellDef="let r">{{r.noa}}</td></ng-container>
            <ng-container matColumnDef="namea"><th mat-header-cell *matHeaderCellDef>الاسم</th><td mat-cell *matCellDef="let r">{{r.namea}}</td></ng-container>
            <ng-container matColumnDef="mobile"><th mat-header-cell *matHeaderCellDef>الهاتف</th><td mat-cell *matCellDef="let r">{{r.mobile || r.tel || '-'}}</td></ng-container>
            <ng-container matColumnDef="meterNo"><th mat-header-cell *matHeaderCellDef>العداد</th><td mat-cell *matCellDef="let r">{{r.meterNo || '-'}}</td></ng-container>
            <ng-container matColumnDef="billingCategory"><th mat-header-cell *matHeaderCellDef>الفئة</th><td mat-cell *matCellDef="let r"><span class="chip" [class]="r.billingCategory">{{r.billingCategory === 'ampere' ? 'أمبير' : r.billingCategory === 'kilo' ? 'كيلو' : 'خاص'}}</span></td></ng-container>
            <ng-container matColumnDef="balance"><th mat-header-cell *matHeaderCellDef>الرصيد</th><td mat-cell *matCellDef="let r" [style.color]="r.balance > 0 ? '#f44336' : '#4caf50'">{{r.balance | number}}</td></ng-container>
            <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>الحالة</th><td mat-cell *matCellDef="let r">
              <mat-icon [style.color]="r.disconnectFlag ? '#f44336' : '#4caf50'">{{r.disconnectFlag ? 'power_off' : 'power'}}</mat-icon>
            </td></ng-container>
            <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>إجراءات</th><td mat-cell *matCellDef="let r">
              <button mat-icon-button matTooltip="تعديل" (click)="editSubscriber(r)"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button matTooltip="كشف حساب" (click)="viewStatement(r.noa)"><mat-icon>receipt_long</mat-icon></button>
              <button mat-icon-button [matTooltip]="r.disconnectFlag ? 'إعادة توصيل' : 'فصل'" (click)="toggleDisconnect(r.noa)">
                <mat-icon [style.color]="r.disconnectFlag ? '#4caf50' : '#f44336'">{{r.disconnectFlag ? 'power' : 'power_off'}}</mat-icon>
              </button>
            </td></ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" (click)="selectSubscriber(row)" [class.selected]="selectedSub()?.noa === row.noa"></tr>
          </table>
        </div>
        <div class="pagination-row">
          <span>الصفحة {{currentPage}} من {{totalPages()}} ({{totalCount()}} مشترك)</span>
          <button mat-icon-button [disabled]="currentPage <= 1" (click)="currentPage = currentPage - 1; loadSubscribers()"><mat-icon>chevron_right</mat-icon></button>
          <button mat-icon-button [disabled]="currentPage >= totalPages()" (click)="currentPage = currentPage + 1; loadSubscribers()"><mat-icon>chevron_left</mat-icon></button>
        </div>
      </mat-card>

      <!-- ═══ ملف المشترك (48 حقل) ═══ -->
      <mat-card *ngIf="showForm" class="form-card">
        <h2>{{editMode ? 'تعديل مشترك #' + form.noa : 'مشترك جديد'}}</h2>
        <mat-tab-group>
          <!-- تبويب 1: البيانات الأساسية -->
          <mat-tab label="البيانات الأساسية">
            <div class="form-grid">
              <mat-form-field appearance="outline"><mat-label>رقم المشترك</mat-label><input matInput type="number" [(ngModel)]="form.noa" [disabled]="editMode"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>الرقم البديل</mat-label><input matInput type="number" [(ngModel)]="form.noan"></mat-form-field>
              <mat-form-field appearance="outline" class="span-2"><mat-label>اسم المشترك</mat-label><input matInput [(ngModel)]="form.namea" required></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>اسم الضامن</mat-label><input matInput [(ngModel)]="form.namegar"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>الهاتف</mat-label><input matInput [(ngModel)]="form.mobile"></mat-form-field>
              <mat-form-field appearance="outline" class="span-2"><mat-label>العنوان</mat-label><input matInput [(ngModel)]="form.addressText"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>وصف إضافي</mat-label><input matInput [(ngModel)]="form.qm"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>نوع المشترك</mat-label><input matInput type="number" [(ngModel)]="form.subscriberType"></mat-form-field>
            </div>
          </mat-tab>

          <!-- تبويب 2: العداد -->
          <mat-tab label="العداد">
            <div class="form-grid">
              <mat-form-field appearance="outline"><mat-label>رقم العداد</mat-label><input matInput [(ngModel)]="form.meterNo"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>نوع العداد</mat-label>
                <mat-select [(ngModel)]="form.meterType"><mat-option [value]="1">عادي</mat-option><mat-option [value]="2">ثلاثي</mat-option></mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline"><mat-label>كتالوج العداد</mat-label><input matInput [(ngModel)]="form.meterCatalog"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>عداد إضافي</mat-label><input matInput [(ngModel)]="form.meterExtra"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>سنة التركيب</mat-label><input matInput type="number" [(ngModel)]="form.installationYear"></mat-form-field>
            </div>
          </mat-tab>

          <!-- تبويب 3: الفوترة والتسعير -->
          <mat-tab label="الفوترة">
            <div class="form-grid">
              <mat-form-field appearance="outline"><mat-label>فئة الفوترة</mat-label>
                <mat-select [(ngModel)]="form.billingCategory"><mat-option value="ampere">أمبير</mat-option><mat-option value="kilo">كيلو</mat-option><mat-option value="special">خاص</mat-option></mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline"><mat-label>سعر الوحدة</mat-label><input matInput type="number" [(ngModel)]="form.unitPrice"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>سعر الفرق</mat-label><input matInput type="number" [(ngModel)]="form.diffPrice"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>الرسم الشهري</mat-label><input matInput type="number" [(ngModel)]="form.monthlyFee"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>الحد الأدنى</mat-label><input matInput type="number" [(ngModel)]="form.minAmount"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>دفع مسبق</mat-label>
                <mat-select [(ngModel)]="form.prepaidFlag"><mat-option [value]="false">لا</mat-option><mat-option [value]="true">نعم</mat-option></mat-select>
              </mat-form-field>
            </div>
          </mat-tab>

          <!-- تبويب 4: المجموعة والمحصل -->
          <mat-tab label="المجموعة">
            <div class="form-grid">
              <mat-form-field appearance="outline"><mat-label>رقم المجموعة</mat-label><input matInput type="number" [(ngModel)]="form.groupId"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>رقم المحصل</mat-label><input matInput type="number" [(ngModel)]="form.collectorId"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>المركز</mat-label><input matInput type="number" [(ngModel)]="form.centerId"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>المنطقة</mat-label><input matInput type="number" [(ngModel)]="form.areaId"></mat-form-field>
            </div>
          </mat-tab>

          <!-- تبويب 5: الرسائل والحالة -->
          <mat-tab label="الرسائل والحالة">
            <div class="form-grid">
              <mat-form-field appearance="outline"><mat-label>SMS</mat-label>
                <mat-select [(ngModel)]="form.smsEnabled"><mat-option [value]="false">معطل</mat-option><mat-option [value]="true">مفعل</mat-option></mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline"><mat-label>نوع SMS</mat-label><input matInput type="number" [(ngModel)]="form.smsType"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>الحالة</mat-label>
                <mat-select [(ngModel)]="form.status"><mat-option [value]="1">نشط</mat-option><mat-option [value]="0">غير نشط</mat-option></mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline"><mat-label>الفصل</mat-label>
                <mat-select [(ngModel)]="form.disconnectFlag"><mat-option [value]="0">موصول</mat-option><mat-option [value]="1">مفصول</mat-option></mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline" class="span-2"><mat-label>ملاحظات</mat-label><textarea matInput [(ngModel)]="form.notes" rows="3"></textarea></mat-form-field>
            </div>
          </mat-tab>
        </mat-tab-group>
        <div class="form-actions">
          <button mat-flat-button color="primary" (click)="saveSubscriber()"><mat-icon>save</mat-icon> {{editMode ? 'تحديث' : 'حفظ'}}</button>
          <button mat-stroked-button (click)="showForm = false"><mat-icon>close</mat-icon> إلغاء</button>
        </div>
      </mat-card>

      <!-- ═══ تفاصيل المشترك المحدد ═══ -->
      <mat-card *ngIf="selectedSub() && !showForm" class="detail-card">
        <h3><mat-icon>person</mat-icon> {{selectedSub()?.namea}} ({{selectedSub()?.noa}})</h3>
        <div class="detail-grid">
          <div><strong>الهاتف:</strong> {{selectedSub()?.mobile || '-'}}</div>
          <div><strong>العنوان:</strong> {{selectedSub()?.addressText || '-'}}</div>
          <div><strong>العداد:</strong> {{selectedSub()?.meterNo || '-'}}</div>
          <div><strong>الفئة:</strong> {{selectedSub()?.billingCategory}}</div>
          <div><strong>سعر الوحدة:</strong> {{selectedSub()?.unitPrice}}</div>
          <div><strong>الرصيد:</strong> <span [style.color]="(selectedSub()?.balance || 0) > 0 ? '#f44336' : '#4caf50'">{{selectedSub()?.balance | number}}</span></div>
          <div><strong>المجموعة:</strong> {{selectedSub()?.groupId || '-'}}</div>
          <div><strong>SMS:</strong> {{selectedSub()?.smsEnabled ? '✅' : '❌'}}</div>
        </div>
      </mat-card>

      <mat-spinner *ngIf="loading()" diameter="40" style="margin:2rem auto"></mat-spinner>
    </div>
  `,
  styles: [electricityPageStyles, `
    .filter-card { margin: 1rem 0; padding: 1rem; }
    .filters-row { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
    .filter-field { flex: 1; min-width: 200px; }
    .filter-field-sm { min-width: 140px; }
    .form-card { padding: 1.5rem; }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.75rem; padding: 1rem 0; }
    .span-2 { grid-column: span 2; }
    .form-actions { display: flex; gap: 1rem; padding-top: 1rem; border-top: 1px solid #e0e0e0; }
    .detail-card { margin-top: 1rem; padding: 1.5rem; background: #f8f9fa; }
    .detail-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.5rem; }
    .pagination-row { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem; }
    .chip { padding: 2px 10px; border-radius: 12px; font-size: 12px; }
    .chip.ampere { background: #e3f2fd; color: #1565c0; }
    .chip.kilo { background: #fff3e0; color: #e65100; }
    .chip.special { background: #f3e5f5; color: #7b1fa2; }
    .selected { background: #e3f2fd !important; }
    .full-width-table { width: 100%; }
  `],
})
export class SubscribersComponent implements OnInit {
  subscribers = signal<ElectricitySubscriber[]>([]);
  selectedSub = signal<ElectricitySubscriber | null>(null);
  stats = signal<any>(null);
  loading = signal(false);
  totalCount = signal(0);
  totalPages = signal(1);
  currentPage = 1;
  pageSize = 30;

  searchTerm = '';
  filterCategory = '';
  filterStatus: number | undefined;
  filterDisconnect: number | undefined;

  showForm = false;
  editMode = false;
  form: Partial<ElectricitySubscriber> = {};

  displayedColumns = ['noa', 'namea', 'mobile', 'meterNo', 'billingCategory', 'balance', 'status', 'actions'];

  constructor(private svc: ElectricityWorkflowService, private snack: MatSnackBar) {}

  ngOnInit() { this.loadSubscribers(); this.loadStats(); }

  loadStats() { this.svc.getSubscriberStats().subscribe(r => this.stats.set(r.data)); }

  loadSubscribers() {
    this.loading.set(true);
    this.svc.getSubscribers({
      page: this.currentPage, pageSize: this.pageSize, search: this.searchTerm || undefined,
      billingCategory: this.filterCategory || undefined, status: this.filterStatus, disconnectFlag: this.filterDisconnect,
    }).subscribe({ next: r => {
      this.subscribers.set(r.data || []);
      this.totalCount.set(r.totalCount || 0);
      this.totalPages.set(r.totalPages || 1);
      this.loading.set(false);
    }, error: () => this.loading.set(false) });
  }

  selectSubscriber(sub: ElectricitySubscriber) { this.selectedSub.set(sub); }

  editSubscriber(sub: ElectricitySubscriber) {
    this.form = { ...sub }; this.editMode = true; this.showForm = true;
  }

  resetForm() { this.form = { status: 1, billingCategory: 'ampere', meterType: 1, smsEnabled: false, prepaidFlag: false, disconnectFlag: 0 }; }

  saveSubscriber() {
    const obs = this.editMode
      ? this.svc.updateSubscriber(this.form.noa!, this.form)
      : this.svc.createSubscriber(this.form);
    obs.subscribe({ next: r => {
      this.snack.open(r.message || 'تم الحفظ', 'حسناً', { duration: 3000 });
      this.showForm = false; this.loadSubscribers(); this.loadStats();
    }, error: e => this.snack.open(e.error?.message || 'خطأ', 'حسناً', { duration: 3000 }) });
  }

  toggleDisconnect(noa: number) {
    this.svc.toggleDisconnect(noa).subscribe({ next: r => {
      this.snack.open(r.message, 'حسناً', { duration: 3000 });
      this.loadSubscribers(); this.loadStats();
    }});
  }

  viewStatement(noa: number) { /* يتم التنقل لشاشة التقارير */ }
}
