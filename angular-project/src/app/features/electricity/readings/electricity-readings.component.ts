import { Component, OnInit, signal } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ElectricityWorkflowService } from '../../../core/services/electricity-workflow.service';
import { electricityPageStyles } from '../electricity-page.styles';

@Component({
  selector: 'app-electricity-readings',
  imports: [ CommonModule, FormsModule, RouterModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, MatTableModule, MatSelectModule, MatSnackBarModule, MatChipsModule, MatTooltipModule ],
  template: `
    <div class="electricity-page" dir="rtl">
      <section class="hero">
        <div class="hero-copy">
          <span class="hero-kicker">ADDMZ + REDMZ / دورة القراءة</span>
          <h1>قراءات العدادات</h1>
          <p>إنشاء دورات القراءة، إدخال القراءات لكل مشترك، حساب الاستهلاك تلقائياً، وكشف القراءات الشاذة.</p>
          <div class="hero-actions">
            <button mat-flat-button (click)="showNewCycleForm = true"><mat-icon>add_circle</mat-icon> دورة جديدة</button>
            <a mat-stroked-button routerLink="/electricity/billing"><mat-icon>receipt</mat-icon> الفوترة</a>
          </div>
        </div>
        <div class="hero-side">
          <div class="metric-row"><span>إجمالي الدورات</span><strong>{{ readingStats()?.totalCycles || 0 }}</strong></div>
          <div class="metric-row"><span>دورات مفتوحة</span><strong style="color:#ff9800">{{ readingStats()?.openCycles || 0 }}</strong></div>
          <div class="metric-row"><span>إجمالي القراءات</span><strong>{{ readingStats()?.totalReadings || 0 }}</strong></div>
          <div class="metric-row"><span>قراءات شاذة</span><strong style="color:#f44336">{{ readingStats()?.anomalies || 0 }}</strong></div>
        </div>
      </section>

      <!-- نموذج دورة جديدة -->
      <mat-card *ngIf="showNewCycleForm" style="margin:1rem 0;padding:1.5rem">
        <h3><mat-icon>date_range</mat-icon> إنشاء دورة قراءة جديدة</h3>
        <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:end">
          <mat-form-field appearance="outline"><mat-label>من تاريخ</mat-label><input matInput type="date" [(ngModel)]="newCycle.dateFrom"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>إلى تاريخ</mat-label><input matInput type="date" [(ngModel)]="newCycle.dateTo"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>المجموعة (اختياري)</mat-label><input matInput type="number" [(ngModel)]="newCycle.groupId"></mat-form-field>
          <button mat-flat-button color="primary" (click)="createCycle()"><mat-icon>check</mat-icon> إنشاء</button>
          <button mat-stroked-button (click)="showNewCycleForm = false">إلغاء</button>
        </div>
      </mat-card>

      <!-- قائمة الدورات -->
      <mat-card style="margin:1rem 0">
        <h3>دورات القراءة</h3>
        <table mat-table [dataSource]="cycles()" style="width:100%">
          <ng-container matColumnDef="cycleNo"><th mat-header-cell *matHeaderCellDef>رقم</th><td mat-cell *matCellDef="let r">{{r.cycleNo}}</td></ng-container>
          <ng-container matColumnDef="dateFrom"><th mat-header-cell *matHeaderCellDef>من</th><td mat-cell *matCellDef="let r">{{r.dateFrom | date:'shortDate'}}</td></ng-container>
          <ng-container matColumnDef="dateTo"><th mat-header-cell *matHeaderCellDef>إلى</th><td mat-cell *matCellDef="let r">{{r.dateTo | date:'shortDate'}}</td></ng-container>
          <ng-container matColumnDef="totalSubscribers"><th mat-header-cell *matHeaderCellDef>المشتركين</th><td mat-cell *matCellDef="let r">{{r.totalSubscribers}}</td></ng-container>
          <ng-container matColumnDef="totalRead"><th mat-header-cell *matHeaderCellDef>المقروء</th><td mat-cell *matCellDef="let r">{{r.totalRead}}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>الحالة</th><td mat-cell *matCellDef="let r">
            <span [style.color]="r.status===0?'#ff9800':r.status===1?'#4caf50':'#2196f3'">{{r.status===0?'مفتوحة':r.status===1?'مغلقة':'مفوترة'}}</span>
          </td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>إجراءات</th><td mat-cell *matCellDef="let r">
            <button mat-icon-button matTooltip="عرض القراءات" (click)="loadCycleReadings(r.id)"><mat-icon>visibility</mat-icon></button>
            <button mat-icon-button matTooltip="إغلاق الدورة" *ngIf="r.status===0" (click)="closeCycle(r.id)"><mat-icon>lock</mat-icon></button>
          </td></ng-container>
          <tr mat-header-row *matHeaderRowDef="cycleColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: cycleColumns;"></tr>
        </table>
      </mat-card>

      <!-- قراءات الدورة المحددة -->
      <mat-card *ngIf="selectedCycleId" style="margin:1rem 0">
        <h3><mat-icon>speed</mat-icon> قراءات الدورة {{selectedCycleId}} <span *ngIf="readingSummary()">({{readingSummary()?.completed}}/{{readingSummary()?.total}} مكتمل | {{readingSummary()?.anomalies}} شاذ)</span></h3>
        <table mat-table [dataSource]="readings()" style="width:100%">
          <ng-container matColumnDef="subscriberNoa"><th mat-header-cell *matHeaderCellDef>المشترك</th><td mat-cell *matCellDef="let r">{{r.subscriberNoa}}</td></ng-container>
          <ng-container matColumnDef="meterName"><th mat-header-cell *matHeaderCellDef>العداد</th><td mat-cell *matCellDef="let r">{{r.meterName || '-'}}</td></ng-container>
          <ng-container matColumnDef="prevReading"><th mat-header-cell *matHeaderCellDef>السابقة</th><td mat-cell *matCellDef="let r">{{r.prevReading}}</td></ng-container>
          <ng-container matColumnDef="currReading"><th mat-header-cell *matHeaderCellDef>الحالية</th><td mat-cell *matCellDef="let r">
            <input *ngIf="r.status===0" matInput type="number" [(ngModel)]="r._newReading" style="width:80px;text-align:center;border:1px solid #ccc;border-radius:4px;padding:4px" placeholder="أدخل">
            <span *ngIf="r.status!==0">{{r.currReading}}</span>
          </td></ng-container>
          <ng-container matColumnDef="consumption"><th mat-header-cell *matHeaderCellDef>الاستهلاك</th><td mat-cell *matCellDef="let r" [style.fontWeight]="'bold'">{{r.consumption || '-'}}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>الحالة</th><td mat-cell *matCellDef="let r">
            <mat-icon *ngIf="r.isAnomaly" style="color:#f44336" [matTooltip]="r.anomalyReason">warning</mat-icon>
            <mat-icon *ngIf="r.status===1 && !r.isAnomaly" style="color:#4caf50">check_circle</mat-icon>
            <mat-icon *ngIf="r.status===0" style="color:#9e9e9e">hourglass_empty</mat-icon>
            <mat-icon *ngIf="r.status===3" style="color:#2196f3">receipt</mat-icon>
          </td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>حفظ</th><td mat-cell *matCellDef="let r">
            <button mat-icon-button *ngIf="r.status===0 && r._newReading" matTooltip="حفظ القراءة" (click)="saveReading(r)"><mat-icon style="color:#4caf50">save</mat-icon></button>
          </td></ng-container>
          <tr mat-header-row *matHeaderRowDef="readingColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: readingColumns;" [style.background]="row.isAnomaly ? '#fff3e0' : ''"></tr>
        </table>
      </mat-card>

      <mat-spinner *ngIf="loading()" diameter="40" style="margin:2rem auto"></mat-spinner>
    </div>
  `,
  styles: [electricityPageStyles, `
    .metric-row { display: flex; justify-content: space-between; padding: 0.3rem 0; }
  `],
})
export class ElectricityReadingsComponent implements OnInit {
  cycles = signal<any[]>([]);
  readings = signal<any[]>([]);
  readingStats = signal<any>(null);
  readingSummary = signal<any>(null);
  loading = signal(false);
  selectedCycleId: number | null = null;
  showNewCycleForm = false;
  newCycle = { dateFrom: '', dateTo: '', groupId: undefined as number | undefined };
  cycleColumns = ['cycleNo','dateFrom','dateTo','totalSubscribers','totalRead','status','actions'];
  readingColumns = ['subscriberNoa','meterName','prevReading','currReading','consumption','status','actions'];

