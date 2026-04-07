# ⚡ نظام الفوترة الكهربائية وايل

نظام فوترة ومحاسبة كهربائية **شامل** تم نقله من بيئة Oracle Forms القديمة (247 شاشة + 346 تقرير) إلى بنية ويب حديثة، مع الحفاظ على دورة العمل الكاملة.

## التقنيات المستخدمة
- **الواجهة الأمامية:** Angular 21 + Angular Material
- **الواجهة الخلفية:** NestJS 10 + TypeORM
- **قاعدة البيانات:** PostgreSQL
- **المصدر القديم:** Oracle Forms + Oracle Export Dumps

## 🏗️ هيكل المشروع
```
wael-electricity-billing/
├── angular-project/          ← Angular 21 (12 شاشة كهرباء)
├── nestjs-backend/           ← NestJS 10 (102 API endpoint)
│   ├── src/electricity/      ← 10 وحدات كهربائية
│   │   ├── subscribers/      ← المشتركين (48 حقل)
│   │   ├── meter-readings/   ← القراءات والعدادات
│   │   ├── billing-engine/   ← الفوترة والترحيل والسداد
│   │   ├── groups-collectors/ ← المجموعات والمحصلين
│   │   ├── messaging/        ← الرسائل SMS/WhatsApp
│   │   ├── reports-engine/   ← 13 تقرير
│   │   ├── print/            ← طباعة PDF/HTML (5 أنواع)
│   │   ├── network-vouchers/ ← سندات الشبكة والتسويات
│   │   └── tariff/           ← التعرفة والشرائح
│   ├── src/permissions/      ← الأدوار والصلاحيات
│   └── database/migrations/  ← 6 ملفات هجرة (31 جدول + 5 views)
├── reports/                  ← تقارير التدقيق
├── legacy-reference/         ← ملفات Oracle القديمة (مرجع فقط)
└── migration-plan-electricity.md
```

## 🔄 دورة العمل الكهربائية الكاملة
```
تسجيل مشترك → تركيب عداد → إنشاء دورة قراءة → إدخال قراءات
→ حساب استهلاك (شرائح) → إصدار فاتورة → ترحيل (قيود محاسبية)
→ تحصيل/سداد → طباعة فاتورة/سند → تقارير → رسائل SMS/WhatsApp
```

## 🌐 نقاط النهاية API (102 endpoint)

### المشتركين `/electricity/subscribers`
| Method | Path | الوصف |
|--------|------|-------|
| GET | /stats | إحصائيات |
| GET | /quick-search?term= | بحث سريع |
| GET | /overdue | المتأخرين |
| POST | / | إنشاء مشترك |
| GET | /?search=&groupId=&status= | قائمة + بحث |
| GET | /:noa | مشترك واحد |
| PUT | /:noa | تحديث |
| DELETE | /:noa | حذف |
| PATCH | /:noa/toggle-disconnect | فصل/توصيل |
| PATCH | /:noa/balance | تحديث رصيد |

### القراءات `/electricity/readings`
| Method | Path | الوصف |
|--------|------|-------|
| POST | /cycles | إنشاء دورة |
| GET | /cycles | قائمة الدورات |
| PATCH | /cycles/:id/close | إغلاق دورة |
| GET | /cycles/:id/readings | قراءات الدورة |
| POST | /cycles/:id/record | تسجيل قراءة |
| POST | /cycles/:id/bulk-record | قراءات جماعية |
| POST | /meter-changes | تغيير عداد |
| POST | /adjustments | تسوية |

### الفوترة `/electricity/billing`
| Method | Path | الوصف |
|--------|------|-------|
| POST | /generate | 🔥 إصدار فوترة شهرية |
| POST | /post | ✅ ترحيل |
| POST | /payments | 💰 تسجيل سداد |
| POST | /tariffs | إنشاء تعرفة |
| GET | /invoices/unpaid | فواتير مستحقة |

### الطباعة `/electricity/print`
| Method | Path | الوصف |
|--------|------|-------|
| GET | /invoice/:id | 🖨️ طباعة فاتورة |
| GET | /receipt/:id?amount= | 🖨️ طباعة سند قبض |
| GET | /statement/:noa | 🖨️ كشف حساب |
| GET | /daily-report?date= | 🖨️ تقرير يومي |
| GET | /monthly-billing?month=&year= | 🖨️ فواتير شهرية |

### التقارير `/electricity/reports` (13 تقرير)
### الرسائل `/electricity/messages` (مع SMS Gateway)
### سندات الشبكة `/electricity/network`
### الصلاحيات `/permissions`

## 🚀 التشغيل المحلي

```bash
# الواجهة الأمامية
cd angular-project && npm install && npm start
# → http://localhost:4200

# الواجهة الخلفية
cd nestjs-backend && npm install && npm run build && npm run start:dev
# → http://localhost:3000/api
# → Swagger: http://localhost:3000/api/docs
```

## ⚙️ إعدادات SMS Gateway
```env
SMS_PROVIDER=twilio          # twilio / nexmo / local_gateway / mock
SMS_API_KEY=your_key
SMS_API_SECRET=your_secret
WHATSAPP_API_URL=            # اختياري
WHATSAPP_TOKEN=              # اختياري
```

## 📊 الإحصائيات
- **6,528+ سطر كود** جديد
- **31 جدول** PostgreSQL + **5 Views**
- **102 نقطة نهاية** API
- **12 شاشة** Angular مُعاد بناؤها
- **13 تقرير** + **5 أنواع طباعة**
- **10 وحدات** Backend

## 🔄 المطابقة مع Oracle Forms القديم
| Oracle | الجديد | الحالة |
|--------|--------|--------|
| tel (48 حقل) | subscribers | ✅ |
| addmz + REDMZ | meter-readings | ✅ |
| ftora* + SAR_K | billing-engine | ✅ |
| thoel | billing-postings | ✅ |
| SNDK22 | collections + payments | ✅ |
| sndknet | network-vouchers | ✅ |
| msm + SENDSMS | messaging + SMS Gateway | ✅ |
| repkh1 + 12 تقرير | reports-engine | ✅ |
| Oracle Reports | print module (HTML) | ✅ |
| PRG/USERGN | permissions | ✅ |
| GRP/NOMK2 | groups-collectors | ✅ |
| TSSX/TSSNF | financial-settlements | ✅ |
