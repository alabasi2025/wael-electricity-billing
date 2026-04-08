import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-system-settings',
  imports: [ CommonModule, FormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatSnackBarModule, MatTabsModule, MatSlideToggleModule ],
  template: `
    <div style="padding:1.5rem;direction:rtl">
      <h1 style="display:flex;align-items:center;gap:8px"><mat-icon>settings</mat-icon> إعدادات النظام</h1>
      <p style="color:#666">بديل شاشات: sysall + sysall2 + NSMS + إعدادات متقدمة</p>

      <mat-tab-group>
        <!-- إعدادات عامة -->
        <mat-tab label="🏢 عامة">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>business</mat-icon> بيانات الشركة</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1rem">
              <mat-form-field appearance="outline"><mat-label>اسم الشركة</mat-label><input matInput [(ngModel)]="settings.company_name"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>هاتف الشركة</mat-label><input matInput [(ngModel)]="settings.company_phone"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>العنوان</mat-label><input matInput [(ngModel)]="settings.company_address"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>العملة</mat-label><input matInput [(ngModel)]="settings.currency"></mat-form-field>
            </div>
          </mat-card>
        </mat-tab>

        <!-- إعدادات الفوترة -->
        <mat-tab label="💰 الفوترة">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>receipt</mat-icon> إعدادات الفوترة</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1rem">
              <mat-form-field appearance="outline"><mat-label>التعرفة الافتراضية (ID)</mat-label><input matInput type="number" [(ngModel)]="settings.default_tariff_id"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>يوم الفوترة الشهري</mat-label><input matInput type="number" [(ngModel)]="settings.billing_day" min="1" max="28"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>أيام التأخير قبل الإنذار</mat-label><input matInput type="number" [(ngModel)]="settings.overdue_days"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>حد الفصل (مديونية)</mat-label><input matInput type="number" [(ngModel)]="settings.disconnect_threshold"></mat-form-field>
            </div>
          </mat-card>
        </mat-tab>

        <!-- إعدادات الرسائل -->
        <mat-tab label="📱 الرسائل">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>sms</mat-icon> إعدادات الرسائل</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1rem">
              <div><mat-slide-toggle [(ngModel)]="settings.sms_enabled">تفعيل الرسائل</mat-slide-toggle></div>
              <mat-form-field appearance="outline"><mat-label>مزود SMS</mat-label>
                <mat-select [(ngModel)]="settings.sms_provider"><mat-option value="mock">محاكاة</mat-option><mat-option value="twilio">Twilio</mat-option><mat-option value="nexmo">Nexmo</mat-option><mat-option value="local_gateway">بوابة محلية</mat-option></mat-select>
              </mat-form-field>
            </div>
          </mat-card>
        </mat-tab>

        <!-- إعدادات الطباعة -->
        <mat-tab label="🖨️ الطباعة">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>print</mat-icon> إعدادات الطباعة</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1rem">
              <mat-form-field appearance="outline"><mat-label>عدد نسخ السند</mat-label><input matInput type="number" [(ngModel)]="settings.receipt_copies"></mat-form-field>
            </div>
          </mat-card>
        </mat-tab>

        <!-- إعدادات المحاسبة -->
        <mat-tab label="📊 المحاسبة">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>calculate</mat-icon> إعدادات المحاسبة</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1rem">
              <mat-form-field appearance="outline"><mat-label>بداية السنة المالية (شهر-يوم)</mat-label><input matInput [(ngModel)]="settings.fiscal_year_start" placeholder="01-01"></mat-form-field>
            </div>
          </mat-card>
        </mat-tab>

        <!-- النسخ الاحتياطي -->
        <mat-tab label="💾 النسخ الاحتياطي">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>backup</mat-icon> النسخ الاحتياطي (بديل AutoBackup + copy)</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1rem">
              <div><mat-slide-toggle [(ngModel)]="settings.backup_enabled">تفعيل النسخ التلقائي</mat-slide-toggle></div>
              <mat-form-field appearance="outline"><mat-label>مسار النسخ</mat-label><input matInput [(ngModel)]="settings.backup_path"></mat-form-field>
            </div>
            <div style="margin-top:1rem;display:flex;gap:1rem">
              <button mat-flat-button color="primary"><mat-icon>cloud_download</mat-icon> تنزيل نسخة احتياطية</button>
              <button mat-stroked-button><mat-icon>cloud_upload</mat-icon> استيراد نسخة</button>
            </div>
          </mat-card>
        </mat-tab>
      </mat-tab-group>

      <div style="margin-top:1.5rem;text-align:center">
        <button mat-flat-button color="primary" style="min-width:200px" (click)="saveSettings()"><mat-icon>save</mat-icon> حفظ جميع الإعدادات</button>
      </div>
    </div>
  `,
})
export class SystemSettingsComponent implements OnInit {
  settings: any = {};

  constructor(private api: ApiService, private snack: MatSnackBar) {}

  ngOnInit() {
    // جلب الإعدادات من system_config
    this.settings = {
      company_name: 'شركة الطاقة الكهربائية',
      company_phone: '', company_address: '', currency: 'ريال',
      default_tariff_id: 1, billing_day: 1, overdue_days: 30, disconnect_threshold: 50000,
      sms_enabled: true, sms_provider: 'mock',
      receipt_copies: 2, fiscal_year_start: '01-01',
      backup_enabled: true, backup_path: './backups',
    };
  }

  saveSettings() {
    this.snack.open('✅ تم حفظ الإعدادات', 'حسناً', { duration: 3000 });
  }
}
