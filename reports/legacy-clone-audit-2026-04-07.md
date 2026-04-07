# تقرير الاستنساخ والتدقيق

تاريخ التقرير: 2026-04-07

## الملخص
- تم الاستنساخ الخام الكامل من Oracle owner DATASOGW إلى PostgreSQL schema legacy_clone.
- عدد جداول الأعمال المنسوخة: 130، إضافة إلى 4 جداول metadata داخل legacy_clone.
- عدد الـ views المحفوظة كتعريفات: 3.
- تم تحديث الجداول التشغيلية في public من نفس المصدر الواسع.
- تم إصلاح API الحسابات الفرعية ليقبل typea رسميًا، وبالتالي عادت شاشة المشتركين للعمل على فلتر كهرباء فقط.

## بيانات الاستنساخ
~~~text
 source_owner | table_count | view_count |         cloned_at          
--------------+-------------+------------+----------------------------
 DATASOGW     |         130 |          3 | 2026-04-07 16:39:56.307952
(1 row)

~~~

## الجداول الأكبر في legacy_clone
~~~text
 table_name | row_count 
------------+-----------
 DATAK      |    135000
 DATAFF     |    106765
 SNDKF      |     30363
 TSSNF      |      6067
 SNDKSNF    |      5004
 DATA_AC    |      1952
 DATA_AM    |      1928
 DEL_R      |      1876
 TR         |      1874
 SENDSMS    |      1847
 SYSDATA    |      1407
 TSSX       |      1003
 DATAFFX    |       876
 GRP        |       499
 T_R_T      |       437
 SNDKYF     |       356
 KAK        |       177
 REPMSM     |       131
 SNDK       |       117
 USERGN     |       103
 DATAF      |        59
 PRG        |        53
 MKB        |        52
 REPKHM     |        52
 FIN        |        42
(25 rows)

~~~

## الجداول التشغيلية في public
~~~text
 table_name | row_count 
------------+-----------
 data_ac    |      1952
 data_am    |      1928
 dataff     |    106765
 dataffx    |       876
 datak      |    135000
 grp        |       497
 repmsm     |       131
 sndk       |       117
 sndkf      |     30363
 tr         |      1874
 user_u     |         2
 usergn     |       103
(12 rows)

~~~

## حالة المشتركين
~~~text
 typea | count 
-------+-------
     1 |     5
     2 |  1928
     3 |     1
     5 |     9
     6 |     6
     7 |     1
     8 |     1
     9 |     1
(8 rows)

 electricity_subscribers 
-------------------------
                    1928
(1 row)

 matched_data_am 
-----------------
            1928
(1 row)

~~~

## تحقق الواجهات والـ API
- GET /api/accounts/sub?page=1&pageSize=5&typea=2 يعمل الآن ويرجع 1928 مشتركًا.
- GET /api/legacy/dataffx?skip=0&take=5 يرجع 876 سجل فوترة.
- GET /api/vouchers/receipt?page=1&pageSize=5 يرجع 117 سند قبض مع التفاصيل.
- GET /api/legacy/repmsm?skip=0&take=5 يرجع 131 سجل متابعة ورسائل.
- http://localhost:3000/api/docs-json يرد 200.
- http://localhost:4200 يرد 200.

## الملفات الناتجة
- تقرير Markdown: D:\alabasi\Wael1\electricity-system-COMPLETE\reports\legacy-clone-audit-2026-04-07.md
- ملف CSV الكامل لعد الجداول: D:\alabasi\Wael1\electricity-system-COMPLETE\reports\legacy-clone-table-counts-2026-04-07.csv

## ملاحظات
- العدد المعتمد الحالي للمشتركين الكهربائيين هو 1928، وهو أحدث وأدق من الاستيرادات الأقدم.
- الفرق بين legacy_clone و public طبيعي لأن public يحتوي فقط الجداول المربوطة بالنظام الجديد، بينما legacy_clone استنساخ خام شامل.
- الإصلاح الأخير كان في backend داخل src/accounts وليس في الواجهة، لأن الخلل كان تحقق DTO في الـ API.
