-- =============================================
-- المرحلة 2: جداول نظام القراءات
-- بديل: REDMZ + REDMMZ + REDM + MZ
-- =============================================

-- ─── 2.1 جدول دورات القراءة (بديل REDMZ) ───
CREATE TABLE IF NOT EXISTS meter_reading_cycles (
    id                  SERIAL PRIMARY KEY,
    cycle_no            INTEGER NOT NULL,                  -- رقم الدورة (NOS)
    cycle_seq           INTEGER,                           -- التسلسل في السنة (NOSON)
    date_from           DATE NOT NULL,                     -- تاريخ بداية الدورة (DATES)
    date_to             DATE NOT NULL,                     -- تاريخ نهاية الدورة (DATES2)
    status              INTEGER DEFAULT 0,                 -- 0=مفتوحة 1=مغلقة 2=مفوترة
    group_id            INTEGER REFERENCES electricity_groups(id), -- المجموعة
    center_id           INTEGER,                           -- المركز
    total_subscribers   INTEGER DEFAULT 0,                 -- عدد المشتركين
    total_read          INTEGER DEFAULT 0,                 -- عدد المقروء
    total_consumption   DECIMAL(18,2) DEFAULT 0,           -- إجمالي الاستهلاك
    notes               TEXT,
    created_by          INTEGER,                           -- المستخدم المنشئ
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at           TIMESTAMP,
    UNIQUE(cycle_no)
);

-- ─── 2.2 جدول القراءات التفصيلية (بديل REDMMZ) ───
CREATE TABLE IF NOT EXISTS meter_readings (
    id                  SERIAL PRIMARY KEY,
    cycle_id            INTEGER NOT NULL REFERENCES meter_reading_cycles(id),
    subscriber_id       INTEGER NOT NULL REFERENCES electricity_subscribers(id),
    subscriber_noa      INTEGER NOT NULL,                  -- رقم المشترك (NOA)
    meter_name          VARCHAR(200),                      -- اسم العداد (NOZ2 من MZ)
    meter_extra_no      VARCHAR(50),                       -- رقم العداد البديل (NOADDN)

    -- ─── بيانات القراءة ───
    prev_reading        DECIMAL(18,2) DEFAULT 0,           -- القراءة السابقة (KS)
    curr_reading        DECIMAL(18,2) DEFAULT 0,           -- القراءة الحالية (KH)
    consumption         DECIMAL(18,2) DEFAULT 0,           -- الاستهلاك = KH - KS (AST)
    adjusted_reading    DECIMAL(18,2) DEFAULT 0,           -- القراءة المعدلة (KHR)
    adjustment_amount   DECIMAL(18,2) DEFAULT 0,           -- مبلغ التعديل (KHZ)
    net_consumption     DECIMAL(18,2) DEFAULT 0,           -- الفرق الصافي (FRK = AST - KHR - KHZ)
    cumulative_diff     DECIMAL(18,2) DEFAULT 0,           -- الفرق التراكمي (FRKT)
    calculated_reading  DECIMAL(18,2) DEFAULT 0,           -- القراءة المحسوبة (KASB)
    unit_price          DECIMAL(10,2) DEFAULT 0,           -- سعر الوحدة (SKH)

    -- ─── تواريخ ───
    reading_date_from   DATE,                              -- تاريخ القراءة من (DATESF)
    reading_date_to     DATE,                              -- تاريخ القراءة إلى (DATESF2)
    reading_date        TIMESTAMP,                         -- تاريخ الإدخال الفعلي

    -- ─── حالة وتدقيق ───
    status              INTEGER DEFAULT 0,                 -- 0=معلق 1=مؤكد 2=شاذ 3=مفوتر
    is_anomaly          BOOLEAN DEFAULT FALSE,             -- قراءة شاذة؟
    anomaly_reason      TEXT,                              -- سبب الشذوذ
    record_no           INTEGER,                           -- رقم السجل (RECNO)
    entered_by          INTEGER,                           -- المستخدم المدخل
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(cycle_id, subscriber_noa)
);

-- ─── 2.3 جدول تغيير العدادات (بديل TRK) ───
CREATE TABLE IF NOT EXISTS meter_changes (
    id                  SERIAL PRIMARY KEY,
    subscriber_id       INTEGER NOT NULL REFERENCES electricity_subscribers(id),
    subscriber_noa      INTEGER NOT NULL,
    old_meter_no        VARCHAR(50),                       -- رقم العداد القديم
    new_meter_no        VARCHAR(50),                       -- رقم العداد الجديد
    removal_reading     DECIMAL(18,2),                     -- قراءة الفك
    install_reading     DECIMAL(18,2),                     -- قراءة التركيب
    change_date         DATE NOT NULL,                     -- تاريخ التغيير
    reason              TEXT,                              -- سبب التغيير
    approved_by         INTEGER,
    status              INTEGER DEFAULT 0,                 -- 0=معلق 1=مؤكد
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── 2.4 جدول تسويات القراءة (بديل A_D_TRK + DATAKSNF) ───
CREATE TABLE IF NOT EXISTS meter_reading_adjustments (
    id                  SERIAL PRIMARY KEY,
    subscriber_id       INTEGER NOT NULL REFERENCES electricity_subscribers(id),
    subscriber_noa      INTEGER NOT NULL,
    cycle_id            INTEGER REFERENCES meter_reading_cycles(id),
    adjustment_type     VARCHAR(20) NOT NULL,              -- نوع: reading/consumption/billing
    old_value           DECIMAL(18,2),                     -- القيمة القديمة
    new_value           DECIMAL(18,2),                     -- القيمة الجديدة
    difference          DECIMAL(18,2),                     -- الفرق
    reason              TEXT NOT NULL,                     -- سبب التسوية
    approved_by         INTEGER,
    status              INTEGER DEFAULT 0,                 -- 0=معلق 1=معتمد
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at         TIMESTAMP
);

-- ─── الفهارس ───
CREATE INDEX idx_reading_cycle ON meter_readings(cycle_id);
CREATE INDEX idx_reading_sub ON meter_readings(subscriber_noa);
CREATE INDEX idx_reading_status ON meter_readings(status);
CREATE INDEX idx_cycle_status ON meter_reading_cycles(status);
CREATE INDEX idx_cycle_dates ON meter_reading_cycles(date_from, date_to);
CREATE INDEX idx_change_sub ON meter_changes(subscriber_noa);
CREATE INDEX idx_adjust_sub ON meter_reading_adjustments(subscriber_noa);
