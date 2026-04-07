// ===============================================
// نموذج القيد المحاسبي (Journal Entry Form)
// مطابق لنموذج Oracle Forms: datak / DATAKAD
// ===============================================
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { JournalService, AccountsService } from '../../../core/services/domain.services';

@Component({
    selector: 'app-entry-form',
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule,
        MatIconModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
        MatTableModule, MatTooltipModule, MatChipsModule
    ],
    template: `
    <div class="entry-page" dir="rtl">
      <div class="page-header">
        <div class="header-info">
          <h2><mat-icon>receipt_long</mat-icon> {{ isEdit() ? 'تعديل قيد محاسبي' : 'قيد محاسبي جديد' }}</h2>
          <p>إنشاء وتعديل القيود المحاسبية - مطابق لجداول DATAK / DATAKSNF</p>
        </div>
      </div>

      <form [formGroup]="entryForm" (ngSubmit)="onSave()">
        <!-- بيانات القيد -->
        <mat-card class="form-card">
          <mat-card-header>
            <mat-card-title>بيانات القيد</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>رقم القيد</mat-label>
                <input matInput formControlName="noa" type="number" readonly>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>التاريخ</mat-label>
                <input matInput [matDatepicker]="datePicker" formControlName="datemo">
                <mat-datepicker-toggle matSuffix [for]="datePicker"></mat-datepicker-toggle>
                <mat-datepicker #datePicker></mat-datepicker>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>الشهر</mat-label>
                <mat-select formControlName="no_m">
                  @for (m of months; track m.value) {
                    <mat-option [value]="m.value">{{ m.label }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>السنة المالية</mat-label>
                <input matInput formControlName="year" type="number">
              </mat-form-field>
            </div>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>البيان</mat-label>
              <textarea matInput formControlName="namea" rows="2" placeholder="وصف القيد المحاسبي..."></textarea>
            </mat-form-field>
          </mat-card-content>
        </mat-card>

        <!-- أسطر القيد -->
        <mat-card class="lines-card">
          <mat-card-header>
            <mat-card-title><mat-icon>table_rows</mat-icon> أسطر القيد</mat-card-title>
            <button mat-mini-fab color="primary" type="button" (click)="addLine()">
              <mat-icon>add</mat-icon>
            </button>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="lines.controls" class="lines-table">
              <ng-container matColumnDef="index">
                <th mat-header-cell *matHeaderCellDef>#</th>
                <td mat-cell *matCellDef="let line; let i = index">{{ i + 1 }}</td>
              </ng-container>
              <ng-container matColumnDef="accountNo">
                <th mat-header-cell *matHeaderCellDef>رقم الحساب</th>
                <td mat-cell *matCellDef="let line; let i = index">
                  <mat-form-field appearance="outline" class="table-field">
                    <input matInput [formControl]="line.get('accountNo')" type="number"
                           (blur)="onLineAccountChange(i)">
                  </mat-form-field>
                </td>
              </ng-container>
              <ng-container matColumnDef="accountName">
                <th mat-header-cell *matHeaderCellDef>اسم الحساب</th>
                <td mat-cell *matCellDef="let line">{{ line.get('accountName').value }}</td>
              </ng-container>
              <ng-container matColumnDef="debit">
                <th mat-header-cell *matHeaderCellDef>مدين</th>
                <td mat-cell *matCellDef="let line">
                  <mat-form-field appearance="outline" class="table-field amount-field">
                    <input matInput [formControl]="line.get('debit')" type="number"
                           (input)="onAmountChange(line, 'debit')" (focus)="calculateTotals()">
                  </mat-form-field>
                </td>
              </ng-container>
              <ng-container matColumnDef="credit">
                <th mat-header-cell *matHeaderCellDef>دائن</th>
                <td mat-cell *matCellDef="let line">
                  <mat-form-field appearance="outline" class="table-field amount-field">
                    <input matInput [formControl]="line.get('credit')" type="number"
                           (input)="onAmountChange(line, 'credit')" (focus)="calculateTotals()">
                  </mat-form-field>
                </td>
              </ng-container>
              <ng-container matColumnDef="notes">
                <th mat-header-cell *matHeaderCellDef>ملاحظات</th>
                <td mat-cell *matCellDef="let line">
                  <mat-form-field appearance="outline" class="table-field">
                    <input matInput [formControl]="line.get('notes')">
                  </mat-form-field>
                </td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef></th>
                <td mat-cell *matCellDef="let line; let i = index">
                  <button mat-icon-button color="warn" (click)="removeLine(i)" type="button">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="lineColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: lineColumns;"></tr>
            </table>

            <!-- المجاميع -->
            <div class="totals-section">
              <div class="total-box debit-box">
                <span class="total-label">مجموع المدين</span>
                <span class="total-value">{{ totalDebit() | number }}</span>
              </div>
              <div class="total-box credit-box">
                <span class="total-label">مجموع الدائن</span>
                <span class="total-value">{{ totalCredit() | number }}</span>
              </div>
              <div class="total-box" [class.balanced]="isBalanced()" [class.unbalanced]="!isBalanced()">
                <span class="total-label">الفرق</span>
                <span class="total-value">{{ difference() | number }}</span>
                <mat-icon>{{ isBalanced() ? 'check_circle' : 'warning' }}</mat-icon>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- أزرار -->
        <div class="action-bar">
          <button mat-raised-button color="primary" type="submit"
                  [disabled]="entryForm.invalid || !isBalanced()">
            <mat-icon>save</mat-icon> حفظ القيد
          </button>
          <button mat-raised-button color="accent" type="button" (click)="onPost()"
                  [disabled]="!isBalanced()">
            <mat-icon>check_circle</mat-icon> ترحيل
          </button>
          <button mat-stroked-button type="button" (click)="onReset()">
            <mat-icon>refresh</mat-icon> تفريغ
          </button>
        </div>
      </form>
    </div>
  `,
    styles: [`
    .entry-page { display: flex; flex-direction: column; gap: 16px; }
    .page-header h2 { display: flex; align-items: center; gap: 8px; color: #1a237e; margin: 0; }
    .page-header p { color: #757575; margin: 4px 0 0; font-size: 14px; }
    .form-card, .lines-card { border-radius: 12px; padding: 16px; }
    mat-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    mat-card-title { display: flex; align-items: center; gap: 8px; color: #1a237e; }
    .form-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 8px; }
    .form-row mat-form-field { flex: 1; min-width: 200px; }
    .full-width { width: 100%; }
    .lines-table { width: 100%; }
    .table-field { width: 100%; }
    .amount-field input { text-align: left; font-weight: 600; }
    .totals-section { display: flex; gap: 16px; margin-top: 16px; flex-wrap: wrap; }
    .total-box {
      flex: 1; min-width: 180px; padding: 16px; border-radius: 12px;
      display: flex; flex-direction: column; align-items: center; gap: 4px;
    }
    .debit-box { background: #ffebee; }
    .credit-box { background: #e8f5e9; }
    .balanced { background: #e8f5e9; color: #2e7d32; }
    .unbalanced { background: #fff3e0; color: #e65100; }
    .total-label { font-size: 13px; font-weight: 500; }
    .total-value { font-size: 22px; font-weight: 700; }
    .action-bar {
      display: flex; gap: 12px; padding: 16px;
      background: white; border-radius: 12px;
      position: sticky; bottom: 0;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
    }
  `]
})
export class EntryFormComponent implements OnInit {
  lineColumns = ['index', 'accountNo', 'accountName', 'debit', 'credit', 'notes', 'actions'];
  isEdit = signal(false);
  totalDebit = signal(0);
  totalCredit = signal(0);
  difference = signal(0);
  entryForm: FormGroup;

