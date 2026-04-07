-- =============================================
-- المرحلة 5: جداول النواقص الحرجة
-- سندات الشبكة + صندوق النقد + الأرشيف + التسويات
-- =============================================

-- ─── 5.1 سندات الشبكة (بديل SNDKNET) ───
CREATE TABLE IF NOT EXISTS network_vouchers (
    id                  SERIAL PRIMARY KEY,
    voucher_no          INTEGER UNIQUE NOT NULL,
    voucher_seq         INTEGER,
    voucher_date        DATE NOT NULL,
    subscriber_noa      INTEGER NOT NULL,
    subscriber_name     VARCHAR(200),
    amount              DECIMAL(18,2) NOT NULL,
    payment_method      VARCHAR(50) DEFAULT 'network',
    reference_no        VARCHAR(100),
    bank_name           VARCHAR(200),
    memo                TEXT,
    status              INTEGER DEFAULT 0,  -- 0=معلق 1=مؤكد 2=مرحّل 3=مرفوض
    invoice_id          INTEGER,
    posted_to_sndk      INTEGER,
    created_by          INTEGER,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at        TIMESTAMP
);

-- ─── 5.2 صناديق النقد (بديل cashbox) ───
CREATE TABLE IF NOT EXISTS cashboxes (
    id                  SERIAL PRIMARY KEY,
    name                VARCHAR(200) NOT NULL,
    account_no          INTEGER,
    balance             DECIMAL(18,2) DEFAULT 0,
    status              INTEGER DEFAULT 1,
    responsible_user    INTEGER,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── 5.3 أرشيف السندات (بديل SNDK_A) ───
CREATE TABLE IF NOT EXISTS voucher_archive (
    id                  SERIAL PRIMARY KEY,
    original_type       VARCHAR(50) NOT NULL,
    original_id         INTEGER NOT NULL,
    voucher_no          INTEGER NOT NULL,
    subscriber_noa      INTEGER,
    dates               DATE,
    amount              DECIMAL(18,2),
    memo                TEXT,
    archived_by         INTEGER,
    archived_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── 5.4 التسويات المالية (بديل TSSX + TSSNF) ───
CREATE TABLE IF NOT EXISTS financial_settlements (
    id                  SERIAL PRIMARY KEY,
    settlement_no       INTEGER UNIQUE NOT NULL,
    subscriber_noa      INTEGER NOT NULL,
    settlement_type     VARCHAR(50) NOT NULL,
    original_amount     DECIMAL(18,2),
    settled_amount      DECIMAL(18,2),
    difference          DECIMAL(18,2),
    reason              TEXT,
    invoice_id          INTEGER,
    voucher_no          INTEGER,
    status              INTEGER DEFAULT 0,
    approved_by         INTEGER,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at         TIMESTAMP
);

-- ─── 5.5 ترحيل البيانات القديمة ───
CREATE TABLE IF NOT EXISTS data_migration_log (
    id                  SERIAL PRIMARY KEY,
    source_table        VARCHAR(100),
    target_table        VARCHAR(100),
    records_migrated    INTEGER DEFAULT 0,
    records_failed      INTEGER DEFAULT 0,
    migrated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes               TEXT
);

-- ─── فهارس ───
CREATE INDEX idx_nv_status ON network_vouchers(status);
CREATE INDEX idx_nv_sub ON network_vouchers(subscriber_noa);
CREATE INDEX idx_archive_sub ON voucher_archive(subscriber_noa);
CREATE INDEX idx_settle_sub ON financial_settlements(subscriber_noa);
CREATE INDEX idx_settle_status ON financial_settlements(status);

-- ─── بيانات أولية: صناديق النقد ───
INSERT INTO cashboxes (name, account_no, balance) VALUES
    ('الصندوق الرئيسي', 10001, 0),
    ('صندوق التحصيل', 10002, 0)
ON CONFLICT DO NOTHING;
