// =============================================
// الوحدة الرئيسية المحدّثة (App Module)
// تشمل جميع وحدات النظام
// =============================================
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

// Core
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

// Modules
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { JournalModule } from './journal/journal.module';
import { VouchersModule } from './vouchers/vouchers.module';
import { InvoicesModule } from './invoices/invoices.module';
import { ClosingDepositsModule } from './closing/closing.module';
import { EmployeesModule } from './employees/employees.module';
import { ElectricityModule } from './electricity/electricity.module';
import { SettingsFinancialModule } from './settings/settings.module';
import { ReportsModule } from './reports/reports.module';
import { LegacyModule } from './legacy/legacy.module';

@Module({
  imports: [
    // ─── Configuration ───
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    // ─── Database ───
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbType = config.get('DB_TYPE') || 'better-sqlite3';
        const isSqlite = dbType === 'better-sqlite3' || dbType === 'sqlite';
        return {
          type: dbType,
          database: isSqlite
            ? (config.get('DB_DATABASE') || './electricity_accounting.db')
            : (config.get('DB_DATABASE') || 'electricity_accounting'),
          ...(isSqlite ? {} : {
            host: config.get('DB_HOST') || 'localhost',
            port: +config.get('DB_PORT') || 3306,
            username: config.get('DB_USERNAME') || 'root',
            password: config.get('DB_PASSWORD') || '',
            charset: 'utf8mb4',
          }),
          entities: [__dirname + '/**/*.entity{.ts,.js}', __dirname + '/**/*.module{.ts,.js}'],
          synchronize: true,
          logging: false,
        } as any;
      },
    }),

    // ─── All Feature Modules ───
    AuthModule,              // المصادقة وتسجيل الدخول
    UsersModule,             // إدارة المستخدمين (USER_U + SYSDATA)
    AccountsModule,          // الحسابات (DATA_A + DATA_AC + DATA_AM + GRP)
    JournalModule,           // القيود المحاسبية (DATAK + DATAKSNF + KDAY)
    VouchersModule,          // السندات (SNDK/SNDS/SNDKY/SNDKNET + تفاصيلها)
    InvoicesModule,          // الفواتير (FATM/FATMF + FATB/FATBF)
    ClosingDepositsModule,   // الإقفالات + الأمانات + الأعمال (AKFA + AMANDHS + AMLH)
    EmployeesModule,         // الموظفين (EMP1 + EMP2 + EMPAB1 + EMPAB2)
    ElectricityModule,       // الكهرباء (MZ + TRKB + MOLDAT + MOLDATS + MRCZE + HSMMSH)
    SettingsFinancialModule, // الإعدادات + المالية + المذكرات + SMS + الميزانية
    ReportsModule,           // التقارير الشاملة
    LegacyModule,            // كل الجداول المتبقية (98 جدول) من النسخة الاحتياطية
  ],
  providers: [
    // Global Exception Filter
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    // Global Response Transform
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule {}