  months = [
    { value: 1, label: 'يناير' }, { value: 2, label: 'فبراير' }, { value: 3, label: 'مارس' },
    { value: 4, label: 'أبريل' }, { value: 5, label: 'مايو' }, { value: 6, label: 'يونيو' },
    { value: 7, label: 'يوليو' }, { value: 8, label: 'أغسطس' }, { value: 9, label: 'سبتمبر' },
    { value: 10, label: 'أكتوبر' }, { value: 11, label: 'نوفمبر' }, { value: 12, label: 'ديسمبر' },
  ];

  constructor(
    private fb: FormBuilder,
    private journalService: JournalService,
    private accountsService: AccountsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.entryForm = this.fb.group({
      noa: [null],
      datemo: [new Date(), Validators.required],
      namea: ['', Validators.required],
      no_m: [new Date().getMonth() + 1],
      year: [new Date().getFullYear()],
      notes: [''],
      lines: this.fb.array([])
    });
  }

  get lines(): FormArray { return this.entryForm.get('lines') as FormArray; }

  isBalanced(): boolean { return Math.abs(this.difference()) < 0.01; }

  ngOnInit(): void {
    this.addLine();
    this.addLine();
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit.set(true);
      this.loadEntry(+id);
    }
  }

  loadEntry(id: number): void {
    this.journalService.getEntry(id).subscribe({
      next: (res) => {
        if (!res.success) return;

        const payload: any = res.data;
        const entry = payload?.entry || payload;
        const lines = Array.isArray(payload?.lines) ? payload.lines : [];

        this.entryForm.patchValue({
          noa: entry?.id ?? id,
          datemo: entry?.datemo ? new Date(entry.datemo) : new Date(),
          namea: entry?.namea || '',
          no_m: entry?.noM ?? entry?.no_m ?? new Date().getMonth() + 1,
          year: entry?.year ?? new Date().getFullYear(),
          notes: entry?.notes || ''
        });

        this.lines.clear();
        lines.forEach((line: any) => {
          this.addLine({
            accountNo: line?.noa ?? line?.accountNo ?? '',
            accountName: line?.namea ?? line?.accountName ?? '',
            debit: +(line?.debit || 0),
            credit: +(line?.credit || 0),
            notes: line?.notes || ''
          });
        });

        if (this.lines.length === 0) {
          this.addLine();
          this.addLine();
        }

        this.calculateTotals();
      }
    });
  }

  addLine(data?: any): void {
    this.lines.push(this.fb.group({
      accountNo: [data?.accountNo || '', Validators.required],
      accountName: [data?.accountName || ''],
      debit: [data?.debit || 0],
      credit: [data?.credit || 0],
      notes: [data?.notes || '']
    }));
  }

  removeLine(index: number): void {
    this.lines.removeAt(index);
    this.calculateTotals();
  }

  onAmountChange(line: any, type: 'debit' | 'credit'): void {
    // If debit is entered, clear credit and vice versa
    if (type === 'debit' && line.get('debit').value > 0) {
      line.patchValue({ credit: 0 });
    } else if (type === 'credit' && line.get('credit').value > 0) {
      line.patchValue({ debit: 0 });
    }
    this.calculateTotals();
  }

  calculateTotals(): void {
    let debit = 0, credit = 0;
    this.lines.controls.forEach(c => {
      debit += +(c.get('debit')?.value || 0);
      credit += +(c.get('credit')?.value || 0);
    });
    this.totalDebit.set(debit);
    this.totalCredit.set(credit);
    this.difference.set(debit - credit);
  }

  onLineAccountChange(index: number): void {
    const line = this.lines.at(index);
    const accountNo = line.get('accountNo')?.value;
    if (accountNo) {
      this.accountsService.getSubAccount(accountNo).subscribe({
        next: (res) => {
          if (res.success) line.patchValue({ accountName: res.data.namea });
        }
      });
    }
  }

  private toApiDate(value: Date | string): string {
    if (!value) return this.toApiDate(new Date());
    if (typeof value === 'string') return value.slice(0, 10);
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private buildPayload() {
    const raw = this.entryForm.value;
    return {
      datemo: this.toApiDate(raw.datemo),
      namea: raw.namea,
      noM: +raw.no_m,
      year: +raw.year,
      notes: raw.notes || '',
      lines: this.lines.controls
        .map((line) => ({
          accountNo: +(line.get('accountNo')?.value || 0),
          accountName: line.get('accountName')?.value || '',
          debit: +(line.get('debit')?.value || 0),
          credit: +(line.get('credit')?.value || 0),
          notes: line.get('notes')?.value || ''
        }))
        .filter((line) => line.accountNo > 0)
    };
  }

  onSave(): void {
    if (this.entryForm.invalid || !this.isBalanced()) return;

    const entryId = +(this.entryForm.get('noa')?.value || 0);
    const payload = this.buildPayload();
    if (payload.lines.length === 0) return;

    const obs = this.isEdit() && entryId
      ? this.journalService.updateEntry(entryId, payload as any)
      : this.journalService.createEntry(payload as any);

    obs.subscribe({
      next: (res) => {
        if (!res.success) return;
        const generatedId = (res.data as any)?.lines?.[0]?.id;
        if (generatedId && !entryId) {
          this.entryForm.patchValue({ noa: generatedId });
        }
        alert('تم حفظ القيد بنجاح');
      }
    });
  }

  onPost(): void {
    const noa = this.entryForm.get('noa')?.value;
    if (noa) this.journalService.postEntry(noa).subscribe({
      next: () => alert('تم ترحيل القيد')
    });
  }

  onReset(): void {
    this.entryForm.reset({ datemo: new Date(), no_m: new Date().getMonth() + 1, year: new Date().getFullYear() });
    this.lines.clear();
    this.addLine();
    this.addLine();
    this.calculateTotals();
  }
}
