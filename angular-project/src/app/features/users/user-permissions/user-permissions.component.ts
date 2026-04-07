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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../../core/services/api.service';
import { electricityPageStyles } from '../../electricity/electricity-page.styles';

@Component({
  selector: 'app-user-permissions',
  imports: [CommonModule, FormsModule, MatButtonModule, MatCardModule, MatIconModule, MatTableModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatSelectModule, MatTabsModule, MatTooltipModule],
  template: `
    <div class="electricity-page" dir="rtl">
      <section class="hero">
        <div class="hero-copy">
          <span class="hero-kicker">PRG + USERGN + menun / الصلاحيات</span>
          <h1>إدارة الأدوار والصلاحيات</h1>
          <p>إدارة أدوار المستخدمين وصلاحياتهم والقائمة الديناميكية - بديل شاشات USE_GN و menun القديمة.</p>
        </div>
      </section>

      <mat-tab-group>
        <!-- الأدوار -->
        <mat-tab label="👥 الأدوار">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>admin_panel_settings</mat-icon> الأدوار</h3>
            <table mat-table [dataSource]="roles()" style="width:100%">
              <ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef>#</th><td mat-cell *matCellDef="let r">{{r.id}}</td></ng-container>
              <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>الاسم</th><td mat-cell *matCellDef="let r"><strong>{{r.name}}</strong></td></ng-container>
              <ng-container matColumnDef="description"><th mat-header-cell *matHeaderCellDef>الوصف</th><td mat-cell *matCellDef="let r">{{r.description}}</td></ng-container>
              <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>إجراءات</th><td mat-cell *matCellDef="let r">
                <button mat-icon-button matTooltip="إدارة صلاحيات الدور" (click)="loadRolePermissions(r.id)"><mat-icon>security</mat-icon></button>
              </td></ng-container>
              <tr mat-header-row *matHeaderRowDef="['id','name','description','actions']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['id','name','description','actions'];" [class.selected]="selectedRoleId === row.id"></tr>
            </table>
            <div style="margin-top:1rem;display:flex;gap:1rem;align-items:end">
              <mat-form-field appearance="outline"><mat-label>اسم الدور</mat-label><input matInput [(ngModel)]="newRole.name"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>الوصف</mat-label><input matInput [(ngModel)]="newRole.description"></mat-form-field>
              <button mat-flat-button color="primary" (click)="createRole()"><mat-icon>add</mat-icon> إضافة دور</button>
            </div>
          </mat-card>

          <!-- صلاحيات الدور المحدد -->
          <mat-card *ngIf="selectedRoleId" style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>security</mat-icon> صلاحيات الدور #{{selectedRoleId}}</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:0.5rem">
              <div *ngFor="let p of allPermissions()" style="display:flex;align-items:center;gap:8px;padding:6px;border:1px solid #e0e0e0;border-radius:6px">
                <mat-checkbox [checked]="isPermissionAssigned(p.id)" (change)="togglePermission(p.id, $event.checked)"></mat-checkbox>
                <span><strong>{{p.module}}</strong>.{{p.action}}</span>
                <small style="color:#999">{{p.description}}</small>
              </div>
            </div>
          </mat-card>
        </mat-tab>

        <!-- ربط المستخدمين بالأدوار -->
        <mat-tab label="🔗 ربط المستخدمين">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>person_add</mat-icon> ربط مستخدم بدور</h3>
            <div style="display:flex;gap:1rem;align-items:end">
              <mat-form-field appearance="outline"><mat-label>رقم المستخدم</mat-label><input matInput type="number" [(ngModel)]="assignUserId"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>الدور</mat-label>
                <mat-select [(ngModel)]="assignRoleId">
                  <mat-option *ngFor="let r of roles()" [value]="r.id">{{r.name}}</mat-option>
                </mat-select>
              </mat-form-field>
              <button mat-flat-button color="primary" (click)="assignRole()"><mat-icon>link</mat-icon> ربط</button>
            </div>

            <h4 style="margin-top:2rem">عرض صلاحيات مستخدم:</h4>
            <div style="display:flex;gap:1rem;align-items:end">
              <mat-form-field appearance="outline"><mat-label>رقم المستخدم</mat-label><input matInput type="number" [(ngModel)]="viewUserId"></mat-form-field>
              <button mat-stroked-button (click)="loadUserPermissions()"><mat-icon>search</mat-icon> عرض</button>
            </div>
            <div *ngIf="userPermissions()?.length" style="margin-top:1rem">
              <div *ngFor="let p of userPermissions()" style="display:inline-block;margin:3px;padding:4px 12px;background:#e3f2fd;border-radius:20px;font-size:0.85rem">
                {{p.p_module}}.{{p.p_action}} <small style="color:#666">({{p.rolename}})</small>
              </div>
            </div>
          </mat-card>
        </mat-tab>

        <!-- الصلاحيات المتاحة -->
        <mat-tab label="🔐 كل الصلاحيات">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>vpn_key</mat-icon> قائمة الصلاحيات المتاحة ({{allPermissions()?.length || 0}})</h3>
            <table mat-table [dataSource]="allPermissions()" style="width:100%">
              <ng-container matColumnDef="id"><th mat-header-cell *matHeaderCellDef>#</th><td mat-cell *matCellDef="let r">{{r.id}}</td></ng-container>
              <ng-container matColumnDef="module"><th mat-header-cell *matHeaderCellDef>الوحدة</th><td mat-cell *matCellDef="let r"><strong>{{r.module}}</strong></td></ng-container>
              <ng-container matColumnDef="action"><th mat-header-cell *matHeaderCellDef>الإجراء</th><td mat-cell *matCellDef="let r">{{r.action}}</td></ng-container>
              <ng-container matColumnDef="description"><th mat-header-cell *matHeaderCellDef>الوصف</th><td mat-cell *matCellDef="let r">{{r.description}}</td></ng-container>
              <tr mat-header-row *matHeaderRowDef="['id','module','action','description']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['id','module','action','description'];"></tr>
            </table>
          </mat-card>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [electricityPageStyles, `.selected { background:#e3f2fd !important; }`],
})
export class UserPermissionsComponent implements OnInit {
  roles = signal<any[]>([]);
  allPermissions = signal<any[]>([]);
  rolePermissions = signal<number[]>([]);
  userPermissions = signal<any[]>([]);
  selectedRoleId: number | null = null;
  newRole = { name: '', description: '' };
  assignUserId = 0; assignRoleId = 0; viewUserId = 0;

  constructor(private api: ApiService, private snack: MatSnackBar) {}
  ngOnInit() { this.loadAll(); }

  loadAll() {
    this.api.get('permissions/roles').subscribe((r: any) => this.roles.set(r.data || []));
    this.api.get('permissions/permissions').subscribe((r: any) => this.allPermissions.set(r.data || []));
  }

  createRole() {
    this.api.post('permissions/roles', this.newRole).subscribe((r: any) => {
      this.snack.open(r.message, 'حسناً', { duration: 3000 }); this.loadAll(); this.newRole = { name: '', description: '' };
    });
  }

  loadRolePermissions(roleId: number) {
    this.selectedRoleId = roleId;
    this.api.get(`permissions/roles/${roleId}/permissions`).subscribe((r: any) => {
      this.rolePermissions.set((r.data || []).map((p: any) => p.p_id || p.id));
    });
  }

  isPermissionAssigned(permId: number): boolean { return this.rolePermissions().includes(permId); }

  togglePermission(permId: number, checked: boolean) {
    if (checked) {
      this.api.post(`permissions/roles/${this.selectedRoleId}/permissions/${permId}`, {}).subscribe(() => this.loadRolePermissions(this.selectedRoleId!));
    } else {
      this.api.delete(`permissions/roles/${this.selectedRoleId}/permissions/${permId}`).subscribe(() => this.loadRolePermissions(this.selectedRoleId!));
    }
  }

  assignRole() {
    this.api.post(`permissions/users/${this.assignUserId}/roles/${this.assignRoleId}`, {}).subscribe((r: any) => {
      this.snack.open(r.message, 'حسناً', { duration: 3000 });
    });
  }

  loadUserPermissions() {
    this.api.get(`permissions/users/${this.viewUserId}`).subscribe((r: any) => this.userPermissions.set(r.data || []));
  }
}
