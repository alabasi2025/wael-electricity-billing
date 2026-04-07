// =============================================
// خدمة سير عمل الكهرباء المحدثة
// تغطي كل API الجديدة: المشتركين + القراءات + الفوترة + التقارير + الرسائل
// =============================================
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

// ─── واجهات البيانات ───

export interface ElectricitySubscriber {
  id?: number; noa: number; noan?: number; namea: string; namegar?: string;
  addressText?: string; qm?: string; mobile?: string; tel?: string;
  groupId?: number; subGroupId?: number; collectorId?: number; areaId?: number; centerId?: number;
  meterNo?: string; meterCatalog?: string; meterType?: number; meterExtra?: string; installationYear?: number;
  billingCategory?: string; unitPrice?: number; diffPrice?: number; monthlyFee?: number;
  minAmount?: number; minAmount2?: number; subscriberType?: number; kmGroup?: number; kmType?: number; prepaidFlag?: boolean;
  status?: number; disconnectFlag?: number; networkFlag?: number; activeFlag?: number; electricityStatus?: number;
  smsEnabled?: boolean; smsType?: number; messageType?: number; smsFlag?: number; contactFlag?: number;
  debitAccount?: number; debitAccount2?: number; serialNum?: string; secretCode?: number;
  categoryCode?: string; indexAll?: number; balance?: number; voucherNo?: number;
  notes?: string; workFlag?: number; modificationFlag?: number;
  billingDate?: string; registrationDate?: string; billingDay?: number; extraAddress?: string;
}

export interface ReadingCycle { id?: number; cycleNo: number; cycleSeq?: number; dateFrom: string; dateTo: string; status: number; groupId?: number; totalSubscribers?: number; totalRead?: number; totalConsumption?: number; }
export interface MeterReading { id?: number; cycleId: number; subscriberNoa: number; meterName?: string; prevReading: number; currReading: number; consumption: number; netConsumption: number; isAnomaly: boolean; anomalyReason?: string; status: number; }
export interface BillingCycle { id?: number; cycleName: string; billingMonth: number; billingYear: number; status: number; totalInvoices?: number; totalAmount?: number; }
export interface BillingInvoice { id?: number; invoiceNo: number; subscriberNoa: number; subscriberName?: string; prevReading?: number; currReading?: number; consumption?: number; totalAmount?: number; paidAmount?: number; remainingAmount?: number; status: number; invoiceDate: string; }
export interface TariffPlan { id?: number; name: string; billingType: string; unitPrice: number; minCharge?: number; fixedFee?: number; taxRate?: number; tiers?: TariffTier[]; }
export interface TariffTier { tierOrder: number; fromUnits: number; toUnits?: number; pricePerUnit: number; }
export interface ElectricityGroup { id?: number; nog: number; name: string; type?: number; area?: string; collectorId?: number; }
export interface ElectricityCollector { id?: number; nomk2?: number; name: string; mobile?: string; groupId?: number; }
export interface MessageTemplate { id?: number; name: string; templateType: string; channel?: string; content: string; }

@Injectable({ providedIn: 'root' })
export class ElectricityWorkflowService {
  constructor(private api: ApiService) {}

  // ══════════════════════════════════════════
  // المشتركين (29 endpoint → 48 حقل)
  // ══════════════════════════════════════════
  getSubscriberStats(): Observable<any> { return this.api.get('electricity/subscribers/stats'); }
  quickSearchSubscribers(term: string): Observable<any> { return this.api.get(`electricity/subscribers/quick-search?term=${term}`); }
  getOverdueSubscribers(minBalance = 10000): Observable<any> { return this.api.get(`electricity/subscribers/overdue?minBalance=${minBalance}`); }
  getSubscribers(params: any = {}): Observable<any> {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') q.set(k, String(v)); });
    return this.api.get(`electricity/subscribers?${q.toString()}`);
  }
  getSubscriber(noa: number): Observable<any> { return this.api.get(`electricity/subscribers/${noa}`); }
  createSubscriber(data: Partial<ElectricitySubscriber>): Observable<any> { return this.api.post('electricity/subscribers', data); }
  updateSubscriber(noa: number, data: Partial<ElectricitySubscriber>): Observable<any> { return this.api.put(`electricity/subscribers/${noa}`, data); }
  deleteSubscriber(noa: number): Observable<any> { return this.api.delete(`electricity/subscribers/${noa}`); }
  toggleDisconnect(noa: number): Observable<any> { return this.api.patch(`electricity/subscribers/${noa}/toggle-disconnect`, {}); }
  updateBalance(noa: number, amount: number, operation: 'add' | 'subtract'): Observable<any> { return this.api.patch(`electricity/subscribers/${noa}/balance`, { amount, operation }); }

