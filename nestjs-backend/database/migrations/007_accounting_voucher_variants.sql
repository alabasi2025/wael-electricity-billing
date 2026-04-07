-- =============================================
-- المرحلة 7: جداول المحاسبة + سندات الصرف + التصنيفات
-- بديل: DATAK + KAK + SNDKY + SNDS + memo
-- =============================================

CREATE TABLE IF NOT EXISTS electricity_journal_entries (
    id                  SERIAL PRIMARY KEY,
    entry_no            INTEGER NOT NULL,
    entry_seq           INTEGER,
    entry_date          DATE NOT NULL,
    account_noa         INTEGER NOT NULL,
    debit               DECIMAL(18,2) DEFAULT 0,
    credit              DECIMAL(18,2) DEFAULT 0,
    entry_type          INTEGER DEFAULT 1,
    entry_name          VARCHAR(200),
    memo                TEXT,
    ref_no              INTEGER,
    fiscal_year         DATE,
    sub_entry_noa       INTEGER,
    sub_debit           DECIMAL(18,2) DEFAULT 0,
    sub_credit          DECIMAL(18,2) DEFAULT 0,
    special_rate        DECIMAL(10,2),
    status              INTEGER DEFAULT 0,
    created_by          INTEGER,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS electricity_categories (
    id                  SERIAL PRIMARY KEY,
    category_no         INTEGER UNIQUE NOT NULL,
    name                VARCHAR(200) NOT NULL,
    type                VARCHAR(50),
    description         TEXT,
    status              INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS electricity_memos (
    id                  SERIAL PRIMARY KEY,
    subscriber_noa      INTEGER,
    memo_type           VARCHAR(50),
    content             TEXT NOT NULL,
    related_type        VARCHAR(50),
    related_id          INTEGER,
    created_by          INTEGER,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_vouchers_elec (
    id                  SERIAL PRIMARY KEY,
    voucher_no          INTEGER UNIQUE NOT NULL,
    voucher_seq         INTEGER,
    dates               DATE NOT NULL,
    subscriber_noa      INTEGER,
    subscriber_name     VARCHAR(200),
    amount              DECIMAL(18,2) DEFAULT 0,
    voucher_type        VARCHAR(20) DEFAULT 'payment',
    memo                TEXT,
    account_no          INTEGER,
    counter_account     INTEGER,
    status              INTEGER DEFAULT 0,
    created_by          INTEGER,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS daily_vouchers_elec (
    id                  SERIAL PRIMARY KEY,
    voucher_no          INTEGER UNIQUE NOT NULL,
    dates               DATE NOT NULL,
    debit_account       INTEGER NOT NULL,
    credit_account      INTEGER NOT NULL,
    amount              DECIMAL(18,2) NOT NULL,
    description         TEXT,
    memo                TEXT,
    status              INTEGER DEFAULT 0,
    created_by          INTEGER,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- فهارس
CREATE INDEX idx_journal_noa ON electricity_journal_entries(account_noa);
CREATE INDEX idx_journal_date ON electricity_journal_entries(entry_date);
CREATE INDEX idx_journal_type ON electricity_journal_entries(entry_type);
CREATE INDEX idx_pay_voucher_sub ON payment_vouchers_elec(subscriber_noa);
CREATE INDEX idx_daily_voucher_date ON daily_vouchers_elec(dates);
