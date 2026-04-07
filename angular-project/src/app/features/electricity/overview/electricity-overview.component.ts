import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  ElectricityStats,
  ElectricityWorkflowService,
} from '../../../core/services/electricity-workflow.service';
import { electricityPageStyles } from '../electricity-page.styles';

@Component({
  selector: 'app-electricity-overview',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="electricity-page" dir="rtl">
      <section class="hero">
        <div class="hero-copy">
          <span class="hero-kicker">Legacy Electricity Workflow</span>
          <h1>خريطة العمل الكهربائية من المشترك حتى السداد</h1>
          <p>
            هذا القسم يعيد ترتيب النظام الجديد حول الدورة الفعلية في النظام القديم:
            ملف المشترك، القراءة، الفوترة، الترحيل، السداد، الرسائل، ثم التقارير.
          </p>
          <div class="hero-actions">
            <a mat-flat-button routerLink="/electricity/subscribers">ملف المشتركين</a>
            <a mat-stroked-button routerLink="/electricity/readings">بدء القراءة</a>
            <a mat-stroked-button routerLink="/electricity/billing">فتح الفوترة</a>
          </div>
        </div>

        <div class="hero-side">
          <div class="metric-row">
            <span>المسار الافتراضي</span>
            <strong>tel → addmz → ftora → thoel → sndk22</strong>
          </div>
          <div class="metric-row">
            <span>نقطة البداية اليومية</span>
            <strong>بيانات المشتركين والقراءات</strong>
          </div>
          <div class="metric-row">
            <span>الوضع الحالي</span>
            <strong>{{ loading() ? 'جاري تحميل الإحصاءات...' : 'جاهز للعمل' }}</strong>
          </div>
        </div>
      </section>

      @if (loading()) {
        <section class="panel empty-state">
          <mat-spinner diameter="42"></mat-spinner>
        </section>
      } @else {
        <section class="stats-grid">
          @for (card of statCards(); track card.label) {
            <mat-card class="stat-card">
              <div class="stat-head">
                <div>
                  <span>{{ card.label }}</span>
                  <strong>{{ card.value }}</strong>
                </div>
                <mat-icon>{{ card.icon }}</mat-icon>
              </div>
              <span>{{ card.caption }}</span>
            </mat-card>
          }
        </section>
      }

      <section class="panel">
        <div class="toolbar-row">
          <div>
            <h2 class="section-title">
              <mat-icon>account_tree</mat-icon>
              شاشات الكهرباء الأساسية
            </h2>
            <p class="muted">ترتيب مطابق تقريبًا لتسلسل العمل في النظام القديم.</p>
          </div>
        </div>

        <div class="workflow-grid">
          @for (step of workflow; track step.route) {
            <a class="workflow-card" [routerLink]="step.route">
              <span class="legacy-tag">
                <mat-icon>{{ step.icon }}</mat-icon>
                {{ step.legacy }}
              </span>
              <strong>{{ step.title }}</strong>
              <span>{{ step.description }}</span>
            </a>
          }
        </div>
      </section>

      <div class="panel-grid">
        <section class="panel">
          <h2 class="section-title">
            <mat-icon>category</mat-icon>
            الشاشات المساندة
          </h2>
          <div class="action-grid">
            @for (screen of supportScreens; track screen.route) {
              <a class="action-tile" [routerLink]="screen.route">
                <mat-icon>{{ screen.icon }}</mat-icon>
                <strong>{{ screen.title }}</strong>
                <span>{{ screen.description }}</span>
              </a>
            }
          </div>
        </section>

        <section class="panel">
          <h2 class="section-title">
            <mat-icon>info</mat-icon>
            ماذا أنجزنا هنا؟
          </h2>
          <div class="metric-list">
            <div class="metric-row">
              <span>المشتركون</span>
              <strong>مرتبطة مع المسار accounts/sub ونوع 2</strong>
            </div>
            <div class="metric-row">
              <span>العدادات والقراءات</span>
              <strong>مرتبطة مع المسار electricity/meters</strong>
            </div>
            <div class="metric-row">
              <span>الفوترة والسداد</span>
              <strong>تعرض بيانات legacy من dataffx و sndk22</strong>
            </div>
          </div>

          <div class="note-box">
            الشاشات الجديدة هنا هي بداية تنظيم قسم الكهرباء حول الوظائف القديمة الفعلية،
            وليست مجرد قوائم عامة للعدادات والمولدات.
          </div>
        </section>
      </div>
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
export class ElectricityOverviewComponent implements OnInit {
  loading = signal(true);
  stats = signal<ElectricityStats>({
    meters: 0,
    activeMeters: 0,
    installations: 0,
    generators: 0,
    centers: 0,
  });

  workflow = [
    {
      title: 'بيانات المشتركين',
      description: 'ملف المشترك الكهربائي وربطه مع الحساب والاتصال والرصيد.',
      legacy: 'TEL',
      route: '/electricity/subscribers',
      icon: 'people',
    },
    {
      title: 'العدادات والقراءات',
      description: 'تسجيل القراءة الحالية والسابقة واستهلاك الدورة.',
      legacy: 'ADDMZ / TRK',
      route: '/electricity/readings',
      icon: 'speed',
    },
    {
      title: 'الفوترة الشهرية',
      description: 'معاينة سجلات الفوترة وحساب الاستهلاك ومبالغ الفواتير.',
      legacy: 'FTORA',
      route: '/electricity/billing',
      icon: 'receipt_long',
    },
    {
      title: 'الترحيل والاعتماد',
      description: 'تثبيت الفواتير وترحيلها للقيود والسندات.',
      legacy: 'THOEL',
      route: '/electricity/posting',
      icon: 'published_with_changes',
    },
    {
      title: 'التحصيل والسداد',
      description: 'ربط السداد بالفاتورة ومتابعة المقبوضات.',
      legacy: 'SNDK22',
      route: '/electricity/collections',
      icon: 'payments',
    },
    {
      title: 'الرسائل والمتابعة',
      description: 'متابعة المدينين والإشعارات والرسائل النصية.',
      legacy: 'REPMSM / MSM',
      route: '/electricity/messages',
      icon: 'sms',
    },
    {
      title: 'تقارير الكهرباء',
      description: 'خرائط التقرير اليومي والشهري وتقارير الطباعة القديمة.',
      legacy: 'REPKH / REPDAY',
      route: '/electricity/reports',
      icon: 'assessment',
    },
  ];

  supportScreens = [
    {
      title: 'سجل العدادات',
      description: 'الملف التشغيلي الأساسي للعدادات.',
      route: '/electricity/meters',
      icon: 'pin',
    },
    {
      title: 'التركيبات والتغييرات',
      description: 'تركيب جديد، تغيير عداد، أو عمل ميداني.',
      route: '/electricity/installations',
      icon: 'construction',
    },
    {
      title: 'المولدات',
      description: 'المولدات وساعات التشغيل والوقود.',
      route: '/electricity/generators',
      icon: 'offline_bolt',
    },
    {
      title: 'المراكز',
      description: 'المراكز أو المناطق التشغيلية.',
      route: '/electricity/centers',
      icon: 'location_city',
    },
  ];

  constructor(private workflowService: ElectricityWorkflowService) {}

  ngOnInit(): void {
    this.workflowService.getOverviewStats().subscribe({
      next: (response) => {
        this.stats.set(response.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  statCards() {
    const data = this.stats();
    return [
      {
        label: 'إجمالي العدادات',
        value: data.meters,
        icon: 'speed',
        caption: 'كل العدادات المسجلة داخل النظام الجديد.',
      },
      {
        label: 'العدادات الفعالة',
        value: data.activeMeters,
        icon: 'bolt',
        caption: 'العدادات العاملة والقابلة للقراءة.',
      },
      {
        label: 'التركيبات',
        value: data.installations,
        icon: 'construction',
        caption: 'عمليات التركيب أو التغيير أو الأعمال الميدانية.',
      },
      {
        label: 'المولدات',
        value: data.generators,
        icon: 'power',
        caption: 'سجل المولدات الداعم للتشغيل.',
      },
      {
        label: 'المراكز',
        value: data.centers,
        icon: 'domain',
        caption: 'المراكز أو المناطق التشغيلية.',
      },
    ];
  }
}
