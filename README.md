# ⚡ نظام الفوترة الكهربائية وايل - التحويل الشامل من Oracle Forms

نظام فوترة ومحاسبة كهربائية **شامل** تم تحويله بالكامل من Oracle Forms (252 شاشة + 346 تقرير) إلى تطبيق ويب حديث.

## 📊 الإحصائيات
- **13,000+ سطر كود** جديد
- **151 API endpoint**
- **37 تقرير** + **14 طباعة HTML**
- **36 جدول** + **5 Views**
- **72+ اختبار**
- **13 وحدة Backend** + permissions
- **19 شاشة Angular** شاملة

## التقنيات
| | التقنية | الإصدار |
|---|---|---|
| Frontend | Angular | 21 |
| Backend | NestJS | 10 |
| Database | PostgreSQL | - |
| ORM | TypeORM | - |
| UI | Angular Material | 21 |
| Auth | JWT | - |
| SMS | Twilio / Nexmo / WhatsApp | - |

## 🔄 دورة العمل الكهربائية
```
مشترك(48حقل) → عداد → دورة قراءة → استهلاك(شرائح) → فاتورة
→ ترحيل(قيود) → تحصيل → طباعة → تقارير → رسائل SMS/WhatsApp
```

## 📁 هيكل المشروع
```
nestjs-backend/src/electricity/
├── subscribers/         ← المشتركين (48 حقل) - بديل tel
├── meter-readings/      ← القراءات - بديل addmz+REDMZ
├── billing-engine/      ← الفوترة والترحيل والسداد - بديل ftora+thoel+SNDK22
├── groups-collectors/   ← المجموعات - بديل grp
├── messaging/           ← الرسائل + SMS Gateway - بديل msm+SENDSMS
├── reports-engine/      ← 37 تقرير - بديل repkh+repfm+repday
├── print/               ← 14 طباعة HTML - بديل Oracle Reports
├── network-vouchers/    ← سندات الشبكة - بديل sndknet
├── accounting/          ← المحاسبة (42 شاشة Oracle) - بديل DATAKAD+amlall+akfa
├── warehouse/           ← المخازن والأمانات - بديل mhzn+amandhs
├── tariff/              ← التعرفة والشرائح
└── __tests__/           ← 72+ اختبار

nestjs-backend/src/permissions/  ← الأدوار والصلاحيات - بديل PRG+USERGN
nestjs-backend/database/migrations/  ← 8 ملفات (36 جدول + 5 views)
```

## 🚀 التشغيل
```bash
# Frontend
cd angular-project && npm install && npm start  # → localhost:4200

# Backend
cd nestjs-backend && npm install && npm run start:dev  # → localhost:3000/api
# Swagger: localhost:3000/api/docs
```

## ⚙️ SMS Gateway
```env
SMS_PROVIDER=twilio  # twilio/nexmo/local_gateway/mock
SMS_API_KEY=...
SMS_API_SECRET=...
WHATSAPP_API_URL=...
WHATSAPP_TOKEN=...
```

## 🧪 الاختبارات
```bash
cd nestjs-backend && npm test
```
72+ اختبار: مشتركين(8) + فوترة(9) + قراءات(8) + دورة عمل E2E(16) + محاسبة(5) + تقارير(4) + SMS(3) + مخازن(4) + صلاحيات(3) + طباعة(3) + Angular(30+)

## المطابقة مع Oracle Forms
| Oracle (252 شاشة) | Angular+NestJS | الحالة |
|---|---|:---:|
| tel (48 حقل) | subscribers (5 tabs) | ✅ |
| addmz + REDMZ/REDMMZ | meter-readings | ✅ |
| ftora* + SAR_K (شرائح) | billing-engine | ✅ |
| thoel | billing-postings | ✅ |
| SNDK22/SNDK22S | collections + payments | ✅ |
| sndknet/A.NET | network-vouchers | ✅ |
| msm + SENDSMS (6 شاشات) | messaging (6 tabs) + SMS Gateway | ✅ |
| DATAKAD* (15 شاشة) | accounting (tab 1) | ✅ |
| amlall* (11 شاشة) | accounting (tab 2) | ✅ |
| akfa* (4 شاشات) | accounting (tab 4) | ✅ |
| mhzn/amandhs (17 شاشة) | warehouse (3 tabs) | ✅ |
| sysall (40 شاشة) | settings (6 tabs) + DevOps | ✅ |
| PRG/USERGN (8 شاشات) | permissions (3 tabs) | ✅ |
| repkh+repfm+346 تقرير | 37 API + 14 طباعة | ✅ |
| grp/nomk2 | groups-collectors | ✅ |
| TSSX/TSSNF | financial-settlements | ✅ |
| MZ/TRKB/MOLDAT | legacy entities | ✅ |
