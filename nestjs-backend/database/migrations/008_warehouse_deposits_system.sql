-- =============================================
-- المرحلة 8: جداول المخازن والأمانات والنظام
-- بديل: mhzn + mkrna + amandhs + إعدادات متقدمة
-- =============================================

CREATE TABLE IF NOT EXISTS electricity_warehouse (
    id              SERIAL PRIMARY KEY,
    item_no         INTEGER UNIQUE NOT NULL,
    name            VARCHAR(200) NOT NULL,
    category        VARCHAR(50),
    unit            VARCHAR(50),
    quantity        DECIMAL(18,2) DEFAULT 0,
    unit_price      DECIMAL(10,2) DEFAULT 0,
    min_stock       DECIMAL(10,2) DEFAULT 0,
    location        VARCHAR(200),
    notes           TEXT,
    status          INTEGER DEFAULT 1,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS warehouse_movements (
    id              SERIAL PRIMARY KEY,
    item_id         INTEGER NOT NULL REFERENCES electricity_warehouse(id),
    movement_type   VARCHAR(20) NOT NULL,
    quantity        DECIMAL(18,2) NOT NULL,
    unit_price      DECIMAL(10,2),
    dates           DATE NOT NULL,
    reason          TEXT,
    subscriber_noa  INTEGER,
    created_by      INTEGER,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS electricity_deposits (
    id              SERIAL PRIMARY KEY,
    deposit_no      INTEGER UNIQUE NOT NULL,
    subscriber_noa  INTEGER,
    subscriber_name VARCHAR(200),
    amount          DECIMAL(18,2) NOT NULL,
    deposit_type    VARCHAR(50) NOT NULL,
    dates           DATE NOT NULL,
    status          INTEGER DEFAULT 0,
    notes           TEXT,
    returned_date   DATE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إعدادات النظام الموسعة
CREATE TABLE IF NOT EXISTS system_config (
    id              SERIAL PRIMARY KEY,
    config_key      VARCHAR(100) UNIQUE NOT NULL,
    config_value    TEXT,
    config_type     VARCHAR(20) DEFAULT 'string',
    category        VARCHAR(50),
    description     VARCHAR(300),
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- سجل العمليات (audit log)
CREATE TABLE IF NOT EXISTS audit_log (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER,
    user_name       VARCHAR(200),
    action          VARCHAR(50) NOT NULL,
    module          VARCHAR(100),
    entity_type     VARCHAR(100),
    entity_id       INTEGER,
    old_value       TEXT,
    new_value       TEXT,
    ip_address      VARCHAR(50),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- بيانات أولية: إعدادات النظام
INSERT INTO system_config (config_key, config_value, config_type, category, description) VALUES
    ('company_name', 'شركة الطاقة الكهربائية', 'string', 'general', 'اسم الشركة'),
    ('company_phone', '', 'string', 'general', 'هاتف الشركة'),
    ('company_address', '', 'string', 'general', 'عنوان الشركة'),
    ('default_tariff_id', '1', 'number', 'billing', 'التعرفة الافتراضية'),
    ('billing_day', '1', 'number', 'billing', 'يوم الفوترة الشهري'),
    ('overdue_days', '30', 'number', 'billing', 'أيام التأخير قبل الإنذار'),
    ('disconnect_threshold', '50000', 'number', 'billing', 'حد الفصل (مديونية)'),
    ('sms_enabled', 'true', 'boolean', 'messaging', 'تفعيل الرسائل'),
    ('sms_provider', 'mock', 'string', 'messaging', 'مزود SMS'),
    ('receipt_copies', '2', 'number', 'printing', 'عدد نسخ السند'),
    ('fiscal_year_start', '01-01', 'string', 'accounting', 'بداية السنة المالية'),
    ('currency', 'ريال', 'string', 'general', 'العملة'),
    ('backup_enabled', 'true', 'boolean', 'system', 'النسخ الاحتياطي التلقائي'),
    ('backup_path', './backups', 'string', 'system', 'مسار النسخ الاحتياطي')
ON CONFLICT (config_key) DO NOTHING;

-- فهارس
CREATE INDEX idx_warehouse_cat ON electricity_warehouse(category);
CREATE INDEX idx_wh_move_item ON warehouse_movements(item_id);
CREATE INDEX idx_deposit_sub ON electricity_deposits(subscriber_noa);
CREATE INDEX idx_deposit_status ON electricity_deposits(status);
CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_module ON audit_log(module);
CREATE INDEX idx_audit_date ON audit_log(created_at);
CREATE INDEX idx_config_cat ON system_config(category);