  constructor(private svc: ElectricityWorkflowService, private snack: MatSnackBar) {}
  ngOnInit() { this.loadCycles(); this.loadStats(); }

  loadStats() { this.svc.getReadingStats().subscribe(r => this.readingStats.set(r.data)); }
  loadCycles() { this.svc.getReadingCycles().subscribe(r => this.cycles.set(r.data || [])); }

  createCycle() {
    if (!this.newCycle.dateFrom || !this.newCycle.dateTo) return this.snack.open('حدد التواريخ','حسناً',{duration:3000});
    this.svc.createReadingCycle(this.newCycle as any).subscribe({ next: r => {
      this.snack.open(r.message,'حسناً',{duration:3000}); this.showNewCycleForm = false; this.loadCycles(); this.loadStats();
    }, error: e => this.snack.open(e.error?.message || 'خطأ','حسناً',{duration:3000}) });
  }

  closeCycle(id: number) {
    this.svc.closeReadingCycle(id).subscribe({ next: r => {
      this.snack.open(r.message,'حسناً',{duration:3000}); this.loadCycles(); this.loadStats();
    }});
  }

  loadCycleReadings(cycleId: number) {
    this.selectedCycleId = cycleId; this.loading.set(true);
    this.svc.getCycleReadings(cycleId, { pageSize: 200 }).subscribe({ next: r => {
      this.readings.set((r.data || []).map((x:any) => ({...x, _newReading: null})));
      this.readingSummary.set(r.summary); this.loading.set(false);
    }, error: () => this.loading.set(false) });
  }

  saveReading(r: any) {
    this.svc.recordReading(this.selectedCycleId!, { subscriberNoa: r.subscriberNoa, currReading: r._newReading }).subscribe({
      next: res => {
        this.snack.open(res.message,'حسناً',{duration:3000}); this.loadCycleReadings(this.selectedCycleId!); this.loadStats();
      }, error: e => this.snack.open(e.error?.message || 'خطأ','حسناً',{duration:3000})
    });
  }
}
