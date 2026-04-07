// =============================================
// بيانات أولية (Database Seed)
// =============================================
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

async function runSeed() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: +(process.env.DB_PORT || 3306),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'electricity_accounting',
  });

  await dataSource.initialize();
  const queryRunner = dataSource.createQueryRunner();

  try {
    console.log('🌱 بدء إدخال البيانات الأولية...');

    // المستخدم الرئيسي
    const hashedPass = await bcrypt.hash('admin123', 10);
    await queryRunner.query(`
      INSERT IGNORE INTO user_u (nou, nameu, pass, passs, statu, ed, de, repa, kokogo)
      VALUES (1, 'مدير النظام', '${hashedPass}', '${hashedPass}', 1, 'Y', 'Y', 'ALL', 1)
    `);
    console.log('✅ تم إنشاء المستخدم الرئيسي (مدير النظام)');

    // مستخدم عادي
    const userPass = await bcrypt.hash('user123', 10);
    await queryRunner.query(`
      INSERT IGNORE INTO user_u (nou, nameu, pass, passs, statu, ed, de, repa)
      VALUES (2, 'محاسب', '${userPass}', '${userPass}', 1, 'Y', 'N', 'BASIC')
    `);
    console.log('✅ تم إنشاء مستخدم المحاسب');

    // دليل الحسابات الرئيسي
    const accounts = [
      [1, 'الأصول', 0], [2, 'الخصوم', 1], [3, 'حقوق الملكية', 4],
      [4, 'الإيرادات', 2], [5, 'المصروفات', 3],
      [6, 'الأصول المتداولة', 0], [7, 'الأصول الثابتة', 0],
      [8, 'الخصوم المتداولة', 1], [9, 'الخصوم طويلة الأجل', 1],
      [10, 'إيرادات الكهرباء', 2], [11, 'إيرادات التركيبات', 2],
      [12, 'مصروفات التشغيل', 3], [13, 'مصروفات الصيانة', 3],
    ];
    for (const [no_a, name_a, ts] of accounts) {
      await queryRunner.query(
        `INSERT IGNORE INTO data_a (no_a, name_a, ts) VALUES (?, ?, ?)`,
        [no_a, name_a, ts],
      );
    }
    console.log('✅ تم إنشاء دليل الحسابات الرئيسي');

    // حسابات فرعية
    const subAccounts = [
      [101, 'الصندوق', 6], [102, 'البنك', 6], [103, 'المدينون', 6],
      [201, 'الدائنون', 8], [202, 'أوراق الدفع', 8],
      [301, 'رأس المال', 3], [302, 'الأرباح المحتجزة', 3],
      [401, 'إيرادات بيع الكهرباء', 10], [402, 'إيرادات رسوم التركيب', 11],
      [403, 'إيرادات الاشتراكات', 10],
      [501, 'مصروفات الوقود', 12], [502, 'مصروفات قطع الغيار', 13],
      [503, 'مصروفات الرواتب', 12], [504, 'مصروفات الصيانة', 13],
      [1001, 'شركة النور للكهرباء', 6], [1002, 'مؤسسة الطاقة المتجددة', 6],
      [2001, 'مصنع المحولات الكهربائية', 8], [2002, 'شركة الكابلات العراقية', 8],
    ];
    for (const [noa, namea, typea] of subAccounts) {
      await queryRunner.query(
        `INSERT IGNORE INTO data_ac (noa, namea, typea) VALUES (?, ?, ?)`,
        [noa, namea, typea],
      );
    }
    console.log('✅ تم إنشاء الحسابات الفرعية');

    // السنة المالية
    await queryRunner.query(`
      INSERT IGNORE INTO year (year, start_date, end_date, status)
      VALUES (2026, '2026-01-01', '2026-12-31', 1)
    `);
    console.log('✅ تم إنشاء السنة المالية 2026');

    console.log('\n🎉 تم إدخال جميع البيانات الأولية بنجاح!');
    console.log('📋 بيانات الدخول:');
    console.log('   مدير النظام: رقم 1 / كلمة السر: admin123');
    console.log('   محاسب: رقم 2 / كلمة السر: user123');
  } catch (error) {
    console.error('❌ خطأ:', error.message);
  } finally {
    await dataSource.destroy();
  }
}

runSeed();
