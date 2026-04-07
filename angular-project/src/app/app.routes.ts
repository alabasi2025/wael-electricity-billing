// ===============================================
// التوجيه الرئيسي (App Routes)
// النظام المحاسبي المتخصص لتجار الطاقة الكهربائية
// ===============================================
import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const APP_ROUTES: Routes = [
  // ─── تسجيل الدخول ───
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },

  // ─── الصفحات الرئيسية (محمية) ───
  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      // لوحة التحكم
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        data: { title: 'لوحة التحكم', icon: 'dashboard' }
      },

      // ─── شاشات النظام القديم (Oracle Forms) ───
      {
        path: 'legacy',
        data: { title: 'شاشات النظام القديم', icon: 'history' },
        children: [
          {
            path: '',
            loadComponent: () => import('./features/legacy/legacy-index/legacy-index.component').then(m => m.LegacyIndexComponent),
            data: { title: 'فهرس الشاشات القديمة' }
          },
          {
            path: ':formId',
            loadComponent: () => import('./features/legacy/legacy-form-shell/legacy-form-shell.component').then(m => m.LegacyFormShellComponent),
            data: { title: 'شاشة قديمة' }
          }
        ]
      },

      // ─── الحسابات ───
      {
        path: 'accounts',
        data: { title: 'الحسابات', icon: 'account_balance' },
        children: [
          {
            path: 'chart',
            loadComponent: () => import('./features/accounts/chart-of-accounts/chart-of-accounts.component').then(m => m.ChartOfAccountsComponent),
            data: { title: 'دليل الحسابات', permission: 'accounts.view' }
          },
          {
            path: 'sub-accounts',
            loadComponent: () => import('./features/accounts/sub-accounts/sub-accounts.component').then(m => m.SubAccountsComponent),
            data: { title: 'الحسابات الفرعية', permission: 'accounts.view' }
          },
          {
            path: 'types',
            loadComponent: () => import('./features/accounts/account-types/account-types.component').then(m => m.AccountTypesComponent),
            data: { title: 'أنواع الحسابات' }
          },
          {
            path: 'groups',
            loadComponent: () => import('./features/accounts/groups/groups.component').then(m => m.GroupsComponent),
            data: { title: 'المجموعات' }
          },
          { path: '', redirectTo: 'chart', pathMatch: 'full' }
        ]
      },

      // ─── القيود المحاسبية ───
      {
        path: 'journal',
        data: { title: 'القيود المحاسبية', icon: 'receipt_long' },
        children: [
          {
            path: 'list',
            loadComponent: () => import('./features/journal-entries/entry-list/entry-list.component').then(m => m.EntryListComponent),
            data: { title: 'عرض القيود' }
          },
          {
            path: 'new',
            loadComponent: () => import('./features/journal-entries/entry-form/entry-form.component').then(m => m.EntryFormComponent),
            data: { title: 'قيد جديد', permission: 'journal.create' }
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./features/journal-entries/entry-form/entry-form.component').then(m => m.EntryFormComponent),
            data: { title: 'تعديل قيد', permission: 'journal.edit' }
          },
          {
            path: 'categories',
            loadComponent: () => import('./features/journal-entries/entry-categories/entry-categories.component').then(m => m.EntryCategoriesComponent),
            data: { title: 'أصناف القيود' }
          },
          { path: '', redirectTo: 'list', pathMatch: 'full' }
        ]
      },

      // ─── السندات ───
      {
        path: 'vouchers',
        data: { title: 'السندات', icon: 'description' },
        children: [
          {
            path: 'receipt',
            loadComponent: () => import('./features/vouchers/receipt-voucher/receipt-voucher.component').then(m => m.ReceiptVoucherComponent),
            data: { title: 'سند قبض' }
          },
          {
            path: 'receipt/new',
            loadComponent: () => import('./features/vouchers/receipt-voucher/receipt-voucher.component').then(m => m.ReceiptVoucherComponent),
            data: { title: 'سند قبض جديد', mode: 'create' }
          },
          {
            path: 'payment',
            loadComponent: () => import('./features/vouchers/payment-voucher/payment-voucher.component').then(m => m.PaymentVoucherComponent),
            data: { title: 'سند صرف' }
          },
          {
            path: 'daily',
            loadComponent: () => import('./features/vouchers/daily-voucher/daily-voucher.component').then(m => m.DailyVoucherComponent),
            data: { title: 'سند يومي' }
          },
          {
            path: 'net',
            loadComponent: () => import('./features/vouchers/net-voucher/net-voucher.component').then(m => m.NetVoucherComponent),
            data: { title: 'سند شبكة' }
          },
          {
            path: 'list',
            loadComponent: () => import('./features/vouchers/voucher-list/voucher-list.component').then(m => m.VoucherListComponent),
            data: { title: 'عرض السندات' }
          },
          { path: '', redirectTo: 'list', pathMatch: 'full' }
        ]
      },

      // ─── الفواتير ───
      {
        path: 'invoices',
        data: { title: 'الفواتير', icon: 'receipt' },
        children: [
          {
            path: 'sales/:id',
            loadComponent: () => import('./features/invoices/invoice-form/invoice-form.component').then(m => m.InvoiceFormComponent),
            data: { title: 'تعديل فاتورة مبيعات', type: 'sales' }
          },
          {
            path: 'sales',
            loadComponent: () => import('./features/invoices/invoice-form/invoice-form.component').then(m => m.InvoiceFormComponent),
            data: { title: 'فاتورة مبيعات', type: 'sales' }
          },
          {
            path: 'purchase/:id',
            loadComponent: () => import('./features/invoices/invoice-purchase/invoice-purchase.component').then(m => m.InvoicePurchaseComponent),
            data: { title: 'تعديل فاتورة مشتريات', type: 'purchase' }
          },
          {
            path: 'purchase',
            loadComponent: () => import('./features/invoices/invoice-purchase/invoice-purchase.component').then(m => m.InvoicePurchaseComponent),
            data: { title: 'فاتورة مشتريات', type: 'purchase' }
          },
          {
            path: 'list',
            loadComponent: () => import('./features/invoices/invoice-list/invoice-list.component').then(m => m.InvoiceListComponent),
            data: { title: 'عرض الفواتير' }
          },
          { path: '', redirectTo: 'list', pathMatch: 'full' }
        ]
      },

      // ─── الإقفالات ───
      {
        path: 'closing',
        data: { title: 'الإقفالات', icon: 'lock' },
        children: [
          {
            path: 'monthly',
            loadComponent: () => import('./features/closing/closing-monthly/closing-monthly.component').then(m => m.ClosingMonthlyComponent),
            data: { title: 'إقفال شهري' }
          },
          {
            path: 'yearly',
            loadComponent: () => import('./features/closing/closing-yearly/closing-yearly.component').then(m => m.ClosingYearlyComponent),
            data: { title: 'إقفال سنوي' }
          },
          {
            path: 'list',
            loadComponent: () => import('./features/closing/closing-list/closing-list.component').then(m => m.ClosingListComponent),
            data: { title: 'عرض الإقفالات' }
          },
          { path: '', redirectTo: 'list', pathMatch: 'full' }
        ]
      },

      // ─── الموظفين ───
      {
        path: 'employees',
        data: { title: 'الموظفين', icon: 'people' },
        children: [
          {
            path: 'list',
            loadComponent: () => import('./features/employees/employee-list/employee-list.component').then(m => m.EmployeeListComponent),
            data: { title: 'قائمة الموظفين' }
          },
          {
            path: 'new',
            loadComponent: () => import('./features/employees/employee-form/employee-form.component').then(m => m.EmployeeFormComponent),
            data: { title: 'إضافة موظف' }
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./features/employees/employee-form/employee-form.component').then(m => m.EmployeeFormComponent),
            data: { title: 'تعديل موظف' }
          },
          {
            path: 'absence',
            loadComponent: () => import('./features/employees/employee-absence/employee-absence.component').then(m => m.EmployeeAbsenceComponent),
            data: { title: 'الغياب والحضور' }
          },
          { path: '', redirectTo: 'list', pathMatch: 'full' }
        ]
      },

      // ─── الأمانات ───
      {
        path: 'deposits',
        data: { title: 'الأمانات', icon: 'savings' },
        children: [
          {
            path: 'list',
            loadComponent: () => import('./features/deposits/deposit-list/deposit-list.component').then(m => m.DepositListComponent),
            data: { title: 'قائمة الأمانات' }
          },
          {
            path: 'new',
            loadComponent: () => import('./features/deposits/deposit-form/deposit-form.component').then(m => m.DepositFormComponent),
            data: { title: 'أمانة جديدة' }
          },
          { path: '', redirectTo: 'list', pathMatch: 'full' }
        ]
      },

      // ─── الكهرباء ───
      {
        path: 'electricity',
        data: { title: 'إدارة الكهرباء', icon: 'bolt' },
        children: [
          {
            path: 'overview',
            loadComponent: () => import('./features/electricity/overview/electricity-overview.component').then(m => m.ElectricityOverviewComponent),
            data: { title: 'دورة الكهرباء' }
          },
          {
            path: 'readings',
            loadComponent: () => import('./features/electricity/readings/electricity-readings.component').then(m => m.ElectricityReadingsComponent),
            data: { title: 'قراءات العدادات' }
          },
          {
            path: 'billing',
            loadComponent: () => import('./features/electricity/billing/electricity-billing.component').then(m => m.ElectricityBillingComponent),
            data: { title: 'الفوترة الشهرية' }
          },
          {
            path: 'posting',
            loadComponent: () => import('./features/electricity/posting/electricity-posting.component').then(m => m.ElectricityPostingComponent),
            data: { title: 'اعتماد وترحيل الفوترة' }
          },
          {
            path: 'collections',
            loadComponent: () => import('./features/electricity/collections/electricity-collections.component').then(m => m.ElectricityCollectionsComponent),
            data: { title: 'التحصيل والسداد' }
          },
          {
            path: 'messages',
            loadComponent: () => import('./features/electricity/messages/electricity-messages.component').then(m => m.ElectricityMessagesComponent),
            data: { title: 'الرسائل والمتابعة' }
          },
          {
            path: 'reports',
            loadComponent: () => import('./features/electricity/reports/electricity-reports.component').then(m => m.ElectricityReportsComponent),
            data: { title: 'تقارير الكهرباء' }
          },
          {
            path: 'meters',
            loadComponent: () => import('./features/electricity/meters/meters.component').then(m => m.MetersComponent),
            data: { title: 'سجل العدادات' }
          },
          {
            path: 'installations',
            loadComponent: () => import('./features/electricity/installations/installations.component').then(m => m.InstallationsComponent),
            data: { title: 'التركيبات والتغييرات' }
          },
          {
            path: 'generators',
            loadComponent: () => import('./features/electricity/generators/generators.component').then(m => m.GeneratorsComponent),
            data: { title: 'المولدات' }
          },
          {
            path: 'subscribers',
            loadComponent: () => import('./features/electricity/subscribers/subscribers.component').then(m => m.SubscribersComponent),
            data: { title: 'بيانات المشتركين' }
          },
          {
            path: 'centers',
            loadComponent: () => import('./features/electricity/centers/centers.component').then(m => m.CentersComponent),
            data: { title: 'المراكز' }
          },
          { path: '', redirectTo: 'overview', pathMatch: 'full' }
        ]
      },

      // ─── التقارير ───
      {
        path: 'reports',
        data: { title: 'التقارير', icon: 'assessment' },
        children: [
          {
            path: 'daily',
            loadComponent: () => import('./features/reports/daily-report/daily-report.component').then(m => m.DailyReportComponent),
            data: { title: 'التقرير اليومي' }
          },
          {
            path: 'account-statement',
            loadComponent: () => import('./features/reports/account-report/account-report.component').then(m => m.AccountReportComponent),
            data: { title: 'كشف حساب' }
          },
          {
            path: 'voucher-report',
            loadComponent: () => import('./features/reports/voucher-report/voucher-report.component').then(m => m.VoucherReportComponent),
            data: { title: 'تقرير السندات' }
          },
          {
            path: 'invoice-report',
            loadComponent: () => import('./features/reports/invoice-report/invoice-report.component').then(m => m.InvoiceReportComponent),
            data: { title: 'تقرير الفواتير' }
          },
          {
            path: 'trial-balance',
            loadComponent: () => import('./features/reports/trial-balance/trial-balance.component').then(m => m.TrialBalanceComponent),
            data: { title: 'ميزان المراجعة' }
          },
          {
            path: 'income-statement',
            loadComponent: () => import('./features/reports/income-statement/income-statement.component').then(m => m.IncomeStatementComponent),
            data: { title: 'قائمة الدخل' }
          },
          {
            path: 'balance-sheet',
            loadComponent: () => import('./features/reports/balance-report/balance-report.component').then(m => m.BalanceReportComponent),
            data: { title: 'الميزانية العمومية' }
          },
          { path: '', redirectTo: 'daily', pathMatch: 'full' }
        ]
      },

      // ─── الميزانية ───
      {
        path: 'balance-sheet',
        loadComponent: () => import('./features/balance-sheet/balance-sheet.component').then(m => m.BalanceSheetComponent),
        data: { title: 'الميزانية', icon: 'account_balance_wallet' }
      },

      // ─── المستخدمين ───
      {
        path: 'users',
        data: { title: 'المستخدمين', icon: 'admin_panel_settings', permission: 'users.manage' },
        children: [
          {
            path: 'list',
            loadComponent: () => import('./features/users/user-list/user-list.component').then(m => m.UserListComponent),
            data: { title: 'قائمة المستخدمين' }
          },
          {
            path: 'new',
            loadComponent: () => import('./features/users/user-form/user-form.component').then(m => m.UserFormComponent),
            data: { title: 'مستخدم جديد' }
          },
          {
            path: 'edit/:id',
            loadComponent: () => import('./features/users/user-form/user-form.component').then(m => m.UserFormComponent),
            data: { title: 'تعديل مستخدم' }
          },
          {
            path: 'permissions/:id',
            loadComponent: () => import('./features/users/user-permissions/user-permissions.component').then(m => m.UserPermissionsComponent),
            data: { title: 'صلاحيات المستخدم' }
          },
          { path: '', redirectTo: 'list', pathMatch: 'full' }
        ]
      },

      // ─── الإعدادات ───
      {
        path: 'settings',
        data: { title: 'الإعدادات', icon: 'settings', permission: 'settings.manage' },
        children: [
          {
            path: 'system',
            loadComponent: () => import('./features/settings/system-settings/system-settings.component').then(m => m.SystemSettingsComponent),
            data: { title: 'إعدادات النظام' }
          },
          {
            path: 'backup',
            loadComponent: () => import('./features/settings/backup/backup.component').then(m => m.BackupComponent),
            data: { title: 'النسخ الاحتياطي' }
          },
          {
            path: 'sms',
            loadComponent: () => import('./features/settings/sms-settings/sms-settings.component').then(m => m.SmsSettingsComponent),
            data: { title: 'إعدادات الرسائل' }
          },
          { path: '', redirectTo: 'system', pathMatch: 'full' }
        ]
      },

      // ─── الطباعة ───
      {
        path: 'print/:type/:id',
        loadComponent: () => import('./features/print/print.component').then(m => m.PrintComponent),
        data: { title: 'طباعة' }
      }
    ]
  },

  // ─── صفحات خاصة ───
  { path: 'unauthorized', loadComponent: () => import('./shared/components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent) },
  { path: '**', redirectTo: 'dashboard' }
];
