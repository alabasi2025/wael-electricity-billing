// ===============================================
// التخطيط الرئيسي (Main Layout) + القائمة الجانبية
// ===============================================
import { Component, signal, ViewChild } from '@angular/core';

import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
import { LEGACY_FORMS_COUNT } from '../../features/legacy/legacy-forms.data';
import { filter } from 'rxjs/operators';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
  permission?: string;
  badge?: number;
}

@Component({
    selector: 'app-main-layout',
    imports: [
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatExpansionModule,
    MatBadgeModule,
    MatTooltipModule,
    MatDividerModule
],
    template: `
    <div class="app-container" dir="rtl">
      <!-- الشريط العلوي -->
      <mat-toolbar class="app-toolbar" color="primary">
        <button mat-icon-button (click)="sidenav.toggle()" matTooltip="القائمة">
          <mat-icon>menu</mat-icon>
        </button>
    
        <div class="toolbar-logo">
          <mat-icon>bolt</mat-icon>
          <span class="app-title">النظام المحاسبي - الطاقة الكهربائية</span>
        </div>
    
        <span class="toolbar-spacer"></span>
    
        <!-- أزرار سريعة -->
        <button mat-icon-button matTooltip="سند قبض جديد" routerLink="/vouchers/receipt/new">
          <mat-icon>add_card</mat-icon>
        </button>
        <button mat-icon-button matTooltip="قيد جديد" routerLink="/journal/new">
          <mat-icon>post_add</mat-icon>
        </button>
        <button mat-icon-button matTooltip="فاتورة جديدة" routerLink="/invoices/sales">
          <mat-icon>receipt</mat-icon>
        </button>
    
        <mat-divider vertical class="toolbar-divider"></mat-divider>
    
        <!-- المستخدم -->
        <button mat-button [matMenuTriggerFor]="userMenu" class="user-button">
          <mat-icon>account_circle</mat-icon>
          <span>{{ authService.currentUser()?.nameu || 'مستخدم' }}</span>
          <mat-icon>arrow_drop_down</mat-icon>
        </button>
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item routerLink="/settings/system">
            <mat-icon>settings</mat-icon>
            <span>الإعدادات</span>
          </button>
          <button mat-menu-item (click)="authService.logout()">
            <mat-icon>logout</mat-icon>
            <span>تسجيل خروج</span>
          </button>
        </mat-menu>
      </mat-toolbar>
    
      <!-- المحتوى + القائمة الجانبية -->
      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #sidenav mode="side" opened position="start" class="app-sidenav">
          <div class="sidenav-header">
            <div class="company-logo">
              <mat-icon>bolt</mat-icon>
            </div>
            <h3>القائمة الرئيسية</h3>
          </div>
    
          <mat-nav-list class="nav-list">
            @for (item of menuItems; track item.label) {
              @if (item.children) {
                <mat-expansion-panel class="nav-panel" [class.active-panel]="isActiveParent(item)">
                  <mat-expansion-panel-header>
                    <mat-panel-title>
                      <mat-icon class="nav-icon">{{ item.icon }}</mat-icon>
                      <span>{{ item.label }}</span>
                    </mat-panel-title>
                  </mat-expansion-panel-header>
                  @for (child of item.children; track child.label) {
                    <a mat-list-item [routerLink]="child.route" routerLinkActive="active-link"
                      class="child-link">
                      <mat-icon matListItemIcon>{{ child.icon }}</mat-icon>
                      <span matListItemTitle>{{ child.label }}</span>
                      @if (child.badge) {
                        <span matListItemMeta class="badge">{{ child.badge }}</span>
                      }
                    </a>
                  }
                </mat-expansion-panel>
              } @else {
                <a mat-list-item [routerLink]="item.route" routerLinkActive="active-link" class="nav-link">
                  <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
                  <span matListItemTitle>{{ item.label }}</span>
                </a>
              }
            }
          </mat-nav-list>
    
          <div class="sidenav-footer">
            <small>الإصدار 2.0 - Angular</small>
          </div>
        </mat-sidenav>
    
        <mat-sidenav-content class="main-content">
          <div class="content-wrapper">
            <!-- مسار الصفحة -->
            @if (currentPageTitle()) {
              <div class="breadcrumb">
                <mat-icon>home</mat-icon>
                <span>الرئيسية</span>
                <mat-icon>chevron_left</mat-icon>
                <span class="current-page">{{ currentPageTitle() }}</span>
              </div>
            }
    
            <!-- المحتوى -->
            <router-outlet></router-outlet>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
    `,
    styles: [`
    .app-container { display: flex; flex-direction: column; height: 100vh; }

    .app-toolbar {
      position: sticky; top: 0; z-index: 100;
      background: linear-gradient(135deg, #1a237e, #0d47a1);
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }

    .toolbar-logo {
      display: flex; align-items: center; gap: 8px;
      margin-right: 12px;
    }

    .toolbar-logo mat-icon { color: #ffd600; font-size: 28px; }
    .app-title { font-size: 16px; font-weight: 500; }
    .toolbar-spacer { flex: 1; }
    .toolbar-divider { height: 24px; margin: 0 8px; }

    .user-button {
      display: flex; align-items: center; gap: 4px;
      color: white;
    }

    .sidenav-container {
      flex: 1;
      background: #f5f7fa;
    }

    .app-sidenav {
      width: 280px;
      background: #ffffff;
      border-left: 1px solid #e0e0e0;
      box-shadow: 2px 0 10px rgba(0,0,0,0.05);
    }

    .sidenav-header {
      padding: 20px;
      text-align: center;
      background: linear-gradient(135deg, #e8eaf6, #c5cae9);
      border-bottom: 1px solid #e0e0e0;
    }

    .company-logo {
      width: 50px; height: 50px; margin: 0 auto 8px;
      background: linear-gradient(135deg, #ffd600, #ff6f00);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
    }

    .company-logo mat-icon { color: white; font-size: 28px; }
    .sidenav-header h3 { margin: 0; color: #1a237e; font-size: 15px; }

    .nav-list { padding: 8px 0; }

    .nav-link, .child-link {
      margin: 2px 8px;
      border-radius: 8px !important;
      transition: all 0.2s;
    }

    .nav-link:hover, .child-link:hover {
      background: #e8eaf6 !important;
    }

    .active-link {
      background: linear-gradient(135deg, #1a237e, #283593) !important;
      color: white !important;
    }

    .active-link mat-icon { color: #ffd600 !important; }

    .nav-panel {
      box-shadow: none !important;
      margin: 2px 8px;
      border-radius: 8px !important;
    }

    .nav-icon { margin-left: 8px; font-size: 20px; color: #5c6bc0; }

    .badge {
      background: #f44336;
      color: white;
      border-radius: 10px;
      padding: 2px 8px;
      font-size: 11px;
    }

    .sidenav-footer {
      padding: 12px;
      text-align: center;
      border-top: 1px solid #e0e0e0;
      color: #9e9e9e;
    }

    .main-content {
      background: #f5f7fa;
    }

    .content-wrapper {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-bottom: 16px;
      padding: 8px 16px;
      background: white;
      border-radius: 8px;
      font-size: 14px;
      color: #757575;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .breadcrumb .current-page { color: #1a237e; font-weight: 500; }
  `]
})
export class MainLayoutComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  currentPageTitle = signal('');

  menuItems: MenuItem[] = [
    { label: 'لوحة التحكم', icon: 'dashboard', route: '/dashboard' },
    { label: 'شاشات النظام القديم', icon: 'history', route: '/legacy', badge: LEGACY_FORMS_COUNT },
    {
      label: 'الحسابات', icon: 'account_balance',
      children: [
        { label: 'دليل الحسابات', icon: 'account_tree', route: '/accounts/chart' },
        { label: 'الحسابات الفرعية', icon: 'list_alt', route: '/accounts/sub-accounts' },
        { label: 'أنواع الحسابات', icon: 'category', route: '/accounts/types' },
        { label: 'المجموعات', icon: 'folder', route: '/accounts/groups' },
      ]
    },
    {
      label: 'القيود المحاسبية', icon: 'receipt_long',
      children: [
        { label: 'عرض القيود', icon: 'list', route: '/journal/list' },
        { label: 'قيد جديد', icon: 'add_circle', route: '/journal/new' },
        { label: 'أصناف القيود', icon: 'label', route: '/journal/categories' },
      ]
    },
    {
      label: 'السندات', icon: 'description',
      children: [
        { label: 'سند قبض', icon: 'arrow_downward', route: '/vouchers/receipt' },
        { label: 'سند صرف', icon: 'arrow_upward', route: '/vouchers/payment' },
        { label: 'سند يومي', icon: 'today', route: '/vouchers/daily' },
        { label: 'سند شبكة', icon: 'lan', route: '/vouchers/net' },
        { label: 'عرض السندات', icon: 'list', route: '/vouchers/list' },
      ]
    },
    {
      label: 'الفواتير', icon: 'receipt',
      children: [
        { label: 'فاتورة مبيعات', icon: 'point_of_sale', route: '/invoices/sales' },
        { label: 'فاتورة مشتريات', icon: 'shopping_cart', route: '/invoices/purchase' },
        { label: 'عرض الفواتير', icon: 'list', route: '/invoices/list' },
      ]
    },
    {
      label: 'إدارة الكهرباء', icon: 'bolt',
      children: [
        { label: 'دورة الكهرباء', icon: 'hub', route: '/electricity/overview' },
        { label: 'بيانات المشتركين', icon: 'people', route: '/electricity/subscribers' },
        { label: 'قراءات العدادات', icon: 'speed', route: '/electricity/readings' },
        { label: 'الفوترة الشهرية', icon: 'receipt_long', route: '/electricity/billing' },
        { label: 'اعتماد الفوترة', icon: 'published_with_changes', route: '/electricity/posting' },
        { label: 'التحصيل والسداد', icon: 'payments', route: '/electricity/collections' },
        { label: 'الرسائل والمتابعة', icon: 'sms', route: '/electricity/messages' },
        { label: 'تقارير الكهرباء', icon: 'assessment', route: '/electricity/reports' },
        { label: 'سجل العدادات', icon: 'pin', route: '/electricity/meters' },
        { label: 'التركيبات', icon: 'build', route: '/electricity/installations' },
        { label: 'المولدات', icon: 'power', route: '/electricity/generators' },
        { label: 'المراكز', icon: 'location_city', route: '/electricity/centers' },
      ]
    },
    {
      label: 'الإقفالات', icon: 'lock',
      children: [
        { label: 'إقفال شهري', icon: 'date_range', route: '/closing/monthly' },
        { label: 'إقفال سنوي', icon: 'event', route: '/closing/yearly' },
        { label: 'عرض الإقفالات', icon: 'list', route: '/closing/list' },
      ]
    },
    {
      label: 'الموظفين', icon: 'people',
      children: [
        { label: 'قائمة الموظفين', icon: 'person', route: '/employees/list' },
        { label: 'إضافة موظف', icon: 'person_add', route: '/employees/new' },
        { label: 'الحضور والغياب', icon: 'schedule', route: '/employees/absence' },
      ]
    },
    { label: 'الأمانات', icon: 'savings', route: '/deposits/list' },
    {
      label: 'التقارير', icon: 'assessment',
      children: [
        { label: 'التقرير اليومي', icon: 'today', route: '/reports/daily' },
        { label: 'كشف حساب', icon: 'summarize', route: '/reports/account-statement' },
        { label: 'تقرير السندات', icon: 'description', route: '/reports/voucher-report' },
        { label: 'تقرير الفواتير', icon: 'receipt', route: '/reports/invoice-report' },
        { label: 'ميزان المراجعة', icon: 'balance', route: '/reports/trial-balance' },
        { label: 'قائمة الدخل', icon: 'trending_up', route: '/reports/income-statement' },
        { label: 'الميزانية العمومية', icon: 'account_balance_wallet', route: '/reports/balance-sheet' },
      ]
    },
    { label: 'الميزانية', icon: 'account_balance_wallet', route: '/balance-sheet' },
    {
      label: 'المستخدمين', icon: 'admin_panel_settings',
      children: [
        { label: 'قائمة المستخدمين', icon: 'people', route: '/users/list' },
        { label: 'مستخدم جديد', icon: 'person_add', route: '/users/new' },
      ]
    },
    {
      label: 'الإعدادات', icon: 'settings',
      children: [
        { label: 'إعدادات النظام', icon: 'tune', route: '/settings/system' },
        { label: 'النسخ الاحتياطي', icon: 'backup', route: '/settings/backup' },
        { label: 'إعدادات الرسائل', icon: 'sms', route: '/settings/sms' },
      ]
    },
  ];

  constructor(public authService: AuthService, private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const route = this.router.routerState.root;
      let child = route.firstChild;
      let title = '';
      while (child) {
        if (child.snapshot.data['title']) {
          title = child.snapshot.data['title'];
        }
        child = child.firstChild;
      }
      this.currentPageTitle.set(title);
    });
  }

  isActiveParent(item: MenuItem): boolean {
    return item.children?.some(c => this.router.isActive(c.route || '', false)) || false;
  }
}
