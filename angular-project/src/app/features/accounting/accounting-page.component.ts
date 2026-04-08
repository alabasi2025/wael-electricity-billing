import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-accounting-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCardModule, MatIconModule, MatTableModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTabsModule, MatTooltipModule, MatPaginatorModule],
  template: `
    <div style="padding:1.5rem;direction:rtl">
      <h1 style="display:flex;align-items:center;gap:8px"><mat-icon>account_balance</mat-icon> المحاسبة الكهربائية</h1>
      <p style="color:#666">بديل شاشات: DATAKAD (15 نسخة) + amlall (11 نسخة) + akfa (4) + mzan + memo + KAK + printkx</p>

      <!-- إحصائيات -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:1rem;margin:1rem 0">
        <mat-card style="padding:1rem;text-align:center"><div style="font-size:1.8rem;font-weight:bold">{{accStats()?.totalEntries||0}}</div><div style="color:#666">القيود</div></mat-card>
        <mat-card style="padding:1rem;text-align:center"><div style="font-size:1.8rem;font-weight:bold;color:#2196f3">{{(accStats()?.totalDebit||0)|number}}</div><div style="color:#666">إجمالي مدين</div></mat-card>
        <mat-card style="padding:1rem;text-align:center"><div style="font-size:1.8rem;font-weight:bold;color:#4caf50">{{(accStats()?.totalCredit||0)|number}}</div><div style="color:#666">إجمالي دائن</div></mat-card>
        <mat-card style="padding:1rem;text-align:center"><div style="font-size:1.8rem;font-weight:bold">{{accStats()?.categories||0}}</div><div style="color:#666">التصنيفات</div></mat-card>
      </div>

      <mat-tab-group>
        <!-- تبويب 1: القيود المحاسبية (DATAKAD) -->
        <mat-tab label="📒 القيود">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
              <h3><mat-icon>receipt_long</mat-icon> القيود المحاسبية (بديل DATAKAD - 15 شاشة)</h3>
              <button mat-flat-button color="primary" (click)="showEntryForm=!showEntryForm"><mat-icon>add</mat-icon> قيد جديد</button>
            </div>

            <!-- نموذج قيد جديد -->
            <div *ngIf="showEntryForm" style="background:#f5f5f5;padding:1.5rem;border-radius:8px;margin-bottom:1rem">
              <h4>إنشاء قيد محاسبي</h4>
              <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:0.75rem">
                <mat-form-field appearance="outline"><mat-label>رقم الحساب</mat-label><input matInput type="number" [(ngModel)]="entryForm.accountNoa"></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>تاريخ القيد</mat-label><input matInput type="date" [(ngModel)]="entryForm.entryDate"></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>مدين</mat-label><input matInput type="number" [(ngModel)]="entryForm.debit"></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>دائن</mat-label><input matInput type="number" [(ngModel)]="entryForm.credit"></mat-form-field>
                <mat-form-field appearance="outline"><mat-label>نوع القيد</mat-label>
                  <mat-select [(ngModel)]="entryForm.entryType">
                    <mat-option [value]="1">عادي</mat-option><mat-option [value]="2">فوترة</mat-option>
                    <mat-option [value]="3">تحصيل</mat-option><mat-option [value]="4">ترحيل</mat-option>
                    <mat-option [value]="5">تسوية</mat-option><mat-option [value]="6">إقفال</mat-option>
                  </mat-select>
                </mat-form-field>
                <mat-form-field appearance="outline"><mat-label>الوصف</mat-label><input matInput [(ngModel)]="entryForm.entryName"></mat-form-field>
                <mat-form-field appearance="outline" style="grid-column:span 2"><mat-label>ملاحظات</mat-label><input matInput [(ngModel)]="entryForm.memo"></mat-form-field>
              </div>
              <div style="display:flex;gap:8px;margin-top:0.5rem">
                <button mat-flat-button color="primary" (click)="createEntry()"><mat-icon>save</mat-icon> حفظ القيد</button>
                <button mat-stroked-button (click)="showEntryForm=false">إلغاء</button>
              </div>
            </div>

            <!-- فلاتر البحث -->
            <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1rem;align-items:end">
              <mat-form-field appearance="outline" style="width:150px"><mat-label>رقم الحساب</mat-label><input matInput type="number" [(ngModel)]="jFilter.accountNoa"></mat-form-field>
              <mat-form-field appearance="outline" style="width:150px"><mat-label>من تاريخ</mat-label><input matInput type="date" [(ngModel)]="jFilter.dateFrom"></mat-form-field>
              <mat-form-field appearance="outline" style="width:150px"><mat-label>إلى تاريخ</mat-label><input matInput type="date" [(ngModel)]="jFilter.dateTo"></mat-form-field>
              <mat-form-field appearance="outline" style="width:130px"><mat-label>النوع</mat-label>
                <mat-select [(ngModel)]="jFilter.entryType"><mat-option [value]="undefined">الكل</mat-option><mat-option [value]="1">عادي</mat-option><mat-option [value]="2">فوترة</mat-option><mat-option [value]="3">تحصيل</mat-option></mat-select>
              </mat-form-field>
              <button mat-flat-button (click)="loadEntries()"><mat-icon>search</mat-icon> بحث</button>
            </div>

            <!-- جدول القيود -->
            <table mat-table [dataSource]="entries()" style="width:100%">
              <ng-container matColumnDef="entryNo"><th mat-header-cell *matHeaderCellDef>رقم</th><td mat-cell *matCellDef="let r">{{r.entryNo}}</td></ng-container>
              <ng-container matColumnDef="entryDate"><th mat-header-cell *matHeaderCellDef>التاريخ</th><td mat-cell *matCellDef="let r">{{r.entryDate|date:'shortDate'}}</td></ng-container>
              <ng-container matColumnDef="accountNoa"><th mat-header-cell *matHeaderCellDef>الحساب</th><td mat-cell *matCellDef="let r"><strong>{{r.accountNoa}}</strong></td></ng-container>
              <ng-container matColumnDef="debit"><th mat-header-cell *matHeaderCellDef>مدين</th><td mat-cell *matCellDef="let r" style="color:#f44336">{{r.debit>0?(r.debit|number):''}}</td></ng-container>
              <ng-container matColumnDef="credit"><th mat-header-cell *matHeaderCellDef>دائن</th><td mat-cell *matCellDef="let r" style="color:#4caf50">{{r.credit>0?(r.credit|number):''}}</td></ng-container>
              <ng-container matColumnDef="entryName"><th mat-header-cell *matHeaderCellDef>الوصف</th><td mat-cell *matCellDef="let r">{{r.entryName||r.memo||'-'}}</td></ng-container>
              <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef></th><td mat-cell *matCellDef="let r">
                <button mat-icon-button matTooltip="حذف" (click)="deleteEntry(r.id)" color="warn"><mat-icon>delete</mat-icon></button>
              </td></ng-container>
              <tr mat-header-row *matHeaderRowDef="['entryNo','entryDate','accountNoa','debit','credit','entryName','actions']"></tr>
              <tr mat-row *matRowDef="let row; columns:['entryNo','entryDate','accountNoa','debit','credit','entryName','actions']"></tr>
            </table>
            <div style="text-align:center;padding:0.5rem;color:#666">{{entriesTotal()}} قيد | الصفحة {{jFilter.page}}</div>
          </mat-card>
        </mat-tab>

        <!-- تبويب 2: كشف حساب (amlall) -->
        <mat-tab label="📋 كشف حساب">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>list_alt</mat-icon> كشف حساب محاسبي (بديل amlall - 11 شاشة)</h3>
            <div style="display:flex;gap:1rem;align-items:end;margin-bottom:1rem">
              <mat-form-field appearance="outline"><mat-label>رقم الحساب</mat-label><input matInput type="number" [(ngModel)]="statementNoa"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>من</mat-label><input matInput type="date" [(ngModel)]="statementFrom"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>إلى</mat-label><input matInput type="date" [(ngModel)]="statementTo"></mat-form-field>
              <button mat-flat-button color="primary" (click)="loadStatement()"><mat-icon>search</mat-icon> عرض</button>
              <button mat-stroked-button *ngIf="statementData()" (click)="printStatement()"><mat-icon>print</mat-icon> طباعة</button>
            </div>
            <div *ngIf="statementData()">
              <div style="background:#e8f5e9;padding:1rem;border-radius:8px;margin-bottom:1rem">
                الحساب: <strong>{{statementNoa}}</strong> |
                مدين: <strong style="color:#f44336">{{statementData()?.summary?.totalDebit|number}}</strong> |
                دائن: <strong style="color:#4caf50">{{statementData()?.summary?.totalCredit|number}}</strong> |
                الرصيد: <strong>{{statementData()?.summary?.finalBalance|number}}</strong> |
                القيود: <strong>{{statementData()?.summary?.entryCount}}</strong>
              </div>
              <table mat-table [dataSource]="statementData()?.entries||[]" style="width:100%">
                <ng-container matColumnDef="entryNo"><th mat-header-cell *matHeaderCellDef>رقم</th><td mat-cell *matCellDef="let r">{{r.entryNo}}</td></ng-container>
                <ng-container matColumnDef="entryDate"><th mat-header-cell *matHeaderCellDef>التاريخ</th><td mat-cell *matCellDef="let r">{{r.entryDate|date:'shortDate'}}</td></ng-container>
                <ng-container matColumnDef="debit"><th mat-header-cell *matHeaderCellDef>مدين</th><td mat-cell *matCellDef="let r" style="color:#f44336">{{r.debit>0?(r.debit|number):''}}</td></ng-container>
                <ng-container matColumnDef="credit"><th mat-header-cell *matHeaderCellDef>دائن</th><td mat-cell *matCellDef="let r" style="color:#4caf50">{{r.credit>0?(r.credit|number):''}}</td></ng-container>
                <ng-container matColumnDef="balance"><th mat-header-cell *matHeaderCellDef>الرصيد</th><td mat-cell *matCellDef="let r" style="font-weight:bold" [style.color]="r.runningBalance>0?'#f44336':'#4caf50'">{{r.runningBalance|number}}</td></ng-container>
                <ng-container matColumnDef="memo"><th mat-header-cell *matHeaderCellDef>الوصف</th><td mat-cell *matCellDef="let r">{{r.entryName||r.memo||'-'}}</td></ng-container>
                <tr mat-header-row *matHeaderRowDef="['entryNo','entryDate','debit','credit','balance','memo']"></tr>
                <tr mat-row *matRowDef="let row; columns:['entryNo','entryDate','debit','credit','balance','memo']"></tr>
              </table>
            </div>
          </mat-card>
        </mat-tab>

        <!-- تبويب 3: ميزان المراجعة (mzan) -->
        <mat-tab label="⚖️ ميزان المراجعة">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>balance</mat-icon> ميزان المراجعة (بديل mzan)</h3>
            <div style="display:flex;gap:1rem;align-items:end;margin-bottom:1rem">
              <mat-form-field appearance="outline"><mat-label>من</mat-label><input matInput type="date" [(ngModel)]="trialFrom"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>إلى</mat-label><input matInput type="date" [(ngModel)]="trialTo"></mat-form-field>
              <button mat-flat-button color="primary" (click)="loadTrialBalance()"><mat-icon>refresh</mat-icon> عرض</button>
            </div>
            <table mat-table [dataSource]="trialBalance()" style="width:100%">
              <ng-container matColumnDef="accountNoa"><th mat-header-cell *matHeaderCellDef>الحساب</th><td mat-cell *matCellDef="let r"><strong>{{r.accountNoa}}</strong></td></ng-container>
              <ng-container matColumnDef="totalDebit"><th mat-header-cell *matHeaderCellDef>مدين</th><td mat-cell *matCellDef="let r" style="color:#f44336">{{r.totalDebit|number}}</td></ng-container>
              <ng-container matColumnDef="totalCredit"><th mat-header-cell *matHeaderCellDef>دائن</th><td mat-cell *matCellDef="let r" style="color:#4caf50">{{r.totalCredit|number}}</td></ng-container>
              <ng-container matColumnDef="balance"><th mat-header-cell *matHeaderCellDef>الرصيد</th><td mat-cell *matCellDef="let r" style="font-weight:bold">{{r.balance|number}}</td></ng-container>
              <ng-container matColumnDef="entryCount"><th mat-header-cell *matHeaderCellDef>القيود</th><td mat-cell *matCellDef="let r">{{r.entryCount}}</td></ng-container>
              <tr mat-header-row *matHeaderRowDef="['accountNoa','totalDebit','totalCredit','balance','entryCount']"></tr>
              <tr mat-row *matRowDef="let row; columns:['accountNoa','totalDebit','totalCredit','balance','entryCount']"></tr>
            </table>
          </mat-card>
        </mat-tab>

        <!-- تبويب 4: الإقفالات (akfa) -->
        <mat-tab label="🔒 الإقفالات">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>lock</mat-icon> الإقفال الشهري (بديل akfa - 4 شاشات)</h3>
            <div style="display:flex;gap:1rem;align-items:end">
              <mat-form-field appearance="outline"><mat-label>الشهر</mat-label>
                <mat-select [(ngModel)]="closingMonth">@for(m of months;track m.v){<mat-option [value]="m.v">{{m.n}}</mat-option>}</mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline"><mat-label>السنة</mat-label><input matInput type="number" [(ngModel)]="closingYear"></mat-form-field>
              <button mat-flat-button color="warn" (click)="monthlyClosing()"><mat-icon>lock</mat-icon> تنفيذ الإقفال</button>
            </div>
            <div *ngIf="closingResult()" style="margin-top:1rem;padding:1rem;border-radius:8px" [style.background]="closingResult()?.data?.balanced?'#e8f5e9':'#ffebee'">
              <h4>{{closingResult()?.message}}</h4>
              <div>القيود: {{closingResult()?.data?.entryCount}} | مدين: {{closingResult()?.data?.totalDebit|number}} | دائن: {{closingResult()?.data?.totalCredit|number}}</div>
              <div *ngIf="!closingResult()?.data?.balanced" style="color:#f44336;font-weight:bold">⚠️ الفرق: {{closingResult()?.data?.difference|number}}</div>
            </div>
          </mat-card>
        </mat-tab>

        <!-- تبويب 5: التصنيفات (KAK) -->
        <mat-tab label="🏷️ التصنيفات">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>label</mat-icon> التصنيفات (بديل KAK)</h3>
            <table mat-table [dataSource]="categories()" style="width:100%">
              <ng-container matColumnDef="categoryNo"><th mat-header-cell *matHeaderCellDef>#</th><td mat-cell *matCellDef="let r">{{r.categoryNo}}</td></ng-container>
              <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>الاسم</th><td mat-cell *matCellDef="let r"><strong>{{r.name}}</strong></td></ng-container>
              <ng-container matColumnDef="type"><th mat-header-cell *matHeaderCellDef>النوع</th><td mat-cell *matCellDef="let r">{{r.type||'-'}}</td></ng-container>
              <ng-container matColumnDef="description"><th mat-header-cell *matHeaderCellDef>الوصف</th><td mat-cell *matCellDef="let r">{{r.description||'-'}}</td></ng-container>
              <tr mat-header-row *matHeaderRowDef="['categoryNo','name','type','description']"></tr>
              <tr mat-row *matRowDef="let row; columns:['categoryNo','name','type','description']"></tr>
            </table>
            <div style="display:flex;gap:1rem;margin-top:1rem;align-items:end">
              <mat-form-field appearance="outline"><mat-label>رقم</mat-label><input matInput type="number" [(ngModel)]="catForm.categoryNo"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>الاسم</mat-label><input matInput [(ngModel)]="catForm.name"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>النوع</mat-label><input matInput [(ngModel)]="catForm.type"></mat-form-field>
              <button mat-flat-button color="primary" (click)="createCategory()"><mat-icon>add</mat-icon> إضافة</button>
            </div>
          </mat-card>
        </mat-tab>

        <!-- تبويب 6: المذكرات (memo) -->
        <mat-tab label="📝 المذكرات">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>note</mat-icon> المذكرات (بديل memo)</h3>
            <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:end;margin-bottom:1rem">
              <mat-form-field appearance="outline"><mat-label>رقم المشترك (اختياري)</mat-label><input matInput type="number" [(ngModel)]="memoSubNoa"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>النوع</mat-label>
                <mat-select [(ngModel)]="memoForm.memoType"><mat-option value="note">ملاحظة</mat-option><mat-option value="warning">تحذير</mat-option><mat-option value="action">إجراء</mat-option></mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline" style="min-width:300px"><mat-label>المحتوى</mat-label><input matInput [(ngModel)]="memoForm.content"></mat-form-field>
              <button mat-flat-button color="primary" (click)="createMemo()"><mat-icon>save</mat-icon> حفظ</button>
            </div>
            <div *ngFor="let m of memos()" style="border:1px solid #e0e0e0;border-radius:8px;padding:1rem;margin:0.5rem 0">
              <div style="display:flex;justify-content:space-between"><strong>{{m.memoType==='note'?'📝 ملاحظة':m.memoType==='warning'?'⚠️ تحذير':'▶️ إجراء'}}</strong><small style="color:#999">{{m.createdAt|date:'short'}}</small></div>
              <div>{{m.content}}</div>
              <small *ngIf="m.subscriberNoa" style="color:#666">مشترك: {{m.subscriberNoa}}</small>
            </div>
          </mat-card>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
})
export class AccountingPageComponent implements OnInit {
  accStats = signal<any>(null); entries = signal<any[]>([]); entriesTotal = signal(0);
  statementData = signal<any>(null); trialBalance = signal<any[]>([]);
  closingResult = signal<any>(null); categories = signal<any[]>([]); memos = signal<any[]>([]);

  showEntryForm = false;
  entryForm: any = { entryType: 1, debit: 0, credit: 0 };
  jFilter: any = { page: 1, pageSize: 50 };
  statementNoa = 0; statementFrom = ''; statementTo = '';
  trialFrom = ''; trialTo = '';
  closingMonth = new Date().getMonth() + 1; closingYear = new Date().getFullYear();
  catForm: any = {}; memoForm: any = { memoType: 'note', content: '' }; memoSubNoa: number | undefined;
  months = [{v:1,n:'يناير'},{v:2,n:'فبراير'},{v:3,n:'مارس'},{v:4,n:'أبريل'},{v:5,n:'مايو'},{v:6,n:'يونيو'},{v:7,n:'يوليو'},{v:8,n:'أغسطس'},{v:9,n:'سبتمبر'},{v:10,n:'أكتوبر'},{v:11,n:'نوفمبر'},{v:12,n:'ديسمبر'}];

  constructor(private api: ApiService, private snack: MatSnackBar) {}
  ngOnInit() { this.loadAll(); }

  loadAll() {
    this.api.get('electricity/accounting/stats').subscribe((r: any) => this.accStats.set(r.data));
    this.loadEntries();
    this.api.get('electricity/accounting/categories').subscribe((r: any) => this.categories.set(r.data || []));
    this.api.get('electricity/accounting/memos').subscribe((r: any) => this.memos.set(r.data || []));
  }

  loadEntries() {
    const params = new URLSearchParams();
    if (this.jFilter.accountNoa) params.set('accountNoa', this.jFilter.accountNoa);
    if (this.jFilter.dateFrom) params.set('dateFrom', this.jFilter.dateFrom);
    if (this.jFilter.dateTo) params.set('dateTo', this.jFilter.dateTo);
    if (this.jFilter.entryType) params.set('entryType', this.jFilter.entryType);
    params.set('page', this.jFilter.page); params.set('pageSize', this.jFilter.pageSize);
    this.api.get(`electricity/accounting/journal?${params}`).subscribe((r: any) => { this.entries.set(r.data || []); this.entriesTotal.set(r.totalCount || 0); });
  }

  createEntry() {
    this.api.post('electricity/accounting/journal', this.entryForm).subscribe((r: any) => {
      this.snack.open(r.message, 'حسناً', { duration: 3000 }); this.showEntryForm = false;
      this.entryForm = { entryType: 1, debit: 0, credit: 0 }; this.loadAll();
    });
  }

  deleteEntry(id: number) {
    if (!confirm('حذف هذا القيد؟')) return;
    this.api.delete(`electricity/accounting/journal/${id}`).subscribe((r: any) => { this.snack.open(r.message, 'حسناً', { duration: 3000 }); this.loadEntries(); });
  }

  loadStatement() {
    if (!this.statementNoa) return;
    let url = `electricity/accounting/account-statement/${this.statementNoa}`;
    if (this.statementFrom) url += `?dateFrom=${this.statementFrom}`;
    if (this.statementTo) url += `${this.statementFrom ? '&' : '?'}dateTo=${this.statementTo}`;
    this.api.get(url).subscribe((r: any) => this.statementData.set(r.data));
  }

  printStatement() { window.print(); }

  loadTrialBalance() {
    let url = 'electricity/accounting/trial-balance';
    const params: string[] = [];
    if (this.trialFrom) params.push(`dateFrom=${this.trialFrom}`);
    if (this.trialTo) params.push(`dateTo=${this.trialTo}`);
    if (params.length) url += '?' + params.join('&');
    this.api.get(url).subscribe((r: any) => this.trialBalance.set(r.data || []));
  }

  monthlyClosing() {
    this.api.post('electricity/accounting/monthly-closing', { month: this.closingMonth, year: this.closingYear })
      .subscribe((r: any) => { this.closingResult.set(r); this.snack.open(r.message, 'حسناً', { duration: 3000 }); });
  }

  createCategory() {
    this.api.post('electricity/accounting/categories', this.catForm).subscribe((r: any) => {
      this.snack.open(r.message, 'حسناً', { duration: 3000 }); this.catForm = {}; this.loadAll();
    });
  }

  createMemo() {
    this.api.post('electricity/accounting/memos', { ...this.memoForm, subscriberNoa: this.memoSubNoa })
      .subscribe((r: any) => { this.snack.open(r.message, 'حسناً', { duration: 3000 }); this.memoForm = { memoType: 'note', content: '' }; this.loadAll(); });
  }
}
