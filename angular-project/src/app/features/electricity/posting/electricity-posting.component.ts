import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ElectricityWorkflowService } from '../../../core/services/electricity-workflow.service';
import { electricityPageStyles } from '../electricity-page.styles';

@Component({
  selector: 'app-electricity-posting',
  imports: [CommonModule, FormsModule, RouterModule, MatButtonModule, MatCardModule, MatIconModule, MatTableModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatTooltipModule],
  template: `
    <div class="electricity-page" dir="rtl">
      <section class="hero">
        <div class="hero-copy">
          <span class="hero-kicker">THOEL / اعتماد وترحيل الفوترة</span>
          <h1>ترحيل الفوترة</h1>
          <p>اعتماد دورات الفوترة وترحيلها لإنشاء القيود المحاسبية وتحديث أرصدة المشتركين.</p>
        </div>
      </section>

      <mat-card style="margin:1rem 0;padding:1.5rem">
        <h3><mat-icon>publish</mat-icon> دورات الفوترة المعتمدة للترحيل</h3>
        <table mat-table [dataSource]="billingCycles()" style="width:100%">
          <ng-container matColumnDef="cycleName"><th mat-header-cell *matHeaderCellDef>اسم الدورة</th><td mat-cell *matCellDef="let r">{{r.cycleName}}</td></ng-container>
          <ng-container matColumnDef="period"><th mat-header-cell *matHeaderCellDef>الفترة</th><td mat-cell *matCellDef="let r">{{r.billingMonth}}/{{r.billingYear}}</td></ng-container>
          <ng-container matColumnDef="totalInvoices"><th mat-header-cell *matHeaderCellDef>عدد الفواتير</th><td mat-cell *matCellDef="let r">{{r.totalInvoices}}</td></ng-container>
          <ng-container matColumnDef="totalAmount"><th mat-header-cell *matHeaderCellDef>المبلغ الإجمالي</th><td mat-cell *matCellDef="let r" style="font-weight:bold">{{r.totalAmount | number}}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>الحالة</th><td mat-cell *matCellDef="let r">
            <span [style.color]="r.status===0?'#ff9800':r.status===1?'#2196f3':'#4caf50'" style="font-weight:bold">
              {{r.status===0?'⏳ مفتوح':r.status===1?'📋 مكتمل - جاهز للترحيل':'✅ مرحّل'}}
            </span>
          </td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>إجراء</th><td mat-cell *matCellDef="let r">
            <button mat-flat-button color="primary" *ngIf="r.status===1" (click)="postBilling(r.id)" matTooltip="ترحيل الفوترة وإنشاء القيود المحاسبية">
              <mat-icon>publish</mat-icon> ترحيل واعتماد
            </button>
            <span *ngIf="r.status===2" style="color:#4caf50;font-weight:bold">✅ تم الترحيل</span>
            <span *ngIf="r.status===0" style="color:#999">بانتظار إكمال الفوترة</span>
          </td></ng-container>
          <tr mat-header-row *matHeaderRowDef="['cycleName','period','totalInvoices','totalAmount','status','actions']"></tr>
          <tr mat-row *matRowDef="let row; columns: ['cycleName','period','totalInvoices','totalAmount','status','actions'];"></tr>
        </table>
        <p *ngIf="!billingCycles()?.length" style="text-align:center;color:#999;padding:2rem">لا توجد دورات فوترة بعد. اذهب إلى <a routerLink="/electricity/billing">الفوترة</a> لإصدار فوترة جديدة.</p>
      </mat-card>
    </div>
  `,
  styles: [electricityPageStyles],
})
export class ElectricityPostingComponent implements OnInit {
  billingCycles = signal<any[]>([]);
  constructor(private svc: ElectricityWorkflowService, private snack: MatSnackBar) {}
  ngOnInit() { this.loadCycles(); }
  loadCycles() { this.svc.getBillingCycles().subscribe(r => this.billingCycles.set(r.data || [])); }
  postBilling(cycleId: number) {
    this.svc.postBilling({ billingCycleId: cycleId }).subscribe({
      next: r => { this.snack.open(r.message, 'حسناً', { duration: 3000 }); this.loadCycles(); },
      error: e => this.snack.open(e.error?.message || 'خطأ', 'حسناً', { duration: 3000 }),
    });
  }
}
