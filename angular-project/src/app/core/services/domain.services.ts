// ===============================================
// خدمات الوحدات المتخصصة
// ===============================================
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  ChartOfAccount, SubAccount, AccountDetail, AccountGroup,
  JournalEntry, EntryCategory, ReceiptVoucher, DailyVoucher,
  PaymentVoucher, NetVoucher, SalesInvoice, PurchaseInvoice,
  Employee, EmployeeAbsence, Deposit, ClosingEntry,
  Adjustment, Installation, Generator, Center, Meter,
  FiscalYear, MonthRecord, DashboardData, BalanceSheet,
  TrialBalance, AccountStatement, DailyReport,
  ApiResponse, PaginationParams, SystemSettings, User
} from '../models';

// ─── خدمة الحسابات ───
@Injectable({ providedIn: 'root' })
export class AccountsService {
  constructor(private api: ApiService) {}

  // دليل الحسابات الرئيسي
  getChartOfAccounts(params?: PaginationParams) { return this.api.getAll<ChartOfAccount>('accounts/chart', params); }
  getChartOfAccount(id: number) { return this.api.getById<ChartOfAccount>('accounts/chart', id); }
  createChartOfAccount(data: ChartOfAccount) { return this.api.create<ChartOfAccount>('accounts/chart', data); }
  updateChartOfAccount(id: number, data: ChartOfAccount) { return this.api.update<ChartOfAccount>('accounts/chart', id, data); }
  deleteChartOfAccount(id: number) { return this.api.delete<ChartOfAccount>('accounts/chart', id); }

  // الحسابات الفرعية
  getSubAccounts(params?: PaginationParams, filters?: Record<string, any>) { return this.api.getAll<SubAccount>('accounts/sub', params, filters); }
  getSubAccount(id: number) { return this.api.getById<SubAccount>('accounts/sub', id); }
  createSubAccount(data: SubAccount) { return this.api.create<SubAccount>('accounts/sub', data); }
  updateSubAccount(id: number, data: SubAccount) { return this.api.update<SubAccount>('accounts/sub', id, data); }
  deleteSubAccount(id: number) { return this.api.delete<SubAccount>('accounts/sub', id); }
  searchSubAccounts(query: string) { return this.api.search<SubAccount>('accounts/sub', query); }

  // تفاصيل الحسابات
  getAccountDetails(params?: PaginationParams) { return this.api.getAll<AccountDetail>('accounts/details', params); }
  getAccountDetail(id: number) { return this.api.getById<AccountDetail>('accounts/details', id); }
  createAccountDetail(data: AccountDetail) { return this.api.create<AccountDetail>('accounts/details', data); }
  updateAccountDetail(id: number, data: AccountDetail) { return this.api.update<AccountDetail>('accounts/details', id, data); }

  // المجموعات
  getGroups(params?: PaginationParams) { return this.api.getAll<AccountGroup>('accounts/groups', params); }
  getGroup(id: number) { return this.api.getById<AccountGroup>('accounts/groups', id); }
  createGroup(data: AccountGroup) { return this.api.create<AccountGroup>('accounts/groups', data); }
  updateGroup(id: number, data: AccountGroup) { return this.api.update<AccountGroup>('accounts/groups', id, data); }
  deleteGroup(id: number) { return this.api.delete<AccountGroup>('accounts/groups', id); }

  // شجرة الحسابات
  getAccountTree(): Observable<ApiResponse<any>> { return this.api.getAll<any>('accounts/tree'); }
}

// ─── خدمة القيود المحاسبية ───
@Injectable({ providedIn: 'root' })
export class JournalService {
  constructor(private api: ApiService) {}

  getEntries(params?: PaginationParams, filters?: Record<string, any>) { return this.api.getAll<JournalEntry>('journal', params, filters); }
  getEntry(id: number) { return this.api.getById<JournalEntry>('journal', id); }
  createEntry(data: JournalEntry) { return this.api.create<JournalEntry>('journal', data); }
  updateEntry(id: number, data: JournalEntry) { return this.api.update<JournalEntry>('journal', id, data); }
  deleteEntry(id: number) { return this.api.delete<JournalEntry>('journal', id); }
  postEntry(id: number) { return this.api.patch<JournalEntry>(`journal/${id}/post`, {}); }
  reverseEntry(id: number) { return this.api.patch<JournalEntry>(`journal/${id}/reverse`, {}); }

