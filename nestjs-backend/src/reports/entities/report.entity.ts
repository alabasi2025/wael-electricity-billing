// =============================================
// كيانات التقارير (بدون تكرار datak + sndk)
// تستخدم الكيانات من الوحدات الأخرى
// =============================================

// Re-export from other modules to avoid duplicates
export { JournalEntryFullEntity as JournalEntryEntity } from '../../journal/journal.module';
export { ReceiptVoucherEntity as VoucherEntity } from '../../vouchers/vouchers.module';
