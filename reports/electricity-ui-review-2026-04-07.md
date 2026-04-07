# مراجعة صفحات الكهرباء

تاريخ المراجعة: 2026-04-07
طريقة المراجعة: Edge headless + Playwright على الواجهة الحية `http://localhost:4200` مع API حي `http://localhost:3000`.
ملف النتائج الخام: `D:\alabasi\Wael1\electricity-system-COMPLETE\reports\electricity-ui-audit-2026-04-07\results.json`

## حالة عامة
- الواجهة تعمل وتفتح مسارات الكهرباء كلها.
- لا توجد أخطاء API توقف الصفحات الأساسية.
- البيانات الحقيقية تظهر الآن في: المشتركين، الفوترة، التحصيل، الرسائل.
- الصفحات الناقصة وظيفيًا الآن: القراءات، سجل العدادات، الترحيل، التقارير، المراكز.

## صفحة بصفحة

### 1. overview
- الحالة: تعمل.
- ما يظهر: خريطة الدورة، إحصاءات أساسية، بطاقات انتقال للشاشات.
- الملاحظة: النص ما زال يذكر `sndk22` رغم أن صفحة التحصيل أصبحت تعتمد `SNDK/SNDKF`.
- لقطة: `D:\alabasi\Wael1\electricity-system-COMPLETE\reports\electricity-ui-audit-2026-04-07\overview.png`

### 2. subscribers
- الحالة: تعمل جيدًا.
- ما يظهر: `1928` مشتركًا، قائمة + ملف للمشترك المحدد.
- ما ينقص: الشاشة لا تزال مبسطة مقارنة بـ `tel` القديم؛ لا تعرض كل حقول العداد، المجموعة، المستلم، نوع الرسائل، وتصنيف المشترك الكهربائي.
- لقطة: `D:\alabasi\Wael1\electricity-system-COMPLETE\reports\electricity-ui-audit-2026-04-07\subscribers.png`

### 3. readings
- الحالة: تفتح لكن التنفيذ جزئي جدًا.
- ما يظهر: عداد واحد فقط، مع نموذج حفظ قراءة.
- سبب النقص: المصدر الحالي هو جدول `mz` في `public` وفيه سجل واحد فقط، لذلك الصفحة لا تمثل دورة القراءة القديمة فعليًا.
- لقطة: `D:\alabasi\Wael1\electricity-system-COMPLETE\reports\electricity-ui-audit-2026-04-07\readings.png`

### 4. billing
- الحالة: تعمل جيدًا كعرض بيانات قديمة.
- ما يظهر: `30` سجلًا في الصفحة الأولى من `DATAFFX`، ورقم الفاتورة ظاهر.
- ما ينقص: الصفحة ما زالت قراءة فقط، ولا تنفذ إصدار فوترة جديد أو تصفية تشغيلية بالشهر/المجموعة/الدورة كما في النظام القديم.
- لقطة: `D:\alabasi\Wael1\electricity-system-COMPLETE\reports\electricity-ui-audit-2026-04-07\billing.png`

### 5. posting
- الحالة: تفتح لكن بلا بيانات.
- ما يظهر: واجهة منظمة، لكن جدول الترحيل فارغ.
- السبب: `THOEL` في النسخة المسترجعة لا يحتوي سجلات تشغيلية.
- لقطة: `D:\alabasi\Wael1\electricity-system-COMPLETE\reports\electricity-ui-audit-2026-04-07\posting.png`

### 6. collections
- الحالة: تعمل جيدًا.
- ما يظهر: `30` سندًا في الصفحة الأولى، بإجمالي ظاهر `2,610,830` وعدد تفاصيل `434`.
- الملاحظة: هذه من أكثر الصفحات نضجًا الآن لأنها مربوطة فعليًا بـ `SNDK/SNDKF`.
- لقطة: `D:\alabasi\Wael1\electricity-system-COMPLETE\reports\electricity-ui-audit-2026-04-07\collections.png`

### 7. messages
- الحالة: تعمل جيدًا.
- ما يظهر: `30` سجل متابعة في الصفحة الأولى، وكلها تقريبًا بهاتف وقناة إشعار.
- الملاحظة: الصفحة ناجحة كعرض بيانات، لكنها لا تنفذ إرسالًا فعليًا أو إدارة قوالب الرسائل بعد.
- لقطة: `D:\alabasi\Wael1\electricity-system-COMPLETE\reports\electricity-ui-audit-2026-04-07\messages.png`

### 8. reports
- الحالة: تفتح لكن ليست شاشة تقارير فعلية بعد.
- ما يظهر: خريطة انتقال فقط.
- ما ينقص: لا يوجد طباعة، لا تصدير، لا معاينة تقرير فعلي من `repkh*` أو `repday` أو `repmsm`.
- لقطة: `D:\alabasi\Wael1\electricity-system-COMPLETE\reports\electricity-ui-audit-2026-04-07\reports.png`

### 9. meters
- الحالة: تعمل تقنيًا لكن ببيانات قليلة جدًا.
- ما يظهر: سجل عدادات بعداد واحد فقط.
- السبب: `public.mz = 1` و `legacy_clone.mz = 1`، لذلك البيانات نفسها قليلة هنا.
- لقطة: `D:\alabasi\Wael1\electricity-system-COMPLETE\reports\electricity-ui-audit-2026-04-07\meters.png`

### 10. installations
- الحالة: تفتح لكن فارغة.
- السبب: `trkb = 0` في المصدر المستنسخ وفي `public` أيضًا.
- لقطة: `D:\alabasi\Wael1\electricity-system-COMPLETE\reports\electricity-ui-audit-2026-04-07\installations.png`

### 11. generators
- الحالة: تفتح لكن بلا بيانات.
- السبب: `moldat = 0` في المصدر المستنسخ.
- لقطة: `D:\alabasi\Wael1\electricity-system-COMPLETE\reports\electricity-ui-audit-2026-04-07\generators.png`

### 12. centers
- الحالة: تفتح لكن بلا بيانات رغم وجود أصل قديم جزئي.
- السبب: في `legacy_clone.mrcze` يوجد `4` سجلات، لكن `public.mrcze = 0`، وهذا يعني أن ترحيل المراكز إلى الجداول التشغيلية لم يكتمل بعد.
- لقطة: `D:\alabasi\Wael1\electricity-system-COMPLETE\reports\electricity-ui-audit-2026-04-07\centers.png`

## الخلاصة التنفيذية
- الجاهز الآن بشكل جيد: `subscribers`, `billing`, `collections`, `messages`.
- الجاهز شكليًا لكن ناقص تشغيليًا: `overview`, `readings`, `reports`, `meters`.
- المفتوح لكنه فارغ بحسب البيانات أو الربط: `posting`, `installations`, `generators`, `centers`.

## الأولويات التالية
1. رفع دقة شاشة المشترك لتقترب من `tel` القديم.
2. إعادة بناء القراءة لتعمل على بيانات المشتركين/العدادات الفعلية بدل الاعتماد على سجل `mz` الوحيد.
3. ترحيل `mrcze` إلى الجداول التشغيلية حتى تعمل صفحة المراكز.
4. تحويل شاشة التقارير من خريطة انتقال إلى تقارير فعلية قابلة للمعاينة والطباعة.
