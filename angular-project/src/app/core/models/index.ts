// ===============================================
// النماذج (Models) - جداول قاعدة البيانات
// النظام المحاسبي المتخصص لتجار الطاقة الكهربائية
// ===============================================

// ─── إعدادات النظام (TITL) ───
export interface SystemSettings {
  id?: number;
  name: string;              // اسم الشركة
  hsll: number;              // حساب الأرباح والخسائر
  nosmm: number;             // رقم سند المقاصة
  nosndk: number;            // رقم السند
  mkdm: number;              // مقدم
  nr: number;                // نسبة الربح
  mrksndk: string;           // مركز السند
  sndkk: number;             // نوع السند
  nb: number;                // حالة النظام
  nocopy: number;            // رقم النسخة
  spath: string;             // مسار المصدر
  path: string;              // مسار التنفيذ
  ap1: string;               // كلمة سر 1
  ap2: string;               // كلمة سر 2
  ap3: string;               // كلمة سر 3
  ms70: number;              // إعدادات العرض
  pashd: string;             // كلمة سر الحذف
  datehd: Date;              // تاريخ الحذف
  thdma: string;             // حد الحذف
  nocopy22: number;          // نسخة ثانوية
  tsnk: number;              // إعداد السندات
}

// ─── المستخدمين (USER_U) ───
export interface User {
  nou: number;               // رقم المستخدم
  nameu: string;             // اسم المستخدم
  pass: string;              // كلمة السر
  passs: string;             // كلمة السر المؤكدة
  statu: number;             // الحالة (1=فعال, 0=معطل)
  ed: string;                // صلاحية التعديل
  de: string;                // صلاحية الحذف
  repa: string;              // صلاحية التقارير
  kokogo: number;            // إعدادات خاصة
}

// ─── بيانات تسجيل الدخول (SYSDATA) ───
export interface SystemLog {
  id?: number;
  userId: number;
  loginTime: string;
  loginDate: Date;
  userName: string;
  action: string;
}

// ─── دليل الحسابات الرئيسي (DATA_A) ───
export interface ChartOfAccount {
  no_a: number;              // رقم الحساب الرئيسي
  name_a: string;            // اسم الحساب
  rep_a: string;             // التقرير المرتبط
  ind: number;               // مؤشر
  ts: number;                // نوع الحساب (0/1)
  typea: number;             // تصنيف الحساب
}

// ─── الحسابات الفرعية (DATA_AC) ───
export interface SubAccount {
  noa: number;               // رقم الحساب الفرعي
  namea: string;             // اسم الحساب
  typea: number;             // نوع الحساب (مرتبط بالحساب الرئيسي)
  noan: number;              // الرقم البديل
  amlhh: number;             // العمولة
  saram: number;             // السرية
}

// ─── أصناف/تفاصيل الحسابات (DATA_AM) ───
export interface AccountDetail {
  noa: number;               // رقم الحساب
  namea: string;             // الاسم
  mhlt: string;              // المحلة/العنوان
  tel: string;               // الهاتف
  notes: string;             // ملاحظات
}

// ─── المجموعات (GRP) ───
export interface AccountGroup {
  id?: number;
  name: string;              // اسم المجموعة
  type: number;              // نوع المجموعة
  accounts: number[];        // الحسابات التابعة
}

// ─── القيود المحاسبية (DATAK) ───
export interface JournalEntry {
  noa: number;               // رقم القيد
  datemo: Date;              // تاريخ القيد
  namea: string;             // الوصف
  debit: number;             // مدين
  credit: number;            // دائن
  no_m: number;              // رقم الشهر
  year: number;              // السنة المالية
  notes: string;             // ملاحظات
  userId: number;            // المستخدم المدخل
  entryDate: Date;           // تاريخ الإدخال
}

// ─── أصناف القيود (DATAKSNF) ───
export interface EntryCategory {
  id?: number;
  noz: number;               // رقم الصنف
  name: string;              // اسم الصنف
  datek: Date;               // التاريخ
}

// ─── سندات القبض (SNDK) ───
export interface ReceiptVoucher {
  nos: number;               // رقم السند
  noson: number;             // الرقم التسلسلي
  dates: Date;               // التاريخ
  noa: number;               // رقم الحساب
  namea: string;             // اسم الحساب
  totals: number;            // المجموع
  memos: string;             // البيان
  nms: string;               // الملاحظات
  noas: number;              // الحساب المقابل
  nok: number;               // رقم القيد
  nokon: number;             // رقم القيد المقابل
  amr: number;               // حالة الترحيل
  rep: string;               // التقرير
  rsdd: string;              // الرصيد
  sds: string;               // نوع السند
  txtx: string;              // نص إضافي
  nousx: number;             // المستخدم
  details: VoucherDetail[];  // التفاصيل
}