  // أصناف القيود
  getCategories() { return this.api.getAll<EntryCategory>('journal/categories'); }
  createCategory(data: EntryCategory) { return this.api.create<EntryCategory>('journal/categories', data); }
  deleteCategory(id: number) { return this.api.delete<EntryCategory>('journal/categories', id); }
}

// ─── خدمة السندات ───
@Injectable({ providedIn: 'root' })
export class VouchersService {
  constructor(private api: ApiService) {}

  // سندات القبض
  getReceiptVouchers(params?: PaginationParams, filters?: Record<string, any>) { return this.api.getAll<ReceiptVoucher>('vouchers/receipt', params, filters); }
  getReceiptVoucher(id: number) { return this.api.getById<ReceiptVoucher>('vouchers/receipt', id); }
  createReceiptVoucher(data: ReceiptVoucher) { return this.api.create<ReceiptVoucher>('vouchers/receipt', data); }
  updateReceiptVoucher(id: number, data: ReceiptVoucher) { return this.api.update<ReceiptVoucher>('vouchers/receipt', id, data); }
  deleteReceiptVoucher(id: number) { return this.api.delete<ReceiptVoucher>('vouchers/receipt', id); }
  postReceiptVoucher(id: number) { return this.api.patch<ReceiptVoucher>(`vouchers/receipt/${id}/post`, {}); }

  // سندات الصرف
  getPaymentVouchers(params?: PaginationParams, filters?: Record<string, any>) { return this.api.getAll<PaymentVoucher>('vouchers/payment', params, filters); }
  getPaymentVoucher(id: number) { return this.api.getById<PaymentVoucher>('vouchers/payment', id); }
  createPaymentVoucher(data: PaymentVoucher) { return this.api.create<PaymentVoucher>('vouchers/payment', data); }
  updatePaymentVoucher(id: number, data: PaymentVoucher) { return this.api.update<PaymentVoucher>('vouchers/payment', id, data); }
  deletePaymentVoucher(id: number) { return this.api.delete<PaymentVoucher>('vouchers/payment', id); }

  // سندات يومية
  getDailyVouchers(params?: PaginationParams, filters?: Record<string, any>) { return this.api.getAll<DailyVoucher>('vouchers/daily', params, filters); }
  getDailyVoucher(id: number) { return this.api.getById<DailyVoucher>('vouchers/daily', id); }
  createDailyVoucher(data: DailyVoucher) { return this.api.create<DailyVoucher>('vouchers/daily', data); }

  // سندات الشبكة
  getNetVouchers(params?: PaginationParams, filters?: Record<string, any>) { return this.api.getAll<NetVoucher>('vouchers/net', params, filters); }
  getNetVoucher(id: number) { return this.api.getById<NetVoucher>('vouchers/net', id); }
  createNetVoucher(data: NetVoucher) { return this.api.create<NetVoucher>('vouchers/net', data); }

  // البحث في السندات
  searchVouchers(query: string, type?: string) {
    return this.api.search<ReceiptVoucher>(`vouchers/search${type ? '/' + type : ''}`, query);
  }
}

// ─── خدمة الفواتير ───
@Injectable({ providedIn: 'root' })
export class InvoicesService {
  constructor(private api: ApiService) {}

  // فواتير المبيعات
  getSalesInvoices(params?: PaginationParams, filters?: Record<string, any>) { return this.api.getAll<SalesInvoice>('invoices/sales', params, filters); }
  getSalesInvoice(id: number) { return this.api.getById<SalesInvoice>('invoices/sales', id); }
  createSalesInvoice(data: SalesInvoice) { return this.api.create<SalesInvoice>('invoices/sales', data); }
  updateSalesInvoice(id: number, data: SalesInvoice) { return this.api.update<SalesInvoice>('invoices/sales', id, data); }
  deleteSalesInvoice(id: number) { return this.api.delete<SalesInvoice>('invoices/sales', id); }
  postSalesInvoice(id: number) { return this.api.patch<SalesInvoice>(`invoices/sales/${id}/post`, {}); }