  // ══════════════════════════════════════════
  // القراءات
  // ══════════════════════════════════════════
  getReadingStats(): Observable<any> { return this.api.get('electricity/readings/stats'); }
  createReadingCycle(data: { dateFrom: string; dateTo: string; groupId?: number; notes?: string }): Observable<any> { return this.api.post('electricity/readings/cycles', data); }
  getReadingCycles(): Observable<any> { return this.api.get('electricity/readings/cycles'); }
  closeReadingCycle(cycleId: number): Observable<any> { return this.api.patch(`electricity/readings/cycles/${cycleId}/close`, {}); }
  getCycleReadings(cycleId: number, params: any = {}): Observable<any> {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null) q.set(k, String(v)); });
    return this.api.get(`electricity/readings/cycles/${cycleId}/readings?${q.toString()}`);
  }
  recordReading(cycleId: number, data: { subscriberNoa: number; currReading: number }): Observable<any> { return this.api.post(`electricity/readings/cycles/${cycleId}/record`, data); }
  bulkRecordReadings(cycleId: number, readings: { subscriberNoa: number; currReading: number }[]): Observable<any> { return this.api.post(`electricity/readings/cycles/${cycleId}/bulk-record`, { readings }); }
  createMeterChange(data: any): Observable<any> { return this.api.post('electricity/readings/meter-changes', data); }
  getMeterChanges(noa?: number): Observable<any> { return this.api.get(`electricity/readings/meter-changes${noa ? '?subscriberNoa=' + noa : ''}`); }
  createAdjustment(data: any): Observable<any> { return this.api.post('electricity/readings/adjustments', data); }

  // ══════════════════════════════════════════
  // الفوترة
  // ══════════════════════════════════════════
  getBillingStats(): Observable<any> { return this.api.get('electricity/billing/stats'); }
  getTariffs(): Observable<any> { return this.api.get('electricity/billing/tariffs'); }
  createTariff(data: Partial<TariffPlan>): Observable<any> { return this.api.post('electricity/billing/tariffs', data); }
  generateBilling(data: { billingMonth: number; billingYear: number; readingCycleId: number; groupId?: number; tariffId?: number }): Observable<any> { return this.api.post('electricity/billing/generate', data); }
  postBilling(data: { billingCycleId: number; debitAccount?: number; creditAccount?: number }): Observable<any> { return this.api.post('electricity/billing/post', data); }
  recordPayment(data: { invoiceId: number; amount: number; paymentMethod?: string; voucherNos?: number }): Observable<any> { return this.api.post('electricity/billing/payments', data); }
  getBillingCycles(): Observable<any> { return this.api.get('electricity/billing/cycles'); }
  getSubscriberInvoices(noa: number): Observable<any> { return this.api.get(`electricity/billing/invoices/subscriber/${noa}`); }
  getUnpaidInvoices(noa?: number): Observable<any> { return this.api.get(`electricity/billing/invoices/unpaid${noa ? '?noa=' + noa : ''}`); }

  // ══════════════════════════════════════════
  // المجموعات والمحصلين
  // ══════════════════════════════════════════
  getGroupStats(): Observable<any> { return this.api.get('electricity/groups/stats'); }
  getGroups(): Observable<any> { return this.api.get('electricity/groups'); }
  createGroup(data: Partial<ElectricityGroup>): Observable<any> { return this.api.post('electricity/groups', data); }
  updateGroup(id: number, data: any): Observable<any> { return this.api.put(`electricity/groups/${id}`, data); }
  deleteGroup(id: number): Observable<any> { return this.api.delete(`electricity/groups/${id}`); }
  getCollectors(): Observable<any> { return this.api.get('electricity/groups/collectors/list'); }
  createCollector(data: Partial<ElectricityCollector>): Observable<any> { return this.api.post('electricity/groups/collectors', data); }
  updateCollector(id: number, data: any): Observable<any> { return this.api.put(`electricity/groups/collectors/${id}`, data); }

  // ══════════════════════════════════════════
  // الرسائل
  // ══════════════════════════════════════════
  getMessageStats(): Observable<any> { return this.api.get('electricity/messages/stats'); }
  getMessageTemplates(): Observable<any> { return this.api.get('electricity/messages/templates'); }
  createMessageTemplate(data: Partial<MessageTemplate>): Observable<any> { return this.api.post('electricity/messages/templates', data); }
  sendMessage(data: { subscriberNoa: number; templateId?: number; customMessage?: string }): Observable<any> { return this.api.post('electricity/messages/send', data); }
  bulkSendMessages(data: { templateId?: number; subscriberNoas?: number[] }): Observable<any> { return this.api.post('electricity/messages/bulk-send', data); }
  getMessages(params: any = {}): Observable<any> {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null) q.set(k, String(v)); });
    return this.api.get(`electricity/messages?${q.toString()}`);
  }

  // ══════════════════════════════════════════
  // التقارير (8 تقارير)
  // ══════════════════════════════════════════
  getAvailableReports(): Observable<any> { return this.api.get('electricity/reports'); }
  getSubscriberStatement(noa: number): Observable<any> { return this.api.get(`electricity/reports/subscriber-statement/${noa}`); }
  getMonthlyBillingReport(month: number, year: number, groupId?: number): Observable<any> { return this.api.get(`electricity/reports/monthly-billing?month=${month}&year=${year}${groupId ? '&groupId=' + groupId : ''}`); }
  getUnpaidInvoicesReport(groupId?: number): Observable<any> { return this.api.get(`electricity/reports/unpaid-invoices${groupId ? '?groupId=' + groupId : ''}`); }
  getReadingsReport(cycleId: number): Observable<any> { return this.api.get(`electricity/reports/readings/${cycleId}`); }
  getDailyCollectionReport(date: string): Observable<any> { return this.api.get(`electricity/reports/daily-collection?date=${date}`); }
  getConsumptionByGroupReport(month?: number, year?: number): Observable<any> { return this.api.get(`electricity/reports/consumption-by-group${month ? '?month=' + month + '&year=' + year : ''}`); }
  getDisconnectionReport(minBalance?: number): Observable<any> { return this.api.get(`electricity/reports/disconnection-list${minBalance ? '?minBalance=' + minBalance : ''}`); }
  getFinancialSummaryReport(): Observable<any> { return this.api.get('electricity/reports/financial-summary'); }

  // ══════════════════════════════════════════
  // القديم (التوافق)
  // ══════════════════════════════════════════
  getLegacyStats(): Observable<any> { return this.api.get('electricity/stats'); }
  getLegacyMeters(params?: any): Observable<any> { return this.api.get('electricity/meters', { params }); }
  getLegacyCenters(): Observable<any> { return this.api.get('electricity/centers'); }
  getLegacyGenerators(params?: any): Observable<any> { return this.api.get('electricity/generators', { params }); }
  getLegacyInstallations(params?: any): Observable<any> { return this.api.get('electricity/installations', { params }); }

  // ══════════════════════════════════════════
  // الطباعة (5 أنواع)
  // ══════════════════════════════════════════
  getPrintInvoiceUrl(invoiceId: number): string { return `/api/electricity/print/invoice/${invoiceId}`; }
  getPrintReceiptUrl(invoiceId: number, amount: number): string { return `/api/electricity/print/receipt/${invoiceId}?amount=${amount}`; }
  getPrintStatementUrl(noa: number): string { return `/api/electricity/print/statement/${noa}`; }
  getPrintDailyUrl(date: string): string { return `/api/electricity/print/daily-report?date=${date}`; }
  getPrintMonthlyUrl(month: number, year: number): string { return `/api/electricity/print/monthly-billing?month=${month}&year=${year}`; }

  // ══════════════════════════════════════════
  // سندات الشبكة
  // ══════════════════════════════════════════
  getNetworkStats(): Observable<any> { return this.api.get('electricity/network/stats'); }
  getNetworkVouchers(status?: number): Observable<any> { return this.api.get(`electricity/network/vouchers${status !== undefined ? '?status=' + status : ''}`); }
  createNetworkVoucher(data: any): Observable<any> { return this.api.post('electricity/network/vouchers', data); }
  confirmNetworkVoucher(id: number): Observable<any> { return this.api.post(`electricity/network/vouchers/${id}/confirm`, {}); }
  postNetworkVoucher(id: number): Observable<any> { return this.api.post(`electricity/network/vouchers/${id}/post`, {}); }
  getCashboxes(): Observable<any> { return this.api.get('electricity/network/cashboxes'); }
  createCashbox(name: string): Observable<any> { return this.api.post('electricity/network/cashboxes', { name }); }
  getVoucherArchive(noa?: number): Observable<any> { return this.api.get(`electricity/network/archive${noa ? '?noa=' + noa : ''}`); }
  createSettlement(data: any): Observable<any> { return this.api.post('electricity/network/settlements', data); }
  getSettlements(noa?: number): Observable<any> { return this.api.get(`electricity/network/settlements${noa ? '?noa=' + noa : ''}`); }
  approveSettlement(id: number): Observable<any> { return this.api.post(`electricity/network/settlements/${id}/approve`, {}); }

  // ══════════════════════════════════════════
  // ربط السندات بالفواتير
  // ══════════════════════════════════════════
  linkVoucherToInvoice(voucherNos: number, invoiceId: number, amount: number): Observable<any> { return this.api.post('electricity/billing/link-voucher', { voucherNos, invoiceId, amount }); }
  autoPayFromVoucher(subscriberNoa: number, totalAmount: number, voucherNos: number): Observable<any> { return this.api.post('electricity/billing/auto-pay', { subscriberNoa, totalAmount, voucherNos }); }
  findLinkableInvoices(noa: number): Observable<any> { return this.api.get(`electricity/billing/linkable-invoices/${noa}`); }

  // ══════════════════════════════════════════
  // تقارير متقدمة
  // ══════════════════════════════════════════
  getDetailedStatement(noa: number): Observable<any> { return this.api.get(`electricity/reports/detailed-statement/${noa}`); }
  getCollectorReport(collectorId?: number): Observable<any> { return this.api.get(`electricity/reports/collector${collectorId ? '?collectorId=' + collectorId : ''}`); }
  getCenterReport(centerId?: number): Observable<any> { return this.api.get(`electricity/reports/center${centerId ? '?centerId=' + centerId : ''}`); }
  getMonthlyComparisonReport(year: number): Observable<any> { return this.api.get(`electricity/reports/monthly-comparison?year=${year}`); }
  getNetworkReport(): Observable<any> { return this.api.get('electricity/reports/network'); }

  // ══════════════════════════════════════════
  // الصلاحيات
  // ══════════════════════════════════════════
  getRoles(): Observable<any> { return this.api.get('permissions/roles'); }
  getPermissions(): Observable<any> { return this.api.get('permissions/permissions'); }
  getRolePermissions(roleId: number): Observable<any> { return this.api.get(`permissions/roles/${roleId}/permissions`); }
  assignPermToRole(roleId: number, permId: number): Observable<any> { return this.api.post(`permissions/roles/${roleId}/permissions/${permId}`, {}); }
  removePermFromRole(roleId: number, permId: number): Observable<any> { return this.api.delete(`permissions/roles/${roleId}/permissions/${permId}`); }
  getUserPerms(userId: number): Observable<any> { return this.api.get(`permissions/users/${userId}`); }
  getUserMenu(userId: number): Observable<any> { return this.api.get(`permissions/menu/${userId}`); }
  getSmsGatewayStatus(): Observable<any> { return this.api.get('electricity/messages/gateway-status'); }
}
