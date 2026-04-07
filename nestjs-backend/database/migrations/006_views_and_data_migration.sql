-- =============================================
-- المرحلة 6: Views قاعدة البيانات + ترحيل البيانات
-- بديل: data_acc + V_ACCOUNT_D + data_d
-- =============================================

-- ─── 6.1 View: بيانات المشترك الموحدة (بديل data_acc) ───
CREATE OR REPLACE VIEW v_subscriber_full AS
SELECT
    s.id, s.noa, s.noan, s.namea,
    s.address_text, s.qm, s.mobile, s.tel,
    s.meter_no, s.meter_type, s.billing_category,
    s.unit_price, s.monthly_fee, s.min_amount,
    s.group_id, g.name AS group_name,
    s.collector_id,
    s.status, s.disconnect_flag, s.sms_enabled,
    s.balance,
    s.prepaid_flag, s.subscriber_type
FROM electricity_subscribers s
LEFT JOIN electricity_groups g ON s.group_id = g.id;

-- ─── 6.2 View: أرصدة المشتركين (بديل V_ACCOUNT_D) ───
CREATE OR REPLACE VIEW v_subscriber_balances AS
SELECT
    s.noa,
    s.namea,
    s.group_id,
    s.collector_id,
    s.balance AS current_balance,
    COALESCE(inv.total_billed, 0) AS total_billed,
    COALESCE(inv.total_paid, 0) AS total_paid,
    COALESCE(inv.total_billed, 0) - COALESCE(inv.total_paid, 0) AS calculated_balance,
    COALESCE(inv.invoice_count, 0) AS invoice_count,
    COALESCE(inv.unpaid_count, 0) AS unpaid_count
FROM electricity_subscribers s
LEFT JOIN (
    SELECT
        subscriber_noa,
        SUM(total_amount) AS total_billed,
        SUM(paid_amount) AS total_paid,
        COUNT(*) AS invoice_count,
        COUNT(CASE WHEN remaining_amount > 0 THEN 1 END) AS unpaid_count
    FROM billing_invoices
    GROUP BY subscriber_noa
) inv ON s.noa = inv.subscriber_noa
WHERE s.status = 1;

-- ─── 6.3 View: حركات المشتركين (بديل data_d) ───
CREATE OR REPLACE VIEW v_subscriber_transactions AS
SELECT
    i.subscriber_noa AS noa,
    'invoice' AS transaction_type,
    i.invoice_no AS ref_no,
    i.invoice_date AS transaction_date,
    i.total_amount AS debit,
    0 AS credit,
    i.consumption AS quantity,
    'فاتورة كهرباء' AS description
FROM billing_invoices i
UNION ALL
SELECT
    i.subscriber_noa AS noa,
    'payment' AS transaction_type,
    i.invoice_no AS ref_no,
    i.updated_at::date AS transaction_date,
    0 AS debit,
    i.paid_amount AS credit,
    NULL AS quantity,
    'سداد فاتورة' AS description
FROM billing_invoices i
WHERE i.paid_amount > 0;

-- ─── 6.4 View: ملخص الاستهلاك حسب المجموعة ───
CREATE OR REPLACE VIEW v_consumption_by_group AS
SELECT
    s.group_id,
    g.name AS group_name,
    COUNT(DISTINCT s.noa) AS subscriber_count,
    SUM(i.consumption) AS total_consumption,
    SUM(i.total_amount) AS total_billed,
    SUM(i.paid_amount) AS total_paid,
    SUM(i.remaining_amount) AS total_unpaid
FROM electricity_subscribers s
LEFT JOIN electricity_groups g ON s.group_id = g.id
LEFT JOIN billing_invoices i ON s.noa = i.subscriber_noa
WHERE s.status = 1
GROUP BY s.group_id, g.name;

-- ─── 6.5 View: المشتركين المطلوب فصلهم ───
CREATE OR REPLACE VIEW v_disconnection_candidates AS
SELECT
    s.noa, s.namea, s.mobile, s.meter_no,
    s.balance, s.group_id,
    g.name AS group_name,
    s.billing_category
FROM electricity_subscribers s
LEFT JOIN electricity_groups g ON s.group_id = g.id
WHERE s.balance > 0 AND s.disconnect_flag = 0 AND s.status = 1
ORDER BY s.balance DESC;

-- ─── 6.6 سكربت ترحيل DATA_AM → electricity_subscribers ───
-- يُنفّذ مرة واحدة فقط لنقل البيانات القديمة
INSERT INTO electricity_subscribers (
    noa, namea, address_text, mobile, tel, balance, status,
    billing_category, created_at
)
SELECT
    am.noa,
    COALESCE(ac.namea, 'مشترك ' || am.noa),
    am.mhlt,
    am.tel,
    am.tel,
    0,
    1,
    'ampere',
    CURRENT_TIMESTAMP
FROM data_am am
LEFT JOIN data_ac ac ON am.noa = ac.noa
WHERE am.noa NOT IN (SELECT noa FROM electricity_subscribers)
  AND ac.typea = 2
ON CONFLICT (noa) DO NOTHING;

-- تسجيل عملية الترحيل
INSERT INTO data_migration_log (source_table, target_table, records_migrated, notes)
SELECT 'data_am + data_ac', 'electricity_subscribers',
    (SELECT COUNT(*) FROM electricity_subscribers),
    'ترحيل أولي من النظام القديم';