// ─── تفاصيل السندات (SNDKF) ───
export interface VoucherDetail {
  id?: number;
  nosParent: number;         // رقم السند الأب
  noaf: number;              // رقم الحساب الفرعي
  nameaf: string;            // اسم الحساب
  amount: number;            // المبلغ
  noaon: number;             // الحساب المقابل
  notes: string;             // ملاحظات
}

// ─── سندات يومية (SNDKY) ───
export interface DailyVoucher {
  nos: number;
  noson: number;
  dates: Date;
  noa: number;
  namea: string;
  totals: number;
  memos: string;
  details: VoucherDetail[];
}

// ─── سندات الصرف (SNDS) ───
export interface PaymentVoucher {
  nos: number;
  noson: number;
  dates: Date;
  noa: number;
  namea: string;
  totals: number;
  memos: string;
  details: VoucherDetail[];
}

// ─── سندات أخرى (SNDKO) ───
export interface OtherVoucher {
  nos: number;
  noson: number;
  dates: Date;
  noa: number;
  namea: string;
  totals: number;
  memos: string;
  details: VoucherDetail[];
}

// ─── سندات الشبكة (SNDKNET) ───
export interface NetVoucher {
  nos: number;
  noson: number;
  dates: Date;
  noa: number;
  namea: string;
  totals: number;
  memos: string;
  details: VoucherDetail[];
}

// ─── الفواتير - مبيعات (FATM) ───
export interface SalesInvoice {
  nos: number;               // رقم الفاتورة
  noson: number;             // الرقم التسلسلي
  dates: Date;               // التاريخ
  noa: number;               // رقم الحساب (العميل)
  namea: string;             // اسم العميل
  totals: number;            // المجموع
  notes: string;             // ملاحظات
  amr?: number;              // حالة الترحيل (0=معلق, 1=مرحل)
  nousx?: number;            // المستخدم
  createdAt?: Date | string; // تاريخ الإنشاء
  details: InvoiceDetail[];  // التفاصيل
}

// ─── تفاصيل الفواتير (FATMF) ───
export interface InvoiceDetail {
  id?: number;
  nosParent?: number;
  itemName: string;
  quantity: number;
  price: number;
  total: number;
  notes?: string;
}

// ─── فواتير المشتريات (FATB) ───
export interface PurchaseInvoice {
  nos: number;
  noson: number;
  dates: Date;
  noa: number;
  namea: string;
  totals: number;
  notes: string;
  amr?: number;
  nousx?: number;
  createdAt?: Date | string;
  details: InvoiceDetail[];
}

// ─── الموظفين (EMP1) ───
export interface Employee {
  id?: number;
  name: string;              // اسم الموظف
  dates: Date;               // تاريخ التعيين
  salary: number;            // الراتب
  department: string;        // القسم
  phone: string;             // الهاتف
  address: string;           // العنوان
  status: number;            // الحالة
  notes: string;             // ملاحظات
}

// ─── غياب الموظفين (EMP2) ───
export interface EmployeeAbsence {
  id?: number;
  empId: number;             // رقم الموظف
  dates: Date;               // التاريخ
  reason: string;            // السبب
  duration: number;          // المدة
}

// ─── بيانات إضافية للموظفين (EMPAB1/EMPAB2) ───
export interface EmployeeExtra {
  id?: number;
  empId: number;
  type: string;
  amount: number;
  dates: Date;
  notes: string;
}

// ─── الأمانات (AMANDHS) ───
export interface Deposit {
  id?: number;
  nos: number;               // رقم الأمانة
  dates: Date;               // التاريخ
  noa: number;               // رقم الحساب
  namea: string;             // الاسم
  amount: number;            // المبلغ
  notes: string;             // ملاحظات
  status: number;            // الحالة
}

// ─── الأعمال (AMLH) ───
export interface Work {
  id?: number;
  name: string;              // اسم العمل
  type: number;              // النوع
  amount: number;            // المبلغ
  notes: string;             // ملاحظات
}

// ─── اليوميات (KDAY) ───
export interface DailyRecord {
  id?: number;
  kdate: Date;               // التاريخ
  amount: number;            // المبلغ
  type: string;              // النوع
  notes: string;             // ملاحظات
}

// ─── الشهور (MONTH) ───
export interface MonthRecord {
  no_m: number;              // رقم الشهر
  name: string;              // اسم الشهر
  year: number;              // السنة
  status: number;            // الحالة (مفتوح/مغلق)
  openDate: Date;            // تاريخ الفتح
  closeDate: Date;           // تاريخ الإغلاق
}

// ─── السنوات المالية (YEAR) ───
export interface FiscalYear {
  year: number;              // السنة
  startDate: Date;           // تاريخ البداية
  endDate: Date;             // تاريخ النهاية
  status: number;            // الحالة (مفتوح/مغلق)
  stat: number;              // إعدادات إضافية
}

