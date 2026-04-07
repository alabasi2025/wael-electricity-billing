-- =============================================
-- المرحلة 1: جدول المشترك الكهربائي الكامل
-- بديل: DATA_AM + DATA_MO (48 حقل)
-- تاريخ: 2026-04-07
-- =============================================

-- ─── 1.1 جدول المشتركين الكهربائيين ───
CREATE TABLE IF NOT EXISTS electricity_subscribers (
    id                  SERIAL PRIMARY KEY,
    noa                 INTEGER UNIQUE NOT NULL,          -- رقم المشترك (المفتاح من DATA_AM)
    noan                INTEGER,                          -- الرقم البديل/المرجعي
    namea               VARCHAR(200) NOT NULL,            -- اسم المشترك
    namegar             VARCHAR(200),                     -- اسم الضامن/الكفيل
    address_text        VARCHAR(500),                     -- العنوان (MHLT)
    qm                  VARCHAR(50),                      -- وصف إضافي
    mobile              VARCHAR(50),                      -- رقم الهاتف (NOTMS)
    tel                 VARCHAR(50),                      -- هاتف ثابت

    -- ─── بيانات المجموعة والمنطقة ───
    group_id            INTEGER REFERENCES electricity_groups(id),  -- رقم المجموعة (NOG)
    sub_group_id        INTEGER,                          -- المجموعة الفرعية (NOGM)
    collector_id        INTEGER REFERENCES electricity_collectors(id), -- المحصل
    area_id             INTEGER,                          -- رقم منطقة الضامن (NOGAR)
    center_id           INTEGER REFERENCES mrcze(id),     -- رقم المركز (NOFSL)

    -- ─── بيانات العداد ───
    meter_no            VARCHAR(50),                      -- رقم العداد (NOMO)
    meter_catalog       VARCHAR(50),                      -- كتالوج العداد (NOKTA)
    meter_type          INTEGER DEFAULT 1,                -- نوع العداد (TYADD): 1=عادي 2=ثلاثي
    meter_extra         VARCHAR(50),                      -- عداد إضافي (REDADD)
    installation_year   INTEGER,                          -- سنة التركيب (YTRK)

    -- ─── بيانات الفوترة والتسعير ───
    billing_category    VARCHAR(20) DEFAULT 'ampere',     -- فئة الفوترة: ampere/kilo/special
    unit_price          DECIMAL(10,2) DEFAULT 0,          -- سعر الوحدة (SK)
    diff_price          DECIMAL(10,2) DEFAULT 0,          -- سعر الفرق (SKFK)
    monthly_fee         DECIMAL(10,2) DEFAULT 0,          -- الرسم الشهري (RMG)
    min_amount          DECIMAL(10,2) DEFAULT 0,          -- الحد الأدنى (MTMIN)
    min_amount2         DECIMAL(10,2) DEFAULT 0,          -- الحد الأدنى الثاني (MTMIN2)
    subscriber_type     INTEGER DEFAULT 1,                -- نوع المشترك (TYP)
    km_group            INTEGER,                          -- مجموعة الكيلومتر (GKM)
    km_type             INTEGER,                          -- نوع الكيلومتر (KMSN)
    prepaid_flag        BOOLEAN DEFAULT FALSE,            -- دفع مسبق (PRFG)

    -- ─── بيانات الحالة ───
    status              INTEGER DEFAULT 1,                -- الحالة العامة: 1=فعال
    disconnect_flag     INTEGER DEFAULT 0,                -- حالة الفصل (KN)
    network_flag        INTEGER DEFAULT 0,                -- حالة الشبكة (SHB)
    active_flag         INTEGER DEFAULT 1,                -- حالة التشغيل (HL)
    electricity_status  INTEGER DEFAULT 1,                -- حالة الكهرباء (KKR)

    -- ─── بيانات الرسائل ───
    sms_enabled         BOOLEAN DEFAULT FALSE,            -- حالة SMS (T_SMS)
    sms_type            INTEGER DEFAULT 0,                -- نوع الرسالة (TY_MS)
    message_type        INTEGER DEFAULT 0,                -- نوع الرسائل (MMSN)
    sms_flag            INTEGER DEFAULT 0,                -- علم SMS (SM)
    contact_flag        INTEGER DEFAULT 0,                -- حالة الاتصال (TL)

    -- ─── بيانات مالية ───
    debit_account       INTEGER,                          -- حساب مدين (NOAKD)
    debit_account2      INTEGER,                          -- حساب مدين ثانوي (SNOAKD)
    serial_num          VARCHAR(50),                      -- الرقم التسلسلي (SRNUMN)
    secret_code         INTEGER,                          -- رقم السرية (SARAM)
    category_code       VARCHAR(20),                      -- الحرف/الفئة (HRF)
    index_all           INTEGER,                          -- المؤشر الكلي (INDXALL)
    balance             DECIMAL(18,2) DEFAULT 0,          -- الرصيد الحالي (RHAS)
    voucher_no          INTEGER,                          -- رقم السند (NO_SND)

    -- ─── بيانات إضافية ───
    notes               TEXT,                             -- ملاحظات المشترك (MEMOMSH)
    work_flag           INTEGER DEFAULT 0,                -- حالة العمل (WK)
    modification_flag   INTEGER DEFAULT 0,                -- حالة التعديل (MOD)
    billing_date        DATE,                             -- تاريخ الفوترة (DATEF)
    registration_date   DATE,                             -- تاريخ التسجيل (DATET)
    billing_day         INTEGER,                          -- يوم الفوترة (DAY)
    extra_address       TEXT,                             -- عنوان إضافي (ADDMR)

    -- ─── طوابع زمنية ───
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── 1.2 جدول المجموعات ───
CREATE TABLE IF NOT EXISTS electricity_groups (
    id                  SERIAL PRIMARY KEY,
    nog                 INTEGER UNIQUE NOT NULL,           -- رقم المجموعة
    name                VARCHAR(200) NOT NULL,             -- اسم المجموعة
    type                INTEGER DEFAULT 1,                 -- نوع المجموعة
    area                VARCHAR(200),                      -- المنطقة
    collector_id        INTEGER,                           -- المحصل الافتراضي
    center_id           INTEGER,                           -- المركز المرتبط
    notes               TEXT,
    status              INTEGER DEFAULT 1,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── 1.3 جدول المحصلين ───
CREATE TABLE IF NOT EXISTS electricity_collectors (
    id                  SERIAL PRIMARY KEY,
    nomk2               INTEGER UNIQUE,                    -- رقم المحصل (من GRP.NOMK2)
    name                VARCHAR(200) NOT NULL,
    mobile              VARCHAR(50),
    group_id            INTEGER REFERENCES electricity_groups(id),
    status              INTEGER DEFAULT 1,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── الفهارس ───
CREATE INDEX idx_elec_sub_noa ON electricity_subscribers(noa);
CREATE INDEX idx_elec_sub_group ON electricity_subscribers(group_id);
CREATE INDEX idx_elec_sub_collector ON electricity_subscribers(collector_id);
CREATE INDEX idx_elec_sub_meter ON electricity_subscribers(meter_no);
CREATE INDEX idx_elec_sub_status ON electricity_subscribers(status);
CREATE INDEX idx_elec_sub_disconnect ON electricity_subscribers(disconnect_flag);
CREATE INDEX idx_elec_sub_name ON electricity_subscribers(namea);
