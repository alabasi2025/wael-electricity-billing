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
  selector: 'app-warehouse',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatCardModule, MatIconModule, MatTableModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTabsModule, MatTooltipModule],
  template: `
    <div style="padding:1.5rem;direction:rtl">
      <h1 style="display:flex;align-items:center;gap:8px"><mat-icon>warehouse</mat-icon> إدارة المخازن والأمانات</h1>
      <p style="color:#666">بديل شاشات: mhzn + mkrna + mhssat + amandhs + mkb</p>

      <mat-tab-group>
        <!-- أصناف المخزن -->
        <mat-tab label="📦 الأصناف">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
              <h3><mat-icon>inventory_2</mat-icon> أصناف المخزن ({{items()?.length || 0}})</h3>
              <button mat-flat-button color="primary" (click)="showItemForm=!showItemForm"><mat-icon>add</mat-icon> صنف جديد</button>
            </div>
            <div *ngIf="showItemForm" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:0.75rem;margin-bottom:1rem;padding:1rem;background:#f5f5f5;border-radius:8px">
              <mat-form-field appearance="outline"><mat-label>الاسم</mat-label><input matInput [(ngModel)]="itemForm.name"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>الفئة</mat-label><input matInput [(ngModel)]="itemForm.category"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>الوحدة</mat-label><input matInput [(ngModel)]="itemForm.unit" placeholder="قطعة/متر/كيلو"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>الكمية</mat-label><input matInput type="number" [(ngModel)]="itemForm.quantity"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>سعر الوحدة</mat-label><input matInput type="number" [(ngModel)]="itemForm.unitPrice"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>الحد الأدنى</mat-label><input matInput type="number" [(ngModel)]="itemForm.minStock"></mat-form-field>
              <div style="display:flex;gap:8px;align-items:center"><button mat-flat-button color="primary" (click)="createItem()">حفظ</button><button mat-stroked-button (click)="showItemForm=false">إلغاء</button></div>
            </div>
            <table mat-table [dataSource]="items()" style="width:100%">
              <ng-container matColumnDef="itemNo"><th mat-header-cell *matHeaderCellDef>#</th><td mat-cell *matCellDef="let r">{{r.itemNo}}</td></ng-container>
              <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>الاسم</th><td mat-cell *matCellDef="let r"><strong>{{r.name}}</strong></td></ng-container>
              <ng-container matColumnDef="category"><th mat-header-cell *matHeaderCellDef>الفئة</th><td mat-cell *matCellDef="let r">{{r.category||'-'}}</td></ng-container>
              <ng-container matColumnDef="quantity"><th mat-header-cell *matHeaderCellDef>الكمية</th><td mat-cell *matCellDef="let r" [style.color]="r.quantity<=r.minStock&&r.minStock>0?'#f44336':'inherit'" [style.fontWeight]="r.quantity<=r.minStock&&r.minStock>0?'bold':'normal'">{{r.quantity}} {{r.unit}}</td></ng-container>
              <ng-container matColumnDef="unitPrice"><th mat-header-cell *matHeaderCellDef>السعر</th><td mat-cell *matCellDef="let r">{{r.unitPrice|number}}</td></ng-container>
              <ng-container matColumnDef="value"><th mat-header-cell *matHeaderCellDef>القيمة</th><td mat-cell *matCellDef="let r" style="font-weight:bold">{{(r.quantity*r.unitPrice)|number}}</td></ng-container>
              <tr mat-header-row *matHeaderRowDef="['itemNo','name','category','quantity','unitPrice','value']"></tr>
              <tr mat-row *matRowDef="let row; columns:['itemNo','name','category','quantity','unitPrice','value']"></tr>
            </table>
          </mat-card>
        </mat-tab>

        <!-- حركات المخزن -->
        <mat-tab label="🔄 الحركات">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>swap_vert</mat-icon> تسجيل حركة مخزن</h3>
            <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:end">
              <mat-form-field appearance="outline"><mat-label>الصنف</mat-label>
                <mat-select [(ngModel)]="moveForm.itemId">@for(i of items();track i.id){<mat-option [value]="i.id">{{i.name}}</mat-option>}</mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline"><mat-label>النوع</mat-label>
                <mat-select [(ngModel)]="moveForm.movementType"><mat-option value="in">إدخال</mat-option><mat-option value="out">إخراج</mat-option><mat-option value="adjust">تسوية</mat-option></mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline"><mat-label>الكمية</mat-label><input matInput type="number" [(ngModel)]="moveForm.quantity"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>السبب</mat-label><input matInput [(ngModel)]="moveForm.reason"></mat-form-field>
              <button mat-flat-button color="primary" (click)="createMovement()"><mat-icon>save</mat-icon> تسجيل</button>
            </div>
          </mat-card>
        </mat-tab>

        <!-- الأمانات -->
        <mat-tab label="💎 الأمانات">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>account_balance_wallet</mat-icon> الأمانات الكهربائية (بديل amandhs)</h3>
            <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:end;margin-bottom:1rem">
              <mat-form-field appearance="outline"><mat-label>رقم المشترك</mat-label><input matInput type="number" [(ngModel)]="depForm.subscriberNoa"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>المبلغ</mat-label><input matInput type="number" [(ngModel)]="depForm.amount"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>النوع</mat-label>
                <mat-select [(ngModel)]="depForm.depositType"><mat-option value="meter_deposit">أمانة عداد</mat-option><mat-option value="service_deposit">أمانة خدمة</mat-option><mat-option value="guarantee">ضمان</mat-option></mat-select>
              </mat-form-field>
              <button mat-flat-button color="primary" (click)="createDeposit()"><mat-icon>save</mat-icon> تسجيل</button>
            </div>
            <table mat-table [dataSource]="deposits()" style="width:100%">
              <ng-container matColumnDef="depositNo"><th mat-header-cell *matHeaderCellDef>#</th><td mat-cell *matCellDef="let r">{{r.depositNo}}</td></ng-container>
              <ng-container matColumnDef="subscriberNoa"><th mat-header-cell *matHeaderCellDef>المشترك</th><td mat-cell *matCellDef="let r">{{r.subscriberNoa}}</td></ng-container>
              <ng-container matColumnDef="amount"><th mat-header-cell *matHeaderCellDef>المبلغ</th><td mat-cell *matCellDef="let r" style="font-weight:bold">{{r.amount|number}}</td></ng-container>
              <ng-container matColumnDef="depositType"><th mat-header-cell *matHeaderCellDef>النوع</th><td mat-cell *matCellDef="let r">{{r.depositType==='meter_deposit'?'عداد':r.depositType==='service_deposit'?'خدمة':'ضمان'}}</td></ng-container>
              <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>الحالة</th><td mat-cell *matCellDef="let r">
                <span [style.color]="r.status===0?'#ff9800':'#4caf50'">{{r.status===0?'محتجز':'مسترد'}}</span>
              </td></ng-container>
              <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>إجراء</th><td mat-cell *matCellDef="let r">
                <button mat-stroked-button *ngIf="r.status===0" (click)="returnDeposit(r.id)" color="primary">استرداد</button>
              </td></ng-container>
              <tr mat-header-row *matHeaderRowDef="['depositNo','subscriberNoa','amount','depositType','status','actions']"></tr>
              <tr mat-row *matRowDef="let row; columns:['depositNo','subscriberNoa','amount','depositType','status','actions']"></tr>
            </table>
          </mat-card>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
})
export class WarehousePageComponent implements OnInit {
  items = signal<any[]>([]); deposits = signal<any[]>([]);
  showItemForm = false;
  itemForm: any = {}; moveForm: any = { movementType: 'in' }; depForm: any = { depositType: 'meter_deposit' };

  constructor(private api: ApiService, private snack: MatSnackBar) {}
  ngOnInit() { this.load(); }
  load() {
    this.api.get('electricity/warehouse/items').subscribe((r: any) => this.items.set(r.data || []));
    this.api.get('electricity/warehouse/deposits').subscribe((r: any) => this.deposits.set(r.data || []));
  }
  createItem() { this.api.post('electricity/warehouse/items', this.itemForm).subscribe((r: any) => { this.snack.open(r.message, 'حسناً', { duration: 3000 }); this.showItemForm = false; this.itemForm = {}; this.load(); }); }
  createMovement() { this.api.post('electricity/warehouse/movements', this.moveForm).subscribe((r: any) => { this.snack.open(r.message, 'حسناً', { duration: 3000 }); this.moveForm = { movementType: 'in' }; this.load(); }); }
  createDeposit() { this.api.post('electricity/warehouse/deposits', { ...this.depForm, dates: new Date().toISOString().split('T')[0] }).subscribe((r: any) => { this.snack.open(r.message, 'حسناً', { duration: 3000 }); this.depForm = { depositType: 'meter_deposit' }; this.load(); }); }
  returnDeposit(id: number) { this.api.post(`electricity/warehouse/deposits/${id}/return`, {}).subscribe((r: any) => { this.snack.open(r.message, 'حسناً', { duration: 3000 }); this.load(); }); }
}
