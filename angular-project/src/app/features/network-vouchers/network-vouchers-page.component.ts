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
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-network-vouchers-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCardModule, MatIconModule, MatTableModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTabsModule, MatTooltipModule],
  template: `
    <div style="padding:1.5rem;direction:rtl">
      <h1 style="display:flex;align-items:center;gap:8px"><mat-icon>language</mat-icon> سندات الشبكة والدفع الإلكتروني</h1>
      <p style="color:#666">بديل شاشات: sndknet + sndknetf + A.NET + صناديق النقد + التسويات</p>

      <!-- إحصائيات -->
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;margin:1rem 0">
        <mat-card style="padding:1rem;text-align:center"><div style="font-size:2rem;font-weight:bold;color:#2196f3">{{netStats()?.total||0}}</div><div style="color:#666">إجمالي السندات</div></mat-card>
        <mat-card style="padding:1rem;text-align:center"><div style="font-size:2rem;font-weight:bold;color:#ff9800">{{netStats()?.pending||0}}</div><div style="color:#666">معلقة</div></mat-card>
        <mat-card style="padding:1rem;text-align:center"><div style="font-size:2rem;font-weight:bold;color:#4caf50">{{netStats()?.posted||0}}</div><div style="color:#666">مرحّلة</div></mat-card>
        <mat-card style="padding:1rem;text-align:center"><div style="font-size:2rem;font-weight:bold">{{(netStats()?.totalAmount||0)|number}}</div><div style="color:#666">إجمالي المبالغ</div></mat-card>
      </div>

      <mat-tab-group>
        <!-- سندات الشبكة -->
        <mat-tab label="🌐 سندات الشبكة">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3>إنشاء سند شبكة جديد</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:0.75rem;margin-bottom:1rem">
              <mat-form-field appearance="outline"><mat-label>رقم المشترك</mat-label><input matInput type="number" [(ngModel)]="nvForm.subscriberNoa"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>المبلغ</mat-label><input matInput type="number" [(ngModel)]="nvForm.amount"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>رقم المرجع</mat-label><input matInput [(ngModel)]="nvForm.referenceNo"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>البنك</mat-label><input matInput [(ngModel)]="nvForm.bankName"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>ملاحظات</mat-label><input matInput [(ngModel)]="nvForm.memo"></mat-form-field>
              <button mat-flat-button color="primary" (click)="createNetVoucher()" style="height:56px"><mat-icon>add</mat-icon> إنشاء</button>
            </div>
            <table mat-table [dataSource]="netVouchers()" style="width:100%">
              <ng-container matColumnDef="voucherNo"><th mat-header-cell *matHeaderCellDef>#</th><td mat-cell *matCellDef="let r">{{r.voucherNo}}</td></ng-container>
              <ng-container matColumnDef="subscriberNoa"><th mat-header-cell *matHeaderCellDef>المشترك</th><td mat-cell *matCellDef="let r">{{r.subscriberNoa}}</td></ng-container>
              <ng-container matColumnDef="amount"><th mat-header-cell *matHeaderCellDef>المبلغ</th><td mat-cell *matCellDef="let r" style="font-weight:bold">{{r.amount|number}}</td></ng-container>
              <ng-container matColumnDef="referenceNo"><th mat-header-cell *matHeaderCellDef>المرجع</th><td mat-cell *matCellDef="let r">{{r.referenceNo||'-'}}</td></ng-container>
              <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>الحالة</th><td mat-cell *matCellDef="let r">
                <span [style.color]="r.status===0?'#ff9800':r.status===1?'#2196f3':r.status===2?'#4caf50':'#f44336'">{{r.status===0?'معلق':r.status===1?'مؤكد':r.status===2?'مرحّل':'مرفوض'}}</span>
              </td></ng-container>
              <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>إجراءات</th><td mat-cell *matCellDef="let r">
                <button mat-icon-button *ngIf="r.status===0" matTooltip="تأكيد" (click)="confirmNV(r.id)"><mat-icon style="color:#2196f3">check</mat-icon></button>
                <button mat-icon-button *ngIf="r.status===1" matTooltip="ترحيل" (click)="postNV(r.id)"><mat-icon style="color:#4caf50">publish</mat-icon></button>
              </td></ng-container>
              <tr mat-header-row *matHeaderRowDef="['voucherNo','subscriberNoa','amount','referenceNo','status','actions']"></tr>
              <tr mat-row *matRowDef="let row; columns:['voucherNo','subscriberNoa','amount','referenceNo','status','actions']"></tr>
            </table>
          </mat-card>
        </mat-tab>

        <!-- صناديق النقد -->
        <mat-tab label="💰 صناديق النقد">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>account_balance</mat-icon> صناديق النقد</h3>
            <div *ngFor="let cb of cashboxes()" style="display:flex;justify-content:space-between;align-items:center;padding:1rem;border:1px solid #e0e0e0;border-radius:8px;margin:0.5rem 0">
              <div><strong>{{cb.name}}</strong><br><small style="color:#666">حساب: {{cb.accountNo||'-'}}</small></div>
              <div style="font-size:1.5rem;font-weight:bold">{{cb.balance|number}}</div>
            </div>
          </mat-card>
        </mat-tab>

        <!-- التسويات -->
        <mat-tab label="⚖️ التسويات">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>balance</mat-icon> التسويات المالية (بديل TSSX/TSSNF)</h3>
            <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:end;margin-bottom:1rem">
              <mat-form-field appearance="outline"><mat-label>رقم المشترك</mat-label><input matInput type="number" [(ngModel)]="settForm.subscriberNoa"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>المبلغ الأصلي</mat-label><input matInput type="number" [(ngModel)]="settForm.originalAmount"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>المبلغ بعد التسوية</mat-label><input matInput type="number" [(ngModel)]="settForm.settledAmount"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>النوع</mat-label>
                <mat-select [(ngModel)]="settForm.settlementType"><mat-option value="discount">خصم</mat-option><mat-option value="correction">تصحيح</mat-option><mat-option value="waiver">إعفاء</mat-option></mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline"><mat-label>السبب</mat-label><input matInput [(ngModel)]="settForm.reason"></mat-form-field>
              <button mat-flat-button color="primary" (click)="createSettlement()"><mat-icon>save</mat-icon> تسجيل</button>
            </div>
            <table mat-table [dataSource]="settlements()" style="width:100%">
              <ng-container matColumnDef="settlementNo"><th mat-header-cell *matHeaderCellDef>#</th><td mat-cell *matCellDef="let r">{{r.settlementNo}}</td></ng-container>
              <ng-container matColumnDef="subscriberNoa"><th mat-header-cell *matHeaderCellDef>المشترك</th><td mat-cell *matCellDef="let r">{{r.subscriberNoa}}</td></ng-container>
              <ng-container matColumnDef="originalAmount"><th mat-header-cell *matHeaderCellDef>الأصلي</th><td mat-cell *matCellDef="let r">{{r.originalAmount|number}}</td></ng-container>
              <ng-container matColumnDef="settledAmount"><th mat-header-cell *matHeaderCellDef>بعد التسوية</th><td mat-cell *matCellDef="let r">{{r.settledAmount|number}}</td></ng-container>
              <ng-container matColumnDef="difference"><th mat-header-cell *matHeaderCellDef>الفرق</th><td mat-cell *matCellDef="let r" style="font-weight:bold" [style.color]="r.difference<0?'#4caf50':'#f44336'">{{r.difference|number}}</td></ng-container>
              <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>الحالة</th><td mat-cell *matCellDef="let r">
                <span [style.color]="r.status===0?'#ff9800':'#4caf50'">{{r.status===0?'معلق':'معتمد'}}</span>
              </td></ng-container>
              <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>اعتماد</th><td mat-cell *matCellDef="let r">
                <button mat-stroked-button *ngIf="r.status===0" (click)="approveSettlement(r.id)" color="primary">اعتماد</button>
              </td></ng-container>
              <tr mat-header-row *matHeaderRowDef="['settlementNo','subscriberNoa','originalAmount','settledAmount','difference','status','actions']"></tr>
              <tr mat-row *matRowDef="let row; columns:['settlementNo','subscriberNoa','originalAmount','settledAmount','difference','status','actions']"></tr>
            </table>
          </mat-card>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
})
export class NetworkVouchersPageComponent implements OnInit {
  netVouchers = signal<any[]>([]); cashboxes = signal<any[]>([]); settlements = signal<any[]>([]); netStats = signal<any>(null);
  nvForm: any = {}; settForm: any = { settlementType: 'discount' };

  constructor(private api: ApiService, private snack: MatSnackBar) {}
  ngOnInit() { this.load(); }
  load() {
    this.api.get('electricity/network/vouchers').subscribe((r: any) => this.netVouchers.set(r.data || []));
    this.api.get('electricity/network/cashboxes').subscribe((r: any) => this.cashboxes.set(r.data || []));
    this.api.get('electricity/network/settlements').subscribe((r: any) => this.settlements.set(r.data || []));
    this.api.get('electricity/network/stats').subscribe((r: any) => this.netStats.set(r.data));
  }
  createNetVoucher() { this.api.post('electricity/network/vouchers', { ...this.nvForm, voucherDate: new Date().toISOString().split('T')[0] }).subscribe((r: any) => { this.snack.open(r.message, 'حسناً', { duration: 3000 }); this.nvForm = {}; this.load(); }); }
  confirmNV(id: number) { this.api.post(`electricity/network/vouchers/${id}/confirm`, {}).subscribe((r: any) => { this.snack.open(r.message, 'حسناً', { duration: 3000 }); this.load(); }); }
  postNV(id: number) { this.api.post(`electricity/network/vouchers/${id}/post`, {}).subscribe((r: any) => { this.snack.open(r.message, 'حسناً', { duration: 3000 }); this.load(); }); }
  createSettlement() { this.api.post('electricity/network/settlements', this.settForm).subscribe((r: any) => { this.snack.open(r.message, 'حسناً', { duration: 3000 }); this.settForm = { settlementType: 'discount' }; this.load(); }); }
  approveSettlement(id: number) { this.api.post(`electricity/network/settlements/${id}/approve`, {}).subscribe((r: any) => { this.snack.open(r.message, 'حسناً', { duration: 3000 }); this.load(); }); }
}
