// ===============================================
// لوحة التحكم (Dashboard Component)
// ===============================================
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
    selector: 'app-dashboard',
    imports: [
        CommonModule, RouterModule,
        MatCardModule, MatIconModule, MatButtonModule,
        MatTableModule, MatChipsModule, MatProgressBarModule, MatGridListModule
    ],
    template: `
    <div class="dashboard" dir="rtl">
      <!-- بطاقات الإحصائيات -->
      <div class="stats-grid">
        @for (stat of stats(); track stat.label) {
          <mat-card class="stat-card" [style.border-right-color]="stat.color">
            <div class="stat-content">
              <div class="stat-info">
                <span class="stat-label">{{ stat.label }}</span>
                <span class="stat-value">{{ stat.value | number }}</span>
                <span class="stat-change" [class.positive]="stat.change > 0" [class.negative]="stat.change < 0">
                  <mat-icon>{{ stat.change > 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
                  {{ stat.change }}%
                </span>
              </div>
              <div class="stat-icon" [style.background]="stat.color + '20'" [style.color]="stat.color">
                <mat-icon>{{ stat.icon }}</mat-icon>
              </div>
            </div>
          </mat-card>
        }
      </div>

      <!-- الصف الثاني: الرسم البياني + آخر العمليات -->
      <div class="dashboard-row">
        <!-- الرسم البياني -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>bar_chart</mat-icon>
              الإيرادات والمصروفات الشهرية
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="chart-placeholder">
              <div class="chart-bars">
                @for (month of monthlyData; track month.name) {
                  <div class="chart-bar-group">
                    <div class="bar revenue" [style.height.px]="month.revenue / maxValue * 200"></div>
                    <div class="bar expense" [style.height.px]="month.expense / maxValue * 200"></div>
                    <span class="bar-label">{{ month.name }}</span>
                  </div>
                }
              </div>
              <div class="chart-legend">
                <span class="legend-item"><span class="dot revenue-dot"></span> الإيرادات</span>
                <span class="legend-item"><span class="dot expense-dot"></span> المصروفات</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- آخر السندات -->
        <mat-card class="recent-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>history</mat-icon>
              آخر السندات
            </mat-card-title>
            <button mat-button color="primary" routerLink="/vouchers/list">عرض الكل</button>
          </mat-card-header>
          <mat-card-content>
            <div class="recent-list">
              @for (voucher of recentVouchers; track voucher.nos) {
                <div class="recent-item">
                  <div class="recent-icon" [class]="voucher.type">
                    <mat-icon>{{ voucher.type === 'receipt' ? 'arrow_downward' : 'arrow_upward' }}</mat-icon>
                  </div>
                  <div class="recent-info">
                    <span class="recent-name">{{ voucher.namea }}</span>
                    <span class="recent-date">{{ voucher.dates }}</span>
                  </div>
                  <div class="recent-amount" [class]="voucher.type">
                    {{ voucher.totals | number }} د.ع
                  </div>
                </div>
              }
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- الصف الثالث: أزرار سريعة -->
      <div class="quick-actions">
        <h3><mat-icon>flash_on</mat-icon> الوصول السريع</h3>
        <div class="actions-grid">
          @for (action of quickActions; track action.label) {
            <a [routerLink]="action.route" class="action-card" [style.border-color]="action.color">
              <mat-icon [style.color]="action.color">{{ action.icon }}</mat-icon>
              <span>{{ action.label }}</span>
            </a>
          }
        </div>
      </div>

      <!-- آخر القيود -->
      <mat-card class="table-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>receipt_long</mat-icon>
            آخر القيود المحاسبية
          </mat-card-title>
          <button mat-button color="primary" routerLink="/journal/list">عرض الكل</button>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="recentEntries" class="entries-table">
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>التاريخ</th>
              <td mat-cell *matCellDef="let entry">{{ entry.date }}</td>
            </ng-container>
            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>البيان</th>
              <td mat-cell *matCellDef="let entry">{{ entry.description }}</td>
            </ng-container>
            <ng-container matColumnDef="debit">
              <th mat-header-cell *matHeaderCellDef>مدين</th>
              <td mat-cell *matCellDef="let entry" class="amount debit">{{ entry.debit | number }}</td>
            </ng-container>
            <ng-container matColumnDef="credit">
              <th mat-header-cell *matHeaderCellDef>دائن</th>
              <td mat-cell *matCellDef="let entry" class="amount credit">{{ entry.credit | number }}</td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>الحالة</th>
              <td mat-cell *matCellDef="let entry">
                <mat-chip [class]="entry.status === 'مرحّل' ? 'posted' : 'pending'">
                  {{ entry.status }}
                </mat-chip>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
    styles: [`
    .dashboard { display: flex; flex-direction: column; gap: 20px; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    .stat-card {
      border-radius: 12px;
      border-right: 4px solid;
      padding: 20px;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.12);
    }

    .stat-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .stat-label { font-size: 13px; color: #757575; }
    .stat-value { font-size: 28px; font-weight: 700; color: #1a237e; }
    .stat-change { font-size: 12px; display: flex; align-items: center; gap: 2px; }
    .stat-change mat-icon { font-size: 16px; width: 16px; height: 16px; }
    .stat-change.positive { color: #2e7d32; }
    .stat-change.negative { color: #c62828; }

    .stat-icon {
      width: 56px; height: 56px;
      border-radius: 16px;
      display: flex; align-items: center; justify-content: center;
    }

    .stat-icon mat-icon { font-size: 28px; }

    .dashboard-row {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 16px;
    }

    .chart-card, .recent-card, .table-card {
      border-radius: 12px;
      padding: 16px;
    }

    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      color: #1a237e;
    }

    .chart-bars {
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      height: 220px;
      padding: 10px 0;
    }

    .chart-bar-group {
      display: flex;
      gap: 4px;
      align-items: flex-end;
      text-align: center;
    }

    .bar {
      width: 20px;
      border-radius: 4px 4px 0 0;
      transition: height 0.5s ease;
    }

    .bar.revenue { background: linear-gradient(180deg, #1a237e, #3f51b5); }
    .bar.expense { background: linear-gradient(180deg, #c62828, #ef5350); }
    .bar-label { font-size: 11px; color: #757575; display: block; margin-top: 4px; }

    .chart-legend {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 12px;
    }

    .legend-item { font-size: 12px; display: flex; align-items: center; gap: 4px; }
    .dot { width: 10px; height: 10px; border-radius: 50%; }
    .revenue-dot { background: #1a237e; }
    .expense-dot { background: #c62828; }

    .recent-list { display: flex; flex-direction: column; gap: 8px; }

    .recent-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px;
      border-radius: 8px;
      background: #fafafa;
      transition: background 0.2s;
    }

    .recent-item:hover { background: #e8eaf6; }

    .recent-icon {
      width: 40px; height: 40px;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
    }

    .recent-icon.receipt { background: #e8f5e9; color: #2e7d32; }
    .recent-icon.payment { background: #ffebee; color: #c62828; }

    .recent-info { flex: 1; display: flex; flex-direction: column; }
    .recent-name { font-size: 14px; font-weight: 500; }
    .recent-date { font-size: 12px; color: #9e9e9e; }
    .recent-amount { font-weight: 700; font-size: 14px; }
    .recent-amount.receipt { color: #2e7d32; }
    .recent-amount.payment { color: #c62828; }

    .quick-actions h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #1a237e;
      margin-bottom: 12px;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 12px;
    }

    .action-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 16px;
      border-radius: 12px;
      border: 2px solid;
      background: white;
      text-decoration: none;
      color: #333;
      transition: all 0.2s;
      cursor: pointer;
    }

    .action-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.1);
    }

    .action-card mat-icon { font-size: 32px; width: 32px; height: 32px; }
    .action-card span { font-size: 13px; font-weight: 500; text-align: center; }

    .entries-table { width: 100%; }
    .amount { font-weight: 600; }
    .amount.debit { color: #c62828; }
    .amount.credit { color: #2e7d32; }
    .posted { background: #e8f5e9 !important; color: #2e7d32 !important; }
    .pending { background: #fff3e0 !important; color: #e65100 !important; }
  `]
})
export class DashboardComponent implements OnInit {
  displayedColumns = ['date', 'description', 'debit', 'credit', 'status'];

  stats = signal([
    { label: 'إجمالي الحسابات', value: 1250, icon: 'account_balance', color: '#1a237e', change: 12 },
    { label: 'السندات اليوم', value: 45, icon: 'description', color: '#2e7d32', change: 8 },
    { label: 'الفواتير الشهرية', value: 320, icon: 'receipt', color: '#e65100', change: -3 },
    { label: 'صافي الربح', value: 15750000, icon: 'trending_up', color: '#6a1b9a', change: 15 },
  ]);

  monthlyData = [
    { name: 'يناير', revenue: 5000000, expense: 3000000 },
    { name: 'فبراير', revenue: 6200000, expense: 3500000 },
    { name: 'مارس', revenue: 5800000, expense: 4200000 },
    { name: 'أبريل', revenue: 7100000, expense: 3800000 },
    { name: 'مايو', revenue: 6500000, expense: 4000000 },
    { name: 'يونيو', revenue: 8200000, expense: 4500000 },
    { name: 'يوليو', revenue: 7800000, expense: 5100000 },
    { name: 'أغسطس', revenue: 9000000, expense: 4800000 },
    { name: 'سبتمبر', revenue: 8500000, expense: 5500000 },
    { name: 'أكتوبر', revenue: 7600000, expense: 4200000 },
    { name: 'نوفمبر', revenue: 8800000, expense: 5000000 },
    { name: 'ديسمبر', revenue: 9500000, expense: 5200000 },
  ];

  maxValue = 9500000;

  recentVouchers = [
    { nos: 1001, namea: 'شركة النور للكهرباء', dates: '2026-04-07', totals: 2500000, type: 'receipt' },
    { nos: 1002, namea: 'مؤسسة الطاقة المتجددة', dates: '2026-04-07', totals: 1800000, type: 'payment' },
    { nos: 1003, namea: 'محطة توليد البصرة', dates: '2026-04-06', totals: 3200000, type: 'receipt' },
    { nos: 1004, namea: 'شركة المحولات الكهربائية', dates: '2026-04-06', totals: 950000, type: 'payment' },
    { nos: 1005, namea: 'المشترك أحمد محمود', dates: '2026-04-05', totals: 125000, type: 'receipt' },
  ];

  recentEntries = [
    { date: '2026-04-07', description: 'تحصيل فاتورة كهرباء - شركة النور', debit: 2500000, credit: 0, status: 'مرحّل' },
    { date: '2026-04-07', description: 'سداد مستحقات مولد رقم 5', debit: 0, credit: 1800000, status: 'مرحّل' },
    { date: '2026-04-06', description: 'إيرادات تركيبات جديدة', debit: 3200000, credit: 0, status: 'معلّق' },
    { date: '2026-04-06', description: 'شراء محولات كهربائية', debit: 0, credit: 950000, status: 'مرحّل' },
    { date: '2026-04-05', description: 'رسوم اشتراك شهري', debit: 125000, credit: 0, status: 'معلّق' },
  ];

  quickActions = [
    { label: 'سند قبض', icon: 'arrow_downward', route: '/vouchers/receipt', color: '#2e7d32' },
    { label: 'سند صرف', icon: 'arrow_upward', route: '/vouchers/payment', color: '#c62828' },
    { label: 'قيد محاسبي', icon: 'post_add', route: '/journal/new', color: '#1a237e' },
    { label: 'فاتورة مبيعات', icon: 'point_of_sale', route: '/invoices/sales', color: '#e65100' },
    { label: 'كشف حساب', icon: 'summarize', route: '/reports/account-statement', color: '#6a1b9a' },
    { label: 'العدادات', icon: 'speed', route: '/electricity/meters', color: '#00695c' },
    { label: 'ميزان المراجعة', icon: 'balance', route: '/reports/trial-balance', color: '#4527a0' },
    { label: 'النسخ الاحتياطي', icon: 'backup', route: '/settings/backup', color: '#37474f' },
  ];

  ngOnInit(): void {
    // TODO: Load real dashboard data from DashboardService
  }
}
