-- =============================================
-- المرحلة 3: جداول نظام الفوترة والترحيل
-- بديل: FATM + FATMF + THOEL + التعرفة
-- =============================================

-- ─── 3.1 جدول خطط التعرفة ───
CREATE TABLE IF NOT EXISTS tariff_plans (
    id                  SERIAL PRIMARY KEY,
    name                VARCHAR(200) NOT NULL,
    billing_type        VARCHAR(20) NOT NULL DEFAULT 'ampere', -- ampere/kilo/special
    unit_price          DECIMAL(10,4) NOT NULL,            -- سعر الوحدة
    min_charge          DECIMAL(10,2) DEFAULT 0,           -- الحد الأدنى
    fixed_fee           DECIMAL(10,2) DEFAULT 0,           -- رسوم ثابتة
    tax_rate            DECIMAL(5,2) DEFAULT 0,            -- نسبة الضريبة
    service_fee         DECIMAL(10,2) DEFAULT 0,           -- رسوم خدمة
    is_active           BOOLEAN DEFAULT TRUE,
    effective_from      DATE,
    effective_to        DATE,
    notes               TEXT,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── 3.2 شرائح الاستهلاك ───
CREATE TABLE IF NOT EXISTS tariff_tiers (
    id                  SERIAL PRIMARY KEY,
    tariff_id           INTEGER NOT NULL REFERENCES tariff_plans(id) ON DELETE CASCADE,
    tier_order          INTEGER NOT NULL,                   -- ترتيب الشريحة
    from_units          DECIMAL(10,2) NOT NULL,             -- من وحدة
    to_units            DECIMAL(10,2),                      -- إلى وحدة (NULL = لا نهائي)
    price_per_unit      DECIMAL(10,4) NOT NULL,             -- سعر الوحدة في الشريحة
    UNIQUE(tariff_id, tier_order)
);

-- ─── 3.3 دورات الفوترة (بديل جزئي لـ DATAF) ───
CREATE TABLE IF NOT EXISTS billing_cycles (
    id                  SERIAL PRIMARY KEY,
    cycle_name          VARCHAR(100) NOT NULL,
    billing_month       INTEGER NOT NULL,                   -- الشهر (1-12)
    billing_year        INTEGER NOT NULL,                   -- السنة
    reading_cycle_id    INTEGER REFERENCES meter_reading_cycles(id),
    group_id            INTEGER REFERENCES electricity_groups(id),
    status              INTEGER DEFAULT 0,                  -- 0=مفتوح 1=مكتمل 2=مرحّل
    total_invoices      INTEGER DEFAULT 0,
    total_amount        DECIMAL(18,2) DEFAULT 0,
    created_by          INTEGER,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at        TIMESTAMP,
    UNIQUE(billing_month, billing_year, group_id)
);

-- ─── 3.4 الفواتير (بديل FATM) ───
CREATE TABLE IF NOT EXISTS billing_invoices (
    id                  SERIAL PRIMARY KEY,
    invoice_no          INTEGER NOT NULL,                   -- رقم الفاتورة (NOS)
    invoice_seq         INTEGER,                            -- التسلسل (NOSON)
    billing_cycle_id    INTEGER NOT NULL REFERENCES billing_cycles(id),
    subscriber_id       INTEGER NOT NULL REFERENCES electricity_subscribers(id),
    subscriber_noa      INTEGER NOT NULL,
    subscriber_name     VARCHAR(200),
    reading_id          INTEGER REFERENCES meter_readings(id),

    -- ─── بيانات القراءة ───
    prev_reading        DECIMAL(18,2) DEFAULT 0,
    curr_reading        DECIMAL(18,2) DEFAULT 0,
    consumption         DECIMAL(18,2) DEFAULT 0,

    -- ─── بيانات مالية ───
    unit_price          DECIMAL(10,4) DEFAULT 0,
    consumption_amount  DECIMAL(18,2) DEFAULT 0,            -- مبلغ الاستهلاك
    fixed_fees          DECIMAL(18,2) DEFAULT 0,            -- رسوم ثابتة
    service_fees        DECIMAL(18,2) DEFAULT 0,            -- رسوم خدمة
    tax_amount          DECIMAL(18,2) DEFAULT 0,            -- الضريبة
    discount_amount     DECIMAL(18,2) DEFAULT 0,            -- الخصم
    total_amount        DECIMAL(18,2) DEFAULT 0,            -- الإجمالي
    previous_balance    DECIMAL(18,2) DEFAULT 0,            -- الرصيد السابق
    grand_total         DECIMAL(18,2) DEFAULT 0,            -- الإجمالي الكلي

    -- ─── حالة ───
    invoice_date        DATE NOT NULL,
    due_date            DATE,
    status              INTEGER DEFAULT 0,                  -- 0=مسودة 1=صادرة 2=مرحّلة 3=مسددة جزئياً 4=مسددة
    paid_amount         DECIMAL(18,2) DEFAULT 0,
    remaining_amount    DECIMAL(18,2) DEFAULT 0,

    -- ─── بيانات إضافية ───
    tariff_id           INTEGER REFERENCES tariff_plans(id),
    account_no          INTEGER,                            -- رقم الحساب (NOA)
    counter_account     INTEGER,                            -- الحساب المقابل (NOSMSR)
    invoice_type        INTEGER DEFAULT 1,                  -- نوع الفاتورة (TYSN)
    memo                TEXT,
    created_by          INTEGER,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(invoice_no)
);

-- ─── 3.5 بنود الفاتورة (بديل FATMF) ───
CREATE TABLE IF NOT EXISTS billing_invoice_items (
    id                  SERIAL PRIMARY KEY,
    invoice_id          INTEGER NOT NULL REFERENCES billing_invoices(id) ON DELETE CASCADE,
    item_type           VARCHAR(50) NOT NULL,               -- consumption/fixed_fee/service/tax/discount
    description         VARCHAR(300),
    account_no          INTEGER,                            -- رقم الحساب (NOAF)
    account_name        VARCHAR(200),                       -- اسم الحساب (NAMEAF)
    quantity            DECIMAL(18,2) DEFAULT 0,
    unit_price          DECIMAL(10,4) DEFAULT 0,
    amount              DECIMAL(18,2) DEFAULT 0,            -- المبلغ
    debit_amount        DECIMAL(18,2) DEFAULT 0,            -- مدين (KMA)
    credit_amount       DECIMAL(18,2) DEFAULT 0,            -- دائن (KMAS)
    item_order          INTEGER DEFAULT 0
);

-- ─── 3.6 جدول الترحيل (بديل THOEL) ───
CREATE TABLE IF NOT EXISTS billing_postings (
    id                  SERIAL PRIMARY KEY,
    posting_no          INTEGER NOT NULL,                   -- رقم الترحيل (NOS)
    posting_seq         INTEGER,                            -- التسلسل (NOSON)
    posting_date        DATE NOT NULL,                      -- تاريخ الترحيل
    billing_cycle_id    INTEGER REFERENCES billing_cycles(id),
    invoice_id          INTEGER REFERENCES billing_invoices(id),

    -- ─── القيد المحاسبي ───
    debit_account       INTEGER NOT NULL,                   -- الحساب المدين (NOA)
    credit_account      INTEGER NOT NULL,                   -- الحساب الدائن (NOA2)
    amount              DECIMAL(18,2) NOT NULL,             -- المبلغ (TOTL)
    description         TEXT,                               -- الوصف (NMS)
    memo                TEXT,                               -- ملاحظات (MEMOS)

    -- ─── بيانات إضافية ───
    journal_no          INTEGER,                            -- رقم القيد (NOK)
    journal_seq         INTEGER,                            -- تسلسل القيد (NOKON)
    ref_voucher         INTEGER,                            -- سند مرجعي (NOSNF)
    posted_by           INTEGER,                            -- المستخدم (NOUSX)
    status              INTEGER DEFAULT 0,                  -- 0=معلق 1=مرحّل 2=ملغي
    approved_flag       INTEGER DEFAULT 0,                  -- (UPD)
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    posted_at           TIMESTAMP,

    UNIQUE(posting_no)
);

-- ─── 3.7 جدول المدفوعات (ربط السداد بالفاتورة) ───
CREATE TABLE IF NOT EXISTS invoice_payments (
    id                  SERIAL PRIMARY KEY,
    invoice_id          INTEGER NOT NULL REFERENCES billing_invoices(id),
    voucher_nos         INTEGER,                            -- رقم سند القبض (SNDK.NOS)
    payment_date        DATE NOT NULL,
    amount              DECIMAL(18,2) NOT NULL,
    payment_method      VARCHAR(50) DEFAULT 'cash',         -- cash/network/transfer
    cashbox_id          INTEGER,
    received_by         INTEGER,
    notes               TEXT,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── الفهارس ───
CREATE INDEX idx_invoice_cycle ON billing_invoices(billing_cycle_id);
CREATE INDEX idx_invoice_sub ON billing_invoices(subscriber_noa);
CREATE INDEX idx_invoice_status ON billing_invoices(status);
CREATE INDEX idx_invoice_date ON billing_invoices(invoice_date);
CREATE INDEX idx_posting_cycle ON billing_postings(billing_cycle_id);
CREATE INDEX idx_posting_status ON billing_postings(status);
CREATE INDEX idx_payment_invoice ON invoice_payments(invoice_id);
CREATE INDEX idx_billing_cycle_month ON billing_cycles(billing_month, billing_year);
