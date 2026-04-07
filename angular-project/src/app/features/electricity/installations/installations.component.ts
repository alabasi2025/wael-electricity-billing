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
import { MatTooltipModule } from '@angular/material/tooltip';
import { ElectricityWorkflowService } from '../../../core/services/electricity-workflow.service';
import { electricityPageStyles } from '../electricity-page.styles';

@Component({
  selector: 'app-installations',
  imports: [CommonModule, FormsModule, MatButtonModule, MatCardModule, MatIconModule, MatTableModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTooltipModule],
  template: `
    <div class="electricity-page" dir="rtl">
      <section class="hero">
        <div class="hero-copy">
          <span class="hero-kicker">TRKB + addtrkm / التركيبات والتغييرات</span>
          <h1>التركيبات الكهربائية</h1>
          <p>سجل تركيبات العدادات والتغييرات مع تتبع كامل لتاريخ كل عملية.</p>
          <div class="hero-actions">
            <button mat-flat-button (click)="showForm = !showForm"><mat-icon>add</mat-icon> تركيب جديد</button>
          </div>
        </div>
      </section>

      <mat-card *ngIf="showForm" style="margin:1rem 0;padding:1.5rem">
        <h3><mat-icon>build</mat-icon> تسجيل تركيب/تغيير عداد جديد</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem">
          <mat-form-field appearance="outline"><mat-label>رقم المشترك</mat-label><input matInput type="number" [(ngModel)]="form.subscriberNoa"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>رقم العداد القديم</mat-label><input matInput [(ngModel)]="form.oldMeterNo"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>رقم العداد الجديد</mat-label><input matInput [(ngModel)]="form.newMeterNo"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>قراءة الفك</mat-label><input matInput type="number" [(ngModel)]="form.removalReading"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>قراءة التركيب</mat-label><input matInput type="number" [(ngModel)]="form.installReading"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>تاريخ التغيير</mat-label><input matInput type="date" [(ngModel)]="form.changeDate"></mat-form-field>
          <mat-form-field appearance="outline" style="grid-column:span 2"><mat-label>السبب</mat-label><input matInput [(ngModel)]="form.reason"></mat-form-field>
        </div>
        <div style="display:flex;gap:1rem;margin-top:1rem">
          <button mat-flat-button color="primary" (click)="saveInstallation()"><mat-icon>save</mat-icon> حفظ</button>
          <button mat-stroked-button (click)="showForm = false">إلغاء</button>
        </div>
      </mat-card>

      <mat-card style="margin:1rem 0;padding:1.5rem">
        <h3><mat-icon>history</mat-icon> سجل التركيبات والتغييرات</h3>
        <table mat-table [dataSource]="installations()" style="width:100%">
          <ng-container matColumnDef="subscriberNoa"><th mat-header-cell *matHeaderCellDef>المشترك</th><td mat-cell *matCellDef="let r">{{r.subscriberNoa}}</td></ng-container>
          <ng-container matColumnDef="oldMeterNo"><th mat-header-cell *matHeaderCellDef>العداد القديم</th><td mat-cell *matCellDef="let r">{{r.oldMeterNo || '-'}}</td></ng-container>
          <ng-container matColumnDef="newMeterNo"><th mat-header-cell *matHeaderCellDef>العداد الجديد</th><td mat-cell *matCellDef="let r">{{r.newMeterNo}}</td></ng-container>
          <ng-container matColumnDef="removalReading"><th mat-header-cell *matHeaderCellDef>قراءة الفك</th><td mat-cell *matCellDef="let r">{{r.removalReading || '-'}}</td></ng-container>
          <ng-container matColumnDef="installReading"><th mat-header-cell *matHeaderCellDef>قراءة التركيب</th><td mat-cell *matCellDef="let r">{{r.installReading || '-'}}</td></ng-container>
          <ng-container matColumnDef="changeDate"><th mat-header-cell *matHeaderCellDef>التاريخ</th><td mat-cell *matCellDef="let r">{{r.changeDate | date:'shortDate'}}</td></ng-container>
          <ng-container matColumnDef="reason"><th mat-header-cell *matHeaderCellDef>السبب</th><td mat-cell *matCellDef="let r">{{r.reason || '-'}}</td></ng-container>
          <tr mat-header-row *matHeaderRowDef="columns"></tr>
          <tr mat-row *matRowDef="let row; columns: columns;"></tr>
        </table>
        <p *ngIf="!installations()?.length" style="text-align:center;color:#999;padding:2rem">لا توجد تركيبات مسجلة بعد</p>
      </mat-card>
    </div>
  `,
  styles: [electricityPageStyles],
})
export class InstallationsComponent implements OnInit {
  installations = signal<any[]>([]);
  showForm = false;
  form: any = {};
  columns = ['subscriberNoa','oldMeterNo','newMeterNo','removalReading','installReading','changeDate','reason'];

  constructor(private svc: ElectricityWorkflowService, private snack: MatSnackBar) {}
  ngOnInit() { this.loadData(); }

  loadData() { this.svc.getMeterChanges().subscribe(r => this.installations.set(r.data || [])); }

  saveInstallation() {
    if (!this.form.subscriberNoa || !this.form.newMeterNo) return this.snack.open('أكمل البيانات المطلوبة', 'حسناً', { duration: 3000 });
    this.svc.createMeterChange(this.form).subscribe({
      next: r => { this.snack.open(r.message, 'حسناً', { duration: 3000 }); this.showForm = false; this.form = {}; this.loadData(); },
      error: e => this.snack.open(e.error?.message || 'خطأ', 'حسناً', { duration: 3000 }),
    });
  }
}
