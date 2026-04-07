-- =============================================
-- المرحلة 4: جداول الرسائل والصلاحيات
-- بديل: SENDSMS + PRG + USERGN + HMH
-- =============================================

-- ─── 4.1 قوالب الرسائل ───
CREATE TABLE IF NOT EXISTS message_templates (
    id                  SERIAL PRIMARY KEY,
    name                VARCHAR(200) NOT NULL,
    template_type       VARCHAR(50) NOT NULL,               -- balance/invoice/payment/overdue/disconnect
    channel             VARCHAR(20) DEFAULT 'sms',          -- sms/whatsapp/both
    content             TEXT NOT NULL,                       -- نص الرسالة مع placeholders
    is_active           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── 4.2 الرسائل الصادرة ───
CREATE TABLE IF NOT EXISTS outbound_messages (
    id                  SERIAL PRIMARY KEY,
    subscriber_id       INTEGER REFERENCES electricity_subscribers(id),
    subscriber_noa      INTEGER,
    subscriber_name     VARCHAR(200),
    phone_number        VARCHAR(50),
    template_id         INTEGER REFERENCES message_templates(id),
    channel             VARCHAR(20) DEFAULT 'sms',
    message_text        TEXT NOT NULL,
    status              INTEGER DEFAULT 0,                  -- 0=معلق 1=مرسل 2=فشل 3=مسلّم
    sent_at             TIMESTAMP,
    error_message       TEXT,
    related_type        VARCHAR(50),                        -- invoice/payment/reading/overdue
    related_id          INTEGER,
    created_by          INTEGER,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── 4.3 الأدوار ───
CREATE TABLE IF NOT EXISTS roles (
    id                  SERIAL PRIMARY KEY,
    name                VARCHAR(100) NOT NULL UNIQUE,
    description         TEXT,
    is_active           BOOLEAN DEFAULT TRUE,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── 4.4 الصلاحيات ───
CREATE TABLE IF NOT EXISTS permissions (
    id                  SERIAL PRIMARY KEY,
    module              VARCHAR(100) NOT NULL,               -- electricity/vouchers/reports...
    action              VARCHAR(50) NOT NULL,                -- read/create/update/delete/approve/print
    description         VARCHAR(300),
    UNIQUE(module, action)
);

-- ─── 4.5 ربط الدور بالصلاحية ───
CREATE TABLE IF NOT EXISTS role_permissions (
    id                  SERIAL PRIMARY KEY,
    role_id             INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id       INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE(role_id, permission_id)
);

-- ─── 4.6 ربط المستخدم بالدور ───
CREATE TABLE IF NOT EXISTS user_roles (
    id                  SERIAL PRIMARY KEY,
    user_id             INTEGER NOT NULL,
    role_id             INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    UNIQUE(user_id, role_id)
);

-- ─── 4.7 عناصر القائمة الديناميكية ───
CREATE TABLE IF NOT EXISTS menu_items (
    id                  SERIAL PRIMARY KEY,
    parent_id           INTEGER REFERENCES menu_items(id),
    title               VARCHAR(200) NOT NULL,
    icon                VARCHAR(50),
    route               VARCHAR(200),
    sort_order          INTEGER DEFAULT 0,
    module              VARCHAR(100),
    permission_needed   VARCHAR(100),
    is_active           BOOLEAN DEFAULT TRUE
);

-- ─── بيانات أولية للأدوار ───
INSERT INTO roles (name, description) VALUES
    ('admin', 'مدير النظام - صلاحيات كاملة'),
    ('accountant', 'محاسب - إدارة الفواتير والسندات'),
    ('reader', 'قارئ العدادات - إدخال القراءات'),
    ('collector', 'محصل - التحصيل والسداد'),
    ('viewer', 'مشاهد - عرض فقط')
ON CONFLICT DO NOTHING;

-- ─── بيانات أولية للصلاحيات ───
INSERT INTO permissions (module, action, description) VALUES
    ('subscribers', 'read', 'عرض المشتركين'),
    ('subscribers', 'create', 'إضافة مشترك'),
    ('subscribers', 'update', 'تعديل مشترك'),
    ('subscribers', 'delete', 'حذف مشترك'),
    ('readings', 'read', 'عرض القراءات'),
    ('readings', 'create', 'إدخال قراءة'),
    ('readings', 'update', 'تعديل قراءة'),
    ('readings', 'approve', 'اعتماد قراءة'),
    ('billing', 'read', 'عرض الفواتير'),
    ('billing', 'create', 'إصدار فاتورة'),
    ('billing', 'approve', 'اعتماد فاتورة'),
    ('billing', 'post', 'ترحيل فاتورة'),
    ('collections', 'read', 'عرض التحصيل'),
    ('collections', 'create', 'تسجيل سداد'),
    ('collections', 'print', 'طباعة سند'),
    ('reports', 'read', 'عرض التقارير'),
    ('reports', 'print', 'طباعة تقرير'),
    ('messages', 'read', 'عرض الرسائل'),
    ('messages', 'send', 'إرسال رسالة'),
    ('settings', 'manage', 'إدارة الإعدادات'),
    ('users', 'manage', 'إدارة المستخدمين')
ON CONFLICT DO NOTHING;

-- ─── الفهارس ───
CREATE INDEX idx_msg_subscriber ON outbound_messages(subscriber_noa);
CREATE INDEX idx_msg_status ON outbound_messages(status);
CREATE INDEX idx_msg_date ON outbound_messages(created_at);
