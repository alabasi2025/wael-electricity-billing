// ===============================================
// دليل الحسابات (Chart of Accounts Component)
// ===============================================
import { Component, OnInit, signal } from '@angular/core';

import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { AccountsService } from '../../../core/services/domain.services';
import { ChartOfAccount } from '../../../core/models';

interface AccountNode {
  no_a: number;
  name_a: string;
  rep_a: string;
  ts: number;
  children?: AccountNode[];
}

@Component({
    selector: 'app-chart-of-accounts',
    imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatChipsModule,
    MatTooltipModule,
    MatTreeModule
],
    template: `
    <div class="page-container" dir="rtl">
      <!-- رأس الصفحة -->
      <div class="page-header">
        <div class="header-info">
          <h2><mat-icon>account_tree</mat-icon> دليل الحسابات الرئيسي</h2>
          <p>إدارة الحسابات الرئيسية وتصنيفاتها - مطابق لجدول DATA_A</p>
        </div>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="toggleForm()">
            <mat-icon>add</mat-icon>
            حساب جديد
          </button>
          <button mat-stroked-button (click)="viewMode.set(viewMode() === 'table' ? 'tree' : 'table')">
            <mat-icon>{{ viewMode() === 'table' ? 'account_tree' : 'table_chart' }}</mat-icon>
            {{ viewMode() === 'table' ? 'عرض شجري' : 'عرض جدول' }}
          </button>
        </div>
      </div>

      <!-- نموذج الإضافة/التعديل -->
      @if (showForm()) {
        <mat-card class="form-card">
          <mat-card-header>
            <mat-card-title>{{ editMode() ? 'تعديل حساب' : 'إضافة حساب جديد' }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <form [formGroup]="accountForm" (ngSubmit)="onSave()" class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>رقم الحساب (NO_A)</mat-label>
                <input matInput formControlName="no_a" type="number">
                <mat-error>رقم الحساب مطلوب</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>اسم الحساب (NAME_A)</mat-label>
                <input matInput formControlName="name_a">
                <mat-error>اسم الحساب مطلوب</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>التقرير المرتبط (REP_A)</mat-label>
                <input matInput formControlName="rep_a">
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>نوع الحساب (TS)</mat-label>
                <mat-select formControlName="ts">
                  <mat-option [value]="0">أصول</mat-option>
                  <mat-option [value]="1">خصوم</mat-option>
                  <mat-option [value]="2">إيرادات</mat-option>
                  <mat-option [value]="3">مصروفات</mat-option>
                  <mat-option [value]="4">حقوق ملكية</mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>التصنيف (TYPEA)</mat-label>
                <input matInput formControlName="typea" type="number">
              </mat-form-field>

              <div class="form-actions">
                <button mat-raised-button color="primary" type="submit" [disabled]="accountForm.invalid">
                  <mat-icon>save</mat-icon>
                  {{ editMode() ? 'تحديث' : 'حفظ' }}
                </button>
                <button mat-stroked-button type="button" (click)="cancelForm()">
                  <mat-icon>cancel</mat-icon>
                  إلغاء
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      }

      <!-- شريط البحث -->
      <mat-card class="search-card">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>بحث في الحسابات</mat-label>
          <input matInput [(ngModel)]="searchQuery" (input)="onSearch()" placeholder="ابحث بالرقم أو الاسم...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </mat-card>

      <!-- عرض الجدول -->
      @if (viewMode() === 'table') {
        <mat-card class="table-card">
          <table mat-table [dataSource]="accounts()" class="full-width-table">
            <ng-container matColumnDef="no_a">
              <th mat-header-cell *matHeaderCellDef>رقم الحساب</th>
              <td mat-cell *matCellDef="let account">
                <span class="account-number">{{ account.no_a }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="name_a">
              <th mat-header-cell *matHeaderCellDef>اسم الحساب</th>
              <td mat-cell *matCellDef="let account">
                <strong>{{ account.name_a }}</strong>
              </td>
            </ng-container>

            <ng-container matColumnDef="ts">
              <th mat-header-cell *matHeaderCellDef>النوع</th>
              <td mat-cell *matCellDef="let account">
                <mat-chip [class]="'type-' + account.ts">
                  {{ getTypeName(account.ts) }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="typea">
              <th mat-header-cell *matHeaderCellDef>التصنيف</th>
              <td mat-cell *matCellDef="let account">{{ account.typea }}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>الإجراءات</th>
              <td mat-cell *matCellDef="let account">
                <button mat-icon-button color="primary" matTooltip="تعديل" (click)="editAccount(account)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" matTooltip="حذف" (click)="deleteAccount(account)">
                  <mat-icon>delete</mat-icon>
                </button>
                <button mat-icon-button matTooltip="كشف حساب" routerLink="/reports/account-statement"
                        [queryParams]="{account: account.no_a}">
                  <mat-icon>summarize</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
          </table>

          <mat-paginator [length]="totalAccounts()"
                         [pageSize]="pageSize"
                         [pageSizeOptions]="[10, 25, 50, 100]"
                         (page)="onPageChange($event)">
          </mat-paginator>
        </mat-card>
      }

      <!-- عرض شجري -->
      @if (viewMode() === 'tree') {
        <mat-card class="tree-card">
          <mat-tree [dataSource]="treeDataSource" [treeControl]="treeControl">
            <mat-tree-node *matTreeNodeDef="let node" matTreeNodeToggle>
              <li class="tree-node">
                <mat-icon class="tree-icon leaf">description</mat-icon>
                <span class="tree-number">{{ node.no_a }}</span>
                <span class="tree-name">{{ node.name_a }}</span>
              </li>
            </mat-tree-node>
            <mat-nested-tree-node *matTreeNodeDef="let node; when: hasChild">
              <li>
                <div class="tree-node" matTreeNodeToggle>
                  <mat-icon class="tree-icon">
                    {{ treeControl.isExpanded(node) ? 'folder_open' : 'folder' }}
                  </mat-icon>
                  <span class="tree-number">{{ node.no_a }}</span>
                  <strong class="tree-name">{{ node.name_a }}</strong>
                  <mat-chip class="tree-count">{{ node.children?.length || 0 }} فرعي</mat-chip>
                </div>
                <ul [class.tree-hidden]="!treeControl.isExpanded(node)">
                  <ng-container matTreeNodeOutlet></ng-container>
                </ul>
              </li>
            </mat-nested-tree-node>
          </mat-tree>
        </mat-card>
      }
    </div>
  `,
    styles: [`
    .page-container { display: flex; flex-direction: column; gap: 16px; }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }

    .page-header h2 {
      display: flex; align-items: center; gap: 8px;
      color: #1a237e; margin: 0;
    }

    .page-header p { color: #757575; margin: 4px 0 0; font-size: 14px; }
    .header-actions { display: flex; gap: 8px; }

    .form-card, .search-card, .table-card, .tree-card {
      border-radius: 12px;
      padding: 16px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 12px;
      align-items: start;
    }

    .form-actions {
      grid-column: 1 / -1;
      display: flex; gap: 8px;
    }

    .search-field { width: 100%; }
    .full-width-table { width: 100%; }

    .account-number {
      background: #e8eaf6;
      padding: 4px 12px;
      border-radius: 20px;
      font-weight: 600;
      color: #1a237e;
    }

    .type-0 { background: #e3f2fd !important; color: #1565c0 !important; }
    .type-1 { background: #fce4ec !important; color: #c62828 !important; }
    .type-2 { background: #e8f5e9 !important; color: #2e7d32 !important; }
    .type-3 { background: #fff3e0 !important; color: #e65100 !important; }
    .type-4 { background: #f3e5f5 !important; color: #6a1b9a !important; }

    .table-row:hover { background: #f5f5f5; }

    .tree-node {
      display: flex; align-items: center; gap: 8px;
      padding: 8px 12px; cursor: pointer;
      border-radius: 8px;
      transition: background 0.2s;
    }

    .tree-node:hover { background: #e8eaf6; }
    .tree-icon { color: #ffa000; }
    .tree-icon.leaf { color: #66bb6a; }
    .tree-number { color: #1a237e; font-weight: 600; min-width: 40px; }
    .tree-name { color: #333; }
    .tree-count { font-size: 11px; }
    .tree-hidden { display: none; }
    ul { list-style: none; padding-right: 20px; }
    li { list-style: none; }
  `]
})
export class ChartOfAccountsComponent implements OnInit {
  displayedColumns = ['no_a', 'name_a', 'ts', 'typea', 'actions'];
  accounts = signal<ChartOfAccount[]>([]);
  totalAccounts = signal(0);
  pageSize = 25;
  searchQuery = '';
  showForm = signal(false);
  editMode = signal(false);
  viewMode = signal<'table' | 'tree'>('table');
  accountForm: FormGroup;

