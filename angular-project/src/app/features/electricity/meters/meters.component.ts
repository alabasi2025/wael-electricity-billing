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
  selector: 'app-meters',
  imports: [CommonModule, FormsModule, MatButtonModule, MatCardModule, MatIconModule, MatTableModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatTooltipModule],
  template: `
    <div class="electricity-page" dir="rtl">
      <section class="hero">
        <div class="hero-copy">
          <span class="hero-kicker">MZ + TRK / سجل العدادات</span>
          <h1>إدارة العدادات</h1>
          <p>سجل العدادات الكهربائية مع تتبع التغييرات والتركيبات.</p>
        </div>
      </section>
      <mat-card style="margin:1rem 0;padding:1.5rem">
        <h3><mat-icon>settings_input_antenna</mat-icon> سجل العدادات</h3>
        <table mat-table [dataSource]="meters()" style="width:100%">
          <ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef>#</th><td mat-cell *matCellDef="let r">{{r.id}}</td></ng-container>
          <ng-container matColumnDef="meterNumber"><th mat-header-cell *matHeaderCellDef>رقم العداد</th><td mat-cell *matCellDef="let r">{{r.meterNumber}}</td></ng-container>
          <ng-container matColumnDef="subscriberName"><th mat-header-cell *matHeaderCellDef>المشترك</th><td mat-cell *matCellDef="let r">{{r.subscriberName || '-'}}</td></ng-container>
          <ng-container matColumnDef="reading"><th mat-header-cell *matHeaderCellDef>القراءة</th><td mat-cell *matCellDef="let r">{{r.reading}}</td></ng-container>
          <ng-container matColumnDef="prevReading"><th mat-header-cell *matHeaderCellDef>السابقة</th><td mat-cell *matCellDef="let r">{{r.prevReading}}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>الحالة</th><td mat-cell *matCellDef="let r">
            <mat-icon [style.color]="r.status===1?'#4caf50':'#f44336'">{{r.status===1?'check_circle':'cancel'}}</mat-icon>
          </td></ng-container>
          <tr mat-header-row *matHeaderRowDef="['id','meterNumber','subscriberName','reading','prevReading','status']"></tr>
          <tr mat-row *matRowDef="let row; columns: ['id','meterNumber','subscriberName','reading','prevReading','status'];"></tr>
        </table>
        <p *ngIf="!meters()?.length" style="text-align:center;color:#999;padding:2rem">لا توجد عدادات مسجلة. يتم ربط العدادات تلقائياً عند إنشاء المشتركين.</p>
      </mat-card>
      <mat-card style="margin:1rem 0;padding:1.5rem">
        <h3><mat-icon>swap_horiz</mat-icon> سجل تغيير العدادات</h3>
        <table mat-table [dataSource]="changes()" style="width:100%">
          <ng-container matColumnDef="subscriberNoa"><th mat-header-cell *matHeaderCellDef>المشترك</th><td mat-cell *matCellDef="let r">{{r.subscriberNoa}}</td></ng-container>
          <ng-container matColumnDef="oldMeterNo"><th mat-header-cell *matHeaderCellDef>القديم</th><td mat-cell *matCellDef="let r">{{r.oldMeterNo}}</td></ng-container>
          <ng-container matColumnDef="newMeterNo"><th mat-header-cell *matHeaderCellDef>الجديد</th><td mat-cell *matCellDef="let r">{{r.newMeterNo}}</td></ng-container>
          <ng-container matColumnDef="changeDate"><th mat-header-cell *matHeaderCellDef>التاريخ</th><td mat-cell *matCellDef="let r">{{r.changeDate | date:'shortDate'}}</td></ng-container>
          <ng-container matColumnDef="reason"><th mat-header-cell *matHeaderCellDef>السبب</th><td mat-cell *matCellDef="let r">{{r.reason || '-'}}</td></ng-container>
          <tr mat-header-row *matHeaderRowDef="['subscriberNoa','oldMeterNo','newMeterNo','changeDate','reason']"></tr>
          <tr mat-row *matRowDef="let row; columns: ['subscriberNoa','oldMeterNo','newMeterNo','changeDate','reason'];"></tr>
        </table>
        <p *ngIf="!changes()?.length" style="text-align:center;color:#999;padding:1rem">لا توجد تغييرات مسجلة</p>
      </mat-card>
    </div>
  `,
  styles: [electricityPageStyles],
})
export class MetersComponent implements OnInit {
  meters = signal<any[]>([]);
  changes = signal<any[]>([]);
  constructor(private svc: ElectricityWorkflowService) {}
  ngOnInit() {
    this.svc.getLegacyMeters({ pageSize: 100 }).subscribe(r => this.meters.set(r.data || []));
    this.svc.getMeterChanges().subscribe(r => this.changes.set(r.data || []));
  }
}
