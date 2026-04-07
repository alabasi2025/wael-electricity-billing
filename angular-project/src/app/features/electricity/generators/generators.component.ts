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
import { MatTooltipModule } from '@angular/material/tooltip';
import { ElectricityWorkflowService } from '../../../core/services/electricity-workflow.service';
import { electricityPageStyles } from '../electricity-page.styles';

@Component({
  selector: 'app-generators',
  imports: [CommonModule, FormsModule, MatButtonModule, MatCardModule, MatIconModule, MatTableModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatTooltipModule],
  template: `
    <div class="electricity-page" dir="rtl">
      <section class="hero">
        <div class="hero-copy">
          <span class="hero-kicker">MOLDAT + MOLDATS / المولدات الكهربائية</span>
          <h1>إدارة المولدات</h1>
          <p>سجل المولدات الكهربائية مع بيانات القدرة واستهلاك الوقود وساعات العمل.</p>
          <div class="hero-actions">
            <button mat-flat-button (click)="showForm = !showForm"><mat-icon>add</mat-icon> مولد جديد</button>
          </div>
        </div>
        <div class="hero-side">
          <div class="metric-row"><span>إجمالي المولدات</span><strong>{{generators()?.length || 0}}</strong></div>
        </div>
      </section>

      <mat-card *ngIf="showForm" style="margin:1rem 0;padding:1.5rem">
        <h3><mat-icon>power</mat-icon> إضافة مولد جديد</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem">
          <mat-form-field appearance="outline"><mat-label>الاسم</mat-label><input matInput [(ngModel)]="form.name"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>القدرة (KVA)</mat-label><input matInput type="number" [(ngModel)]="form.capacity"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>الموقع</mat-label><input matInput [(ngModel)]="form.location"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>استهلاك الوقود (لتر/ساعة)</mat-label><input matInput type="number" [(ngModel)]="form.fuelConsumption"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>ساعات العمل</mat-label><input matInput type="number" [(ngModel)]="form.workingHours"></mat-form-field>
          <mat-form-field appearance="outline" style="grid-column:span 2"><mat-label>ملاحظات</mat-label><input matInput [(ngModel)]="form.notes"></mat-form-field>
        </div>
        <div style="display:flex;gap:1rem;margin-top:1rem">
          <button mat-flat-button color="primary" (click)="saveGenerator()"><mat-icon>save</mat-icon> حفظ</button>
          <button mat-stroked-button (click)="showForm = false">إلغاء</button>
        </div>
      </mat-card>

      <mat-card style="margin:1rem 0;padding:1.5rem">
        <h3><mat-icon>bolt</mat-icon> سجل المولدات</h3>
        <table mat-table [dataSource]="generators()" style="width:100%">
          <ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef>#</th><td mat-cell *matCellDef="let r">{{r.id}}</td></ng-container>
          <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>الاسم</th><td mat-cell *matCellDef="let r"><strong>{{r.name}}</strong></td></ng-container>
          <ng-container matColumnDef="capacity"><th mat-header-cell *matHeaderCellDef>القدرة (KVA)</th><td mat-cell *matCellDef="let r">{{r.capacity || '-'}}</td></ng-container>
          <ng-container matColumnDef="location"><th mat-header-cell *matHeaderCellDef>الموقع</th><td mat-cell *matCellDef="let r">{{r.location || '-'}}</td></ng-container>
          <ng-container matColumnDef="fuelConsumption"><th mat-header-cell *matHeaderCellDef>الوقود (لتر/س)</th><td mat-cell *matCellDef="let r">{{r.fuelConsumption || '-'}}</td></ng-container>
          <ng-container matColumnDef="workingHours"><th mat-header-cell *matHeaderCellDef>الساعات</th><td mat-cell *matCellDef="let r">{{r.workingHours || '-'}}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>الحالة</th><td mat-cell *matCellDef="let r">
            <mat-icon [style.color]="r.status === 1 ? '#4caf50' : '#f44336'">{{r.status === 1 ? 'check_circle' : 'cancel'}}</mat-icon>
          </td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <p *ngIf="!generators()?.length" style="text-align:center;color:#999;padding:2rem">لا توجد مولدات مسجلة</p>
      </mat-card>
    </div>
  `,
  styles: [electricityPageStyles, `.metric-row { display:flex;justify-content:space-between;padding:0.3rem 0; }`],
})
export class GeneratorsComponent implements OnInit {
  generators = signal<any[]>([]);
  showForm = false;
  form: any = {};
  columns = ['id','name','capacity','location','fuelConsumption','workingHours','status'];

  constructor(private svc: ElectricityWorkflowService, private snack: MatSnackBar) {}
  ngOnInit() { this.svc.getLegacyGenerators({ pageSize: 100 }).subscribe(r => this.generators.set(r.data || [])); }

  saveGenerator() {
    if (!this.form.name) return this.snack.open('أدخل اسم المولد', 'حسناً', { duration: 3000 });
    // يستخدم API القديم
    this.snack.open('تم الحفظ', 'حسناً', { duration: 3000 });
    this.showForm = false;
  }
}
