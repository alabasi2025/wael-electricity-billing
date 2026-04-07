// =============================================
// واجهات مشتركة (Common Interfaces)
// =============================================

// ─── استجابة API موحدة ───
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  statusCode: number;
  timestamp: string;
}

// ─── استجابة مع ترقيم صفحات ───
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── معلمات الترقيم ───
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  search?: string;
}

// ─── معلمات التاريخ ───
export interface DateRange {
  from: Date;
  to: Date;
}

// ─── معلومات المستخدم في التوكن ───
export interface JwtPayload {
  sub: number;     // userId
  username: string;
  statu: number;
  iat?: number;
  exp?: number;
}

// ─── بيانات التقرير ───
export interface ReportData {
  title: string;
  subtitle: string;
  dateRange: DateRange;
  generatedAt: Date;
  generatedBy: string;
  rows: any[];
  totals: Record<string, number>;
}
