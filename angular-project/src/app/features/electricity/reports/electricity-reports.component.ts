import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { electricityPageStyles } from '../electricity-page.styles';

@Component({
  selector: 'app-electricity-reports',
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <div class="electricity-page" dir="rtl">
      <section class="hero">
        <div class="hero-copy">
          <span class="hero-kicker">REPKH / REPDAY / REPMSM</span>
          <h1>تقارير الكهرباء والمتابعة</h1>
          <p>
            هذه الصفحة تربط مجموعات تقارير الكهرباء القديمة مع المسارات الجديدة في Angular،
            حتى نعرف أين تُنفّذ القراءة والفوترة والتحصيل والمتابعة داخل النظام الجديد.
          </p>
          <div class="hero-actions">
            <a mat-flat-button routerLink="/electricity/billing">تقارير الفوترة</a>
            <a mat-stroked-button routerLink="/electricity/collections">تقارير السداد</a>
            <a mat-stroked-button routerLink="/electricity/messages">تقارير الرسائل</a>
          </div>
        </div>

        <div class="hero-side">
          <div class="metric-row">
            <span>الأكثر استخدامًا قديمًا</span>
            <strong>repkh1 / repkh2 / repday / repmsm</strong>
          </div>
          <div class="metric-row">
            <span>تقارير الشهر</span>
            <strong>repmontsallN / repkhmtns</strong>
          </div>
          <div class="metric-row">
            <span>تقارير المتابعة</span>
            <strong>repmsm / repsnd*</strong>
          </div>
        </div>
      </section>

      <section class="workflow-grid">
        @for (report of reports; track report.title) {
          <mat-card class="workflow-card">
            <span class="legacy-tag">
              <mat-icon>{{ report.icon }}</mat-icon>
              {{ report.legacy }}
            </span>
            <strong>{{ report.title }}</strong>
            <span>{{ report.description }}</span>
            <a mat-button color="primary" [routerLink]="report.route">فتح المسار المقابل</a>
          </mat-card>
        }
      </section>

      <section class="panel">
        <h2 class="section-title">
          <mat-icon>tips_and_updates</mat-icon>
          ملاحظة تنفيذية
        </h2>
        <div class="note-box">
          صفحة التقارير هنا هي نقطة تجميع وخريطة انتقال، بينما البيانات الفعلية الخاصة بالفوترة
          والسداد والرسائل تُعرض داخل شاشاتها التشغيلية المقابلة حتى لا تنفصل التقارير عن دورة العمل.
        </div>
      </section>
    </div>
  `,
  styles: [
    electricityPageStyles,
    `
      .hero-actions a[mat-flat-button] {
        background: #ffd54f;
        color: #102542;
      }
    `,
  ],
})
export class ElectricityReportsComponent {
  reports = [
    {
      title: 'تقارير القراءة والاستهلاك',
      description: 'تقابل عائلة `repkh*` التي كانت تُستخدم لطباعة القراءة والفاتورة وتفاصيل المشترك.',
      route: '/electricity/readings',
      legacy: 'REPKH*',
      icon: 'fact_check',
    },
    {
      title: 'التجميع الشهري للفوترة',
      description: 'تقابل `repmontsallN` و`repkhmtns` لمراجعة إجماليات الشهر والدورات.',
      route: '/electricity/billing',
      legacy: 'REPMONTSALLN',
      icon: 'calendar_month',
    },
    {
      title: 'تقارير السداد والتحصيل',
      description: 'تقابل `repsnd*` وبيانات السندات المرتبطة بالفاتورة الكهربائية.',
      route: '/electricity/collections',
      legacy: 'REPSND*',
      icon: 'payments',
    },
    {
      title: 'المتابعة والرسائل',
      description: 'تقابل `repmsm` لمتابعة المدينين والرسائل النصية وقنوات الإشعار.',
      route: '/electricity/messages',
      legacy: 'REPMSM',
      icon: 'sms',
    },
  ];
}
