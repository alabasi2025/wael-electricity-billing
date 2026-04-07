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
import { ElectricityWorkflowService } from '../../../core/services/electricity-workflow.service';
import { electricityPageStyles } from '../electricity-page.styles';

@Component({
  selector: 'app-centers',
  imports: [CommonModule, FormsModule, MatButtonModule, MatCardModule, MatIconModule, MatTableModule, MatSnackBarModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="electricity-page" dir="rtl">
      <section class="hero">
        <div class="hero-copy">
          <span class="hero-kicker">MRCZE + GRP / المراكز والمجموعات</span>
          <h1>إدارة المراكز والمجموعات</h1>
          <p>إدارة المراكز الكهربائية والمجموعات والمحصلين وربطهم بالمشتركين.</p>
        </div>
        <div class="hero-side">
          <div class="metric-row"><span>المجموعات</span><strong>{{groupStats()?.groups || 0}}</strong></div>
          <div class="metric-row"><span>المحصلين</span><strong>{{groupStats()?.collectors || 0}}</strong></div>
        </div>
      </section>

      <!-- المجموعات -->
      <mat-card style="margin:1rem 0;padding:1.5rem">
        <h3><mat-icon>folder</mat-icon> المجموعات الكهربائية</h3>
        <table mat-table [dataSource]="groups()" style="width:100%">
          <ng-container matColumnDef="nog"><th mat-header-cell *matHeaderCellDef>الرقم</th><td mat-cell *matCellDef="let r">{{r.nog}}</td></ng-container>
          <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>الاسم</th><td mat-cell *matCellDef="let r">{{r.name}}</td></ng-container>
          <ng-container matColumnDef="area"><th mat-header-cell *matHeaderCellDef>المنطقة</th><td mat-cell *matCellDef="let r">{{r.area || '-'}}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>الحالة</th><td mat-cell *matCellDef="let r">
            <mat-icon [style.color]="r.status===1?'#4caf50':'#f44336'">{{r.status===1?'check_circle':'cancel'}}</mat-icon>
          </td></ng-container>
          <tr mat-header-row *matHeaderRowDef="['nog','name','area','status']"></tr>
          <tr mat-row *matRowDef="let row; columns: ['nog','name','area','status'];"></tr>
        </table>
        <div style="margin-top:1rem;display:flex;gap:1rem;flex-wrap:wrap;align-items:end">
          <mat-form-field appearance="outline"><mat-label>رقم المجموعة</mat-label><input matInput type="number" [(ngModel)]="newGroup.nog"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>الاسم</mat-label><input matInput [(ngModel)]="newGroup.name"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>المنطقة</mat-label><input matInput [(ngModel)]="newGroup.area"></mat-form-field>
          <button mat-flat-button color="primary" (click)="createGroup()"><mat-icon>add</mat-icon> إضافة مجموعة</button>
        </div>
      </mat-card>

      <!-- المحصلين -->
      <mat-card style="margin:1rem 0;padding:1.5rem">
        <h3><mat-icon>person_pin</mat-icon> المحصلين</h3>
        <table mat-table [dataSource]="collectors()" style="width:100%">
          <ng-container matColumnDef="nomk2"><th mat-header-cell *matHeaderCellDef>الرقم</th><td mat-cell *matCellDef="let r">{{r.nomk2}}</td></ng-container>
          <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>الاسم</th><td mat-cell *matCellDef="let r">{{r.name}}</td></ng-container>
          <ng-container matColumnDef="mobile"><th mat-header-cell *matHeaderCellDef>الهاتف</th><td mat-cell *matCellDef="let r">{{r.mobile || '-'}}</td></ng-container>
          <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>الحالة</th><td mat-cell *matCellDef="let r">
            <mat-icon [style.color]="r.status===1?'#4caf50':'#f44336'">{{r.status===1?'check_circle':'cancel'}}</mat-icon>
          </td></ng-container>
          <tr mat-header-row *matHeaderRowDef="['nomk2','name','mobile','status']"></tr>
          <tr mat-row *matRowDef="let row; columns: ['nomk2','name','mobile','status'];"></tr>
        </table>
        <div style="margin-top:1rem;display:flex;gap:1rem;flex-wrap:wrap;align-items:end">
          <mat-form-field appearance="outline"><mat-label>الاسم</mat-label><input matInput [(ngModel)]="newCollector.name"></mat-form-field>
          <mat-form-field appearance="outline"><mat-label>الهاتف</mat-label><input matInput [(ngModel)]="newCollector.mobile"></mat-form-field>
          <button mat-flat-button color="primary" (click)="createCollector()"><mat-icon>add</mat-icon> إضافة محصل</button>
        </div>
      </mat-card>

      <!-- المراكز -->
      <mat-card style="margin:1rem 0;padding:1.5rem">
        <h3><mat-icon>business</mat-icon> المراكز الكهربائية</h3>
        <table mat-table [dataSource]="centers()" style="width:100%">
          <ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef>#</th><td mat-cell *matCellDef="let r">{{r.id}}</td></ng-container>
          <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>الاسم</th><td mat-cell *matCellDef="let r">{{r.name}}</td></ng-container>
          <ng-container matColumnDef="location"><th mat-header-cell *matHeaderCellDef>الموقع</th><td mat-cell *matCellDef="let r">{{r.location || '-'}}</td></ng-container>
          <ng-container matColumnDef="type"><th mat-header-cell *matHeaderCellDef>النوع</th><td mat-cell *matCellDef="let r">{{r.type || '-'}}</td></ng-container>
          <tr mat-header-row *matHeaderRowDef="['id','name','location','type']"></tr>
          <tr mat-row *matRowDef="let row; columns: ['id','name','location','type'];"></tr>
        </table>
        <p *ngIf="!centers()?.length" style="text-align:center;color:#999;padding:1rem">لا توجد مراكز مسجلة</p>
      </mat-card>
    </div>
  `,
  styles: [electricityPageStyles, `.metric-row { display:flex;justify-content:space-between;padding:0.3rem 0; }`],
})
export class CentersComponent implements OnInit {
  groups = signal<any[]>([]);
  collectors = signal<any[]>([]);
  centers = signal<any[]>([]);
  groupStats = signal<any>(null);
  newGroup: any = { nog: null, name: '', area: '' };
  newCollector: any = { name: '', mobile: '' };

  constructor(private svc: ElectricityWorkflowService, private snack: MatSnackBar) {}
  ngOnInit() { this.loadAll(); }

  loadAll() {
    this.svc.getGroups().subscribe(r => this.groups.set(r.data || []));
    this.svc.getCollectors().subscribe(r => this.collectors.set(r.data || []));
    this.svc.getLegacyCenters().subscribe(r => this.centers.set(r.data || []));
    this.svc.getGroupStats().subscribe(r => this.groupStats.set(r.data));
  }

  createGroup() {
    if (!this.newGroup.name) return;
    this.svc.createGroup(this.newGroup).subscribe({ next: r => {
      this.snack.open(r.message, 'حسناً', { duration: 3000 }); this.loadAll(); this.newGroup = { nog: null, name: '', area: '' };
    }, error: e => this.snack.open(e.error?.message || 'خطأ', 'حسناً', { duration: 3000 }) });
  }

  createCollector() {
    if (!this.newCollector.name) return;
    this.svc.createCollector(this.newCollector).subscribe({ next: r => {
      this.snack.open(r.message, 'حسناً', { duration: 3000 }); this.loadAll(); this.newCollector = { name: '', mobile: '' };
    }, error: e => this.snack.open(e.error?.message || 'خطأ', 'حسناً', { duration: 3000 }) });
  }
}