  // فواتير المشتريات
  getPurchaseInvoices(params?: PaginationParams, filters?: Record<string, any>) { return this.api.getAll<PurchaseInvoice>('invoices/purchase', params, filters); }
  getPurchaseInvoice(id: number) { return this.api.getById<PurchaseInvoice>('invoices/purchase', id); }
  createPurchaseInvoice(data: PurchaseInvoice) { return this.api.create<PurchaseInvoice>('invoices/purchase', data); }
  updatePurchaseInvoice(id: number, data: PurchaseInvoice) { return this.api.update<PurchaseInvoice>('invoices/purchase', id, data); }
  deletePurchaseInvoice(id: number) { return this.api.delete<PurchaseInvoice>('invoices/purchase', id); }
  postPurchaseInvoice(id: number) { return this.api.patch<PurchaseInvoice>(`invoices/purchase/${id}/post`, {}); }
}

// ─── خدمة الإقفالات ───
@Injectable({ providedIn: 'root' })
export class ClosingService {
  constructor(private api: ApiService) {}

  getClosingEntries(params?: PaginationParams) { return this.api.getAll<ClosingEntry>('closing', params); }
  getClosingEntry(id: number) { return this.api.getById<ClosingEntry>('closing', id); }
  createMonthlyClosing(month: number, year: number) { return this.api.create<ClosingEntry>('closing/monthly', { month, year }); }
  createYearlyClosing(year: number) { return this.api.create<ClosingEntry>('closing/yearly', { year }); }
  reverseClosing(id: number) { return this.api.patch<ClosingEntry>(`closing/${id}/reverse`, {}); }
}

// ─── خدمة الموظفين ───
@Injectable({ providedIn: 'root' })
export class EmployeesService {
  constructor(private api: ApiService) {}

  getEmployees(params?: PaginationParams) { return this.api.getAll<Employee>('employees', params); }
  getEmployee(id: number) { return this.api.getById<Employee>('employees', id); }
  createEmployee(data: Employee) { return this.api.create<Employee>('employees', data); }
  updateEmployee(id: number, data: Employee) { return this.api.update<Employee>('employees', id, data); }
  deleteEmployee(id: number) { return this.api.delete<Employee>('employees', id); }

  getAbsences(empId: number) { return this.api.getAll<EmployeeAbsence>(`employees/${empId}/absences`); }
  createAbsence(data: EmployeeAbsence) { return this.api.create<EmployeeAbsence>('employees/absences', data); }
}

// ─── خدمة الأمانات ───
@Injectable({ providedIn: 'root' })
export class DepositsService {
  constructor(private api: ApiService) {}

  getDeposits(params?: PaginationParams) { return this.api.getAll<Deposit>('deposits', params); }
  getDeposit(id: number) { return this.api.getById<Deposit>('deposits', id); }
  createDeposit(data: Deposit) { return this.api.create<Deposit>('deposits', data); }
  updateDeposit(id: number, data: Deposit) { return this.api.update<Deposit>('deposits', id, data); }
  returnDeposit(id: number) { return this.api.patch<Deposit>(`deposits/${id}/return`, {}); }
}

// ─── خدمة الكهرباء ───
@Injectable({ providedIn: 'root' })
export class ElectricityService {
  constructor(private api: ApiService) {}

  // العدادات
  getMeters(params?: PaginationParams) { return this.api.getAll<Meter>('electricity/meters', params); }
  getMeter(id: number) { return this.api.getById<Meter>('electricity/meters', id); }
  createMeter(data: Meter) { return this.api.create<Meter>('electricity/meters', data); }
  updateMeter(id: number, data: Meter) { return this.api.update<Meter>('electricity/meters', id, data); }
  recordReading(id: number, reading: number) { return this.api.patch<Meter>(`electricity/meters/${id}/reading`, { reading }); }

  // التركيبات
  getInstallations(params?: PaginationParams) { return this.api.getAll<Installation>('electricity/installations', params); }
  createInstallation(data: Installation) { return this.api.create<Installation>('electricity/installations', data); }