// ─── الإقفالات (AKFA/AKFAF) ───
export interface ClosingEntry {
  id?: number;
  nom: number;               // رقم الإقفال
  noy: number;               // رقم السنة
  nod: string;               // الوصف
  dates: Date;               // التاريخ
  no_m: number;              // رقم الشهر
  year: number;              // السنة
  status: number;            // الحالة
}

// ─── التسويات (REDM/REDMM) ───
export interface Adjustment {
  id?: number;
  nos: number;               // رقم التسوية
  dates: Date;               // التاريخ
  dates2: Date;              // تاريخ الاستحقاق
  noa: number;               // رقم الحساب
  amount: number;            // المبلغ
  notes: string;             // ملاحظات
}

// ─── الأرصدة (ARSRF/ARSRFF) ───
export interface Balance {
  id?: number;
  noa: number;               // رقم الحساب
  dates: Date;               // التاريخ
  debit: number;             // مدين
  credit: number;            // دائن
  balance: number;           // الرصيد
}

// ─── التركيبات (TRKB) ───
export interface Installation {
  id?: number;
  nos: number;               // رقم التركيب
  dates: Date;               // التاريخ
  description: string;       // الوصف
  amount: number;            // المبلغ
  status: number;            // الحالة
  notes: string;             // ملاحظات
}

// ─── المولدات (MOLDAT/MOLDATS) ───
export interface Generator {
  id?: number;
  name: string;              // اسم المولد
  capacity: number;          // السعة
  location: string;          // الموقع
  status: number;            // الحالة
  notes: string;             // ملاحظات
}

// ─── المراكز (MRCZE) ───
export interface Center {
  id?: number;
  name: string;              // اسم المركز
  location: string;          // الموقع
  type: string;              // النوع
  status: number;            // الحالة
}

// ─── العدادات/المقاييس (MZ) ───
export interface Meter {
  id?: number;
  meterNumber: string;       // رقم العداد
  subscriberName: string;    // اسم المشترك
  location: string;          // الموقع
  reading: number;           // القراءة
  lastReadDate: Date;        // تاريخ آخر قراءة
  status: number;            // الحالة
}

// ─── حسم المشتركين (HSMMSH) ───
export interface SubscriberDiscount {
  id?: number;
  subscriberId: number;
  dates: Date;
  amount: number;
  reason: string;
  notes: string;
}

// ─── المذكرات (MEMO) ───
export interface Memo {
  id?: number;
  title: string;
  content: string;
  date: Date;
  userId: number;
  priority: number;
}

// ─── البيانات المالية (DATAF/DATAFF) ───
export interface FinancialData {
  nos: number;
  dates: Date;
  dates2: Date;
  noa: number;
  amount: number;
  type: string;
  notes: string;
}

// ─── رسائل SMS (SMSDATA) ───
export interface SmsMessage {
  id?: number;
  phone: string;
  message: string;
  sentDate: Date;
  status: number;
  userId: number;
}

// ─── الميزانية (MZAN) ───
export interface BalanceSheet {
  year: number;
  assets: BalanceSheetItem[];
  liabilities: BalanceSheetItem[];
  equity: BalanceSheetItem[];
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
}

export interface BalanceSheetItem {
  accountNo: number;
  accountName: string;
  balance: number;
  type: 'debit' | 'credit';
}

// ─── ميزان المراجعة ───
export interface TrialBalance {
  year: number;
  month: number;
  entries: TrialBalanceEntry[];
  totalDebit: number;
  totalCredit: number;
}

export interface TrialBalanceEntry {
  accountNo: number;
  accountName: string;
  debit: number;
  credit: number;
  balance: number;
}

// ─── كشف حساب ───
export interface AccountStatement {
  accountNo: number;
  accountName: string;
  fromDate: Date;
  toDate: Date;
  openingBalance: number;
  entries: AccountStatementEntry[];
  closingBalance: number;
}

export interface AccountStatementEntry {
  date: Date;
  description: string;
  reference: string;
  debit: number;
  credit: number;
  balance: number;
}

// ─── تقرير يومي ───
export interface DailyReport {
  date: Date;
  entries: JournalEntry[];
  totalDebit: number;
  totalCredit: number;
  voucherCount: number;
  invoiceCount: number;
}

// ─── بيانات لوحة التحكم ───
export interface DashboardData {
  totalAccounts: number;
  totalVouchers: number;
  totalInvoices: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  netProfit: number;
  recentEntries: JournalEntry[];
  recentVouchers: ReceiptVoucher[];
  chartData: ChartData;
}

export interface ChartData {
  labels: string[];
  revenues: number[];
  expenses: number[];
  profits: number[];
}

// ─── واجهات استجابة API ───
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  totalCount?: number;
  page?: number;
  pageSize?: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// ─── واجهات الطباعة ───
export interface PrintConfig {
  title: string;
  subtitle: string;
  companyName: string;
  dateRange?: { from: Date; to: Date };
  showLogo: boolean;
  orientation: 'portrait' | 'landscape';
}
