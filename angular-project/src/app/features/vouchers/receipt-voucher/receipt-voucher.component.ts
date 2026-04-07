// ===============================================
// سند القبض (Receipt Voucher Component)
// مطابق لنموذج Oracle Forms: sndk.fmb
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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { VouchersService, AccountsService } from '../../../core/services/domain.services';
import { SubAccount } from '../../../core/models';

@Component({
    selector: 'app-receipt-voucher',
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule,
        MatIconModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
        MatTableModule, MatAutocompleteModule, MatDividerModule, MatTooltipModule, MatChipsModule
    ],
    template: `
    <div class="voucher-page" dir="rtl">
      <!-- رأس السند -->
      <div class="page-header">
        <div class="header-info">
          <h2><mat-icon>arrow_downward</mat-icon> سند قبض</h2>
          <p>إنشاء وتعديل سندات القبض - مطابق لنموذج SNDK</p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="accent" (click)="onNew()">
            <mat-icon>add</mat-icon> سند جديد
          </button>
          <button mat-stroked-button (click)="onPrint()" [disabled]="!voucherForm.get('nos')?.value">
            <mat-icon>print</mat-icon> طباعة
          </button>
          <div class="nav-buttons">
            <button mat-icon-button matTooltip="السند السابق" (click)="navigateVoucher('prev')">
              <mat-icon>chevron_right</mat-icon>
            </button>
            <button mat-icon-button matTooltip="السند التالي" (click)="navigateVoucher('next')">
              <mat-icon>chevron_left</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <form [formGroup]="voucherForm" (ngSubmit)="onSave()">
        <!-- بيانات السند الرئيسية -->
        <mat-card class="main-card">
          <mat-card-header>
            <mat-card-title>بيانات السند</mat-card-title>
            @if (voucherForm.get('amr')?.value === 1) {
              <mat-chip class="posted-chip">مرحّل</mat-chip>
            }
          </mat-card-header>
          <mat-card-content>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>رقم السند (NOS)</mat-label>
                <input matInput formControlName="nos" type="number" readonly>
                <mat-icon matSuffix>tag</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>الرقم التسلسلي (NOSON)</mat-label>
                <input matInput formControlName="noson" type="number" readonly>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>التاريخ (DATES)</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="dates">
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
                <mat-error>التاريخ مطلوب</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>نوع السند (SDS)</mat-label>
                <mat-select formControlName="sds">
                  <mat-option value="cash">نقدي</mat-option>
                  <mat-option value="check">شيك</mat-option>
                  <mat-option value="transfer">تحويل</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="wide-field">
                <mat-label>رقم الحساب (NOA)</mat-label>
                <input matInput formControlName="noa" type="number" 
                       (blur)="onAccountChange($event)">
                <mat-icon matSuffix>account_circle</mat-icon>
                <mat-error>رقم الحساب مطلوب</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="extra-wide">
                <mat-label>اسم الحساب (NAMEA)</mat-label>
                <input matInput formControlName="namea" readonly>
                <mat-icon matSuffix>badge</mat-icon>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="extra-wide">
                <mat-label>البيان (MEMOS)</mat-label>
                <textarea matInput formControlName="memos" rows="2"></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>الملاحظات (NMS)</mat-label>
                <textarea matInput formControlName="nms" rows="2"></textarea>
              </mat-form-field>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- تفاصيل السند (SNDKF) -->
        <mat-card class="details-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>list</mat-icon>
              تفاصيل السند (SNDKF)
            </mat-card-title>
            <button mat-mini-fab color="primary" type="button" (click)="addDetail()" matTooltip="إضافة سطر">
              <mat-icon>add</mat-icon>
            </button>
          </mat-card-header>
          <mat-card-content>
            <table mat-table [dataSource]="details.controls" class="details-table">
              <ng-container matColumnDef="index">
                <th mat-header-cell *matHeaderCellDef>#</th>
                <td mat-cell *matCellDef="let detail; let i = index">{{ i + 1 }}</td>
              </ng-container>

              <ng-container matColumnDef="noaf">
                <th mat-header-cell *matHeaderCellDef>رقم الحساب</th>
                <td mat-cell *matCellDef="let detail; let i = index">
                  <mat-form-field appearance="outline" class="table-input">
                    <input matInput [formControl]="detail.get('noaf')" type="number"
                           (blur)="onDetailAccountChange(i)">
                  </mat-form-field>
                </td>
              </ng-container>

              <ng-container matColumnDef="nameaf">
                <th mat-header-cell *matHeaderCellDef>اسم الحساب</th>
                <td mat-cell *matCellDef="let detail">
                  <span>{{ detail.get('nameaf').value }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="amount">
                <th mat-header-cell *matHeaderCellDef>المبلغ</th>
                <td mat-cell *matCellDef="let detail">
                  <mat-form-field appearance="outline" class="table-input amount-input">
                    <input matInput [formControl]="detail.get('amount')" type="number"
                           (input)="calculateTotal()">
                  </mat-form-field>
                </td>
              </ng-container>

              <ng-container matColumnDef="notes">
                <th mat-header-cell *matHeaderCellDef>ملاحظات</th>
                <td mat-cell *matCellDef="let detail">
                  <mat-form-field appearance="outline" class="table-input">
                    <input matInput [formControl]="detail.get('notes')">
                  </mat-form-field>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef></th>
                <td mat-cell *matCellDef="let detail; let i = index">
                  <button mat-icon-button color="warn" (click)="removeDetail(i)" type="button">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="detailColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: detailColumns;"></tr>
            </table>

            <!-- المجموع -->
            <div class="total-row">
              <div class="total-label">المجموع الكلي (TOTALS):</div>
              <div class="total-value">{{ totalAmount() | number }} د.ع</div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- أزرار الحفظ -->
        <div class="action-bar">
          <button mat-raised-button color="primary" type="submit" 
                  [disabled]="voucherForm.invalid" class="save-btn">
            <mat-icon>save</mat-icon>
            حفظ السند
          </button>
          <button mat-raised-button color="accent" type="button" 
                  (click)="onPost()" [disabled]="!voucherForm.get('nos')?.value">
            <mat-icon>check_circle</mat-icon>
            ترحيل
          </button>
          <button mat-stroked-button color="warn" type="button" 
                  (click)="onDelete()" [disabled]="!voucherForm.get('nos')?.value">
            <mat-icon>delete</mat-icon>
            حذف
          </button>
        </div>
      </form>
    </div>
  `,
    styles: [`
    .voucher-page { display: flex; flex-direction: column; gap: 16px; }

    .page-header {
      display: flex; justify-content: space-between; align-items: center;
      flex-wrap: wrap; gap: 12px;
    }

    .page-header h2 {
      display: flex; align-items: center; gap: 8px;
      color: #1a237e; margin: 0;
    }

    .page-header p { color: #757575; margin: 4px 0 0; font-size: 14px; }
    .header-actions { display: flex; gap: 8px; align-items: center; }
    .nav-buttons { display: flex; gap: 0; }

    .main-card, .details-card {
      border-radius: 12px;
      padding: 16px;
    }

    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    mat-card-title {
      display: flex; align-items: center; gap: 8px;
      font-size: 16px; color: #1a237e;
    }

    .posted-chip { background: #e8f5e9 !important; color: #2e7d32 !important; }

    .form-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 8px;
    }

    .form-row mat-form-field { flex: 1; min-width: 200px; }
    .wide-field { max-width: 250px; }
    .extra-wide { flex: 2 !important; }

    .details-table { width: 100%; }
    .table-input { width: 100%; }
    .amount-input input { text-align: left; font-weight: 600; }

    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      margin-top: 12px;
      background: linear-gradient(135deg, #e8eaf6, #c5cae9);
      border-radius: 12px;
    }

    .total-label { font-size: 16px; font-weight: 600; color: #1a237e; }
    .total-value { font-size: 24px; font-weight: 700; color: #1a237e; }

    .action-bar {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
      position: sticky;
      bottom: 0;
    }

    .save-btn { min-width: 150px; }
  `]
})
export class ReceiptVoucherComponent implements OnInit {
  detailColumns = ['index', 'noaf', 'nameaf', 'amount', 'notes', 'actions'];
  totalAmount = signal(0);
  voucherForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private vouchersService: VouchersService,
    private accountsService: AccountsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.voucherForm = this.fb.group({
      nos: [null],
      noson: [null],
      dates: [new Date(), Validators.required],
      noa: ['', Validators.required],
      namea: [''],
      totals: [0],
      memos: [''],
      nms: [''],
      noas: [null],
      nok: [null],
      nokon: [null],
      amr: [0],
      rep: [''],
      rsdd: [''],
      sds: ['cash'],
      txtx: [''],
      nousx: [null],
      details: this.fb.array([])
    });
  }

  get details(): FormArray {
    return this.voucherForm.get('details') as FormArray;
  }

  ngOnInit(): void {
    this.addDetail(); // Add first empty detail row
    const id = this.route.snapshot.params['id'];
    if (id) this.loadVoucher(+id);
  }

  loadVoucher(id: number): void {
    this.vouchersService.getReceiptVoucher(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.voucherForm.patchValue({
            ...res.data,
            dates: res.data?.dates ? new Date(res.data.dates) : new Date()
          });
          this.details.clear();
          res.data.details?.forEach(d => this.addDetail(d));
          this.calculateTotal();
        }
      }
    });
  }

  addDetail(data?: any): void {
    const detail = this.fb.group({
      noaf: [data?.noaf || '', Validators.required],
      nameaf: [data?.nameaf || ''],
      amount: [data?.amount || 0, [Validators.required, Validators.min(1)]],
      noaon: [data?.noaon || null],
      notes: [data?.notes || '']
    });
    this.details.push(detail);
  }

  removeDetail(index: number): void {
    this.details.removeAt(index);
    this.calculateTotal();
  }

  calculateTotal(): void {
    let total = 0;
    this.details.controls.forEach(c => {
      total += +(c.get('amount')?.value || 0);
    });
    this.totalAmount.set(total);
    this.voucherForm.patchValue({ totals: total });
  }

  onAccountChange(event: any): void {
    const noa = this.voucherForm.get('noa')?.value;
    if (noa) {
      this.accountsService.getSubAccount(noa).subscribe({
        next: (res) => {
          if (res.success) this.voucherForm.patchValue({ namea: res.data.namea });
        }
      });
    }
  }

  onDetailAccountChange(index: number): void {
    const detail = this.details.at(index);
    const noaf = detail.get('noaf')?.value;
    if (noaf) {
      this.accountsService.getSubAccount(noaf).subscribe({
        next: (res) => {
          if (res.success) detail.patchValue({ nameaf: res.data.namea });
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
    return {
      dates: this.toApiDate(this.voucherForm.get('dates')?.value),
      noa: +(this.voucherForm.get('noa')?.value || 0),
      namea: this.voucherForm.get('namea')?.value || '',
      memos: this.voucherForm.get('memos')?.value || '',
      nms: this.voucherForm.get('nms')?.value || '',
      sds: this.voucherForm.get('sds')?.value || 'cash',
      details: this.details.controls
        .map((detail) => ({
          noaf: +(detail.get('noaf')?.value || 0),
          nameaf: detail.get('nameaf')?.value || '',
          amount: +(detail.get('amount')?.value || 0),
          notes: detail.get('notes')?.value || ''
        }))
        .filter((detail) => detail.noaf > 0 && detail.amount > 0)
    };
  }

  onSave(): void {
    if (this.voucherForm.invalid) return;

    const payload = this.buildPayload();
    if (payload.details.length === 0) return;

    const nos = +(this.voucherForm.get('nos')?.value || 0);
    const obs = nos
      ? this.vouchersService.updateReceiptVoucher(nos, payload as any)
      : this.vouchersService.createReceiptVoucher(payload as any);

    obs.subscribe({
      next: (res) => {
        if (res.success) {
          this.voucherForm.patchValue({
            nos: (res.data as any).nos,
            noson: (res.data as any).noson,
            amr: (res.data as any).amr ?? 0
          });
          alert('تم حفظ السند بنجاح');
        }
      }
    });
  }

  onPost(): void {
    const nos = this.voucherForm.get('nos')?.value;
    if (nos && confirm('هل تريد ترحيل السند؟')) {
      this.vouchersService.postReceiptVoucher(nos).subscribe({
        next: () => { this.voucherForm.patchValue({ amr: 1 }); alert('تم الترحيل بنجاح'); }
      });
    }
  }

  onDelete(): void {
    const nos = this.voucherForm.get('nos')?.value;
    if (nos && confirm('هل تريد حذف السند؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      this.vouchersService.deleteReceiptVoucher(nos).subscribe({
        next: () => { this.onNew(); alert('تم الحذف بنجاح'); }
      });
    }
  }

  onNew(): void {
    this.voucherForm.reset({ dates: new Date(), sds: 'cash', amr: 0 });
    this.details.clear();
    this.addDetail();
    this.totalAmount.set(0);
  }

  onPrint(): void {
    const nos = this.voucherForm.get('nos')?.value;
    if (nos) this.router.navigate(['/print', 'voucher', nos]);
  }

  navigateVoucher(direction: 'prev' | 'next'): void {
    // TODO: Navigate to previous/next voucher
  }
}