  treeControl = new NestedTreeControl<AccountNode>(node => node.children);
  treeDataSource = new MatTreeNestedDataSource<AccountNode>();
  hasChild = (_: number, node: AccountNode) => !!node.children && node.children.length > 0;

  constructor(private fb: FormBuilder, private accountsService: AccountsService) {
    this.accountForm = this.fb.group({
      no_a: ['', Validators.required],
      name_a: ['', Validators.required],
      rep_a: [''],
      ts: [0],
      typea: [0],
    });
  }

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(page = 1): void {
    this.accountsService.getChartOfAccounts({ page, pageSize: this.pageSize, search: this.searchQuery }).subscribe({
      next: (res) => {
        if (res.success) {
          this.accounts.set(res.data);
          this.totalAccounts.set(res.totalCount || 0);
        }
      }
    });
  }

  onSearch(): void { this.loadAccounts(1); }
  onPageChange(event: PageEvent): void { this.loadAccounts(event.pageIndex + 1); }

  toggleForm(): void {
    this.showForm.set(!this.showForm());
    this.editMode.set(false);
    this.accountForm.reset();
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.accountForm.reset();
  }

  editAccount(account: ChartOfAccount): void {
    this.showForm.set(true);
    this.editMode.set(true);
    this.accountForm.patchValue(account);
  }

  onSave(): void {
    if (this.accountForm.invalid) return;
    const data = this.accountForm.value;
    const obs = this.editMode()
      ? this.accountsService.updateChartOfAccount(data.no_a, data)
      : this.accountsService.createChartOfAccount(data);
    obs.subscribe({ next: () => { this.loadAccounts(); this.cancelForm(); } });
  }

  deleteAccount(account: ChartOfAccount): void {
    if (confirm(`هل تريد حذف الحساب "${account.name_a}"؟`)) {
      this.accountsService.deleteChartOfAccount(account.no_a).subscribe({
        next: () => this.loadAccounts()
      });
    }
  }

  getTypeName(ts: number): string {
    const types: Record<number, string> = { 0: 'أصول', 1: 'خصوم', 2: 'إيرادات', 3: 'مصروفات', 4: 'حقوق ملكية' };
    return types[ts] || 'غير محدد';
  }
}