  // المولدات
  getGenerators(params?: PaginationParams) { return this.api.getAll<Generator>('electricity/generators', params); }
  createGenerator(data: Generator) { return this.api.create<Generator>('electricity/generators', data); }

  // المراكز
  getCenters(params?: PaginationParams) { return this.api.getAll<Center>('electricity/centers', params); }
  createCenter(data: Center) { return this.api.create<Center>('electricity/centers', data); }
}

// ─── خدمة التقارير ───
@Injectable({ providedIn: 'root' })
export class ReportsService {
  constructor(private api: ApiService) {}

  getDailyReport(date: string) { return this.api.getAll<DailyReport>('reports/daily', undefined, { date }); }
  getAccountStatement(accountNo: number, from: string, to: string) {
    return this.api.getAll<AccountStatement>('reports/account-statement', undefined, { accountNo, from, to });
  }
  getTrialBalance(year: number, month?: number) {
    return this.api.getAll<TrialBalance>('reports/trial-balance', undefined, { year, month });
  }
  getBalanceSheet(year: number) {
    return this.api.getById<BalanceSheet>('financial/balance-sheet', year);
  }
  getIncomeStatement(year: number, month?: number) {
    return this.api.getAll<any>('reports/income-statement', undefined, { year, month });
  }
  getVoucherReport(type: string, from: string, to: string) {
    return this.api.getAll<any>('reports/vouchers', undefined, { type, from, to });
  }
  getInvoiceReport(type: string, from: string, to: string, accountNo?: number) {
    const filters: Record<string, any> = { type, from, to };
    if (accountNo !== undefined && accountNo !== null) {
      filters['accountNo'] = accountNo;
    }
    return this.api.getAll<any>('reports/invoices', undefined, filters);
  }
  exportReport(reportType: string, format: 'excel' | 'pdf', params: Record<string, any>) {
    return this.api.export(`reports/${reportType}`, format, params);
  }
}

// ─── خدمة لوحة التحكم ───
@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private api: ApiService) {}

  getDashboardData() { return this.api.getById<DashboardData>('reports', 'dashboard'); }
  getRevenueChart(_year: number) { return this.api.getById<any>('reports', 'dashboard'); }
  getExpenseChart(_year: number) { return this.api.getById<any>('reports', 'dashboard'); }
  getTopAccounts(_limit: number) { return this.api.getById<any>('reports', 'dashboard'); }
}

// ─── خدمة الإعدادات ───
@Injectable({ providedIn: 'root' })
export class SettingsService {
  constructor(private api: ApiService) {}

  getSettings() { return this.api.getById<SystemSettings>('settings', 'current'); }
  updateSettings(data: SystemSettings) { return this.api.update<SystemSettings>('settings', 'current', data); }

  getFiscalYears() { return this.api.getAll<FiscalYear>('settings/fiscal-years'); }
  createFiscalYear(data: FiscalYear) { return this.api.create<FiscalYear>('settings/fiscal-years', data); }
  closeFiscalYear(year: number) { return this.api.patch<FiscalYear>(`settings/fiscal-years/${year}/close`, {}); }

  getMonths(year: number) { return this.api.getAll<MonthRecord>('settings/months', undefined, { year }); }
  openMonth(data: MonthRecord) { return this.api.create<MonthRecord>('settings/months', data); }
  closeMonth(no_m: number) { return this.api.patch<MonthRecord>(`settings/months/${no_m}/close`, {}); }

  createBackup() { return this.api.create<any>('settings/backup', {}); }
  restoreBackup(file: File) {
    const formData = new FormData();
    formData.append('backup', file);
    return this.api.create<any>('settings/restore', formData);
  }
}

// ─── خدمة المستخدمين ───
@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private api: ApiService) {}

  getUsers(params?: PaginationParams) { return this.api.getAll<User>('users', params); }
  getUser(id: number) { return this.api.getById<User>('users', id); }
  createUser(data: User) { return this.api.create<User>('users', data); }
  updateUser(id: number, data: User) { return this.api.update<User>('users', id, data); }
  deleteUser(id: number) { return this.api.delete<User>('users', id); }
  updatePermissions(id: number, permissions: { ed?: string; de?: string; repa?: string }) {
    return this.api.patch<User>(`users/${id}/permissions`, permissions);
  }
}
