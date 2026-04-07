import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ElectricityWorkflowService } from '../../../core/services/electricity-workflow.service';
import { electricityPageStyles } from '../electricity-page.styles';

@Component({
  selector: 'app-electricity-overview',
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="electricity-page" dir="rtl">
      <section class="hero">
        <div class="hero-copy">
          <span class="hero-kicker">لوحة التحكم الكهربائية</span>
          <h1>دورة العمل الكهربائية</h1>
          <p>نظرة شاملة على كل مراحل دورة الكهرباء: من تسجيل المشترك حتى التحصيل والتقارير.</p>
        </div>
      </section>

      <!-- بطاقات الإحصائيات -->
      <div class="stats-grid">
        <div class="stat-card blue" (click)="navigate('/electricity/subscribers')">
          <mat-icon>people</mat-icon>
          <div class="stat-info"><span>المشتركين</span><strong>{{subStats()?.total || 0}}</strong></div>
          <div class="stat-sub">نشط: {{subStats()?.active || 0}} | مفصول: {{subStats()?.disconnected || 0}}</div>
        </div>
        <div class="stat-card orange" (click)="navigate('/electricity/readings')">
          <mat-icon>speed</mat-icon>
          <div class="stat-info"><span>القراءات</span><strong>{{readStats()?.totalReadings || 0}}</strong></div>
          <div class="stat-sub">دورات مفتوحة: {{readStats()?.openCycles || 0}} | شاذة: {{readStats()?.anomalies || 0}}</div>
        </div>
        <div class="stat-card green" (click)="navigate('/electricity/billing')">
          <mat-icon>receipt</mat-icon>
          <div class="stat-info"><span>الفواتير</span><strong>{{billStats()?.totalInvoices || 0}}</strong></div>
          <div class="stat-sub">مفوتر: {{(billStats()?.totalBilled || 0) | number}} | تحصيل: {{billStats()?.collectionRate || 0}}%</div>
        </div>
        <div class="stat-card red" (click)="navigate('/electricity/billing')">
          <mat-icon>money_off</mat-icon>
          <div class="stat-info"><span>غير مسدد</span><strong>{{(billStats()?.totalUnpaid || 0) | number}}</strong></div>
          <div class="stat-sub">فواتير: {{billStats()?.unpaidInvoices || 0}}</div>
        </div>
        <div class="stat-card purple" (click)="navigate('/electricity/messages')">
          <mat-icon>sms</mat-icon>
          <div class="stat-info"><span>الرسائل</span><strong>{{msgStats()?.sent || 0}}</strong></div>
          <div class="stat-sub">معلقة: {{msgStats()?.pending || 0}} | فشل: {{msgStats()?.failed || 0}}</div>
        </div>
        <div class="stat-card teal" (click)="navigate('/electricity/reports')">
          <mat-icon>analytics</mat-icon>
          <div class="stat-info"><span>المديونية</span><strong>{{(subStats()?.totalDebt || 0) | number}}</strong></div>
          <div class="stat-sub">مدينين: {{subStats()?.debtors || 0}}</div>
        </div>
      </div>

      <!-- خريطة دورة العمل -->
      <mat-card style="margin:1.5rem 0;padding:2rem">
        <h2 style="text-align:center;margin-bottom:1.5rem"><mat-icon>account_tree</mat-icon> خريطة دورة العمل الكهربائية</h2>
        <div class="workflow-map">
          <a class="wf-step" routerLink="/electricity/subscribers"><div class="wf-icon blue-bg"><mat-icon>person_add</mat-icon></div><span>1. تسجيل مشترك</span><small>48 حقل كامل</small></a>
          <div class="wf-arrow">→</div>
          <a class="wf-step" routerLink="/electricity/meters"><div class="wf-icon cyan-bg"><mat-icon>settings_input_antenna</mat-icon></div><span>2. تركيب عداد</span><small>MZ + TRKB</small></a>
          <div class="wf-arrow">→</div>
          <a class="wf-step" routerLink="/electricity/readings"><div class="wf-icon orange-bg"><mat-icon>speed</mat-icon></div><span>3. إدخال قراءة</span><small>دورة + استهلاك</small></a>
          <div class="wf-arrow">→</div>
          <a class="wf-step" routerLink="/electricity/billing"><div class="wf-icon green-bg"><mat-icon>receipt_long</mat-icon></div><span>4. إصدار فاتورة</span><small>شرائح + رسوم</small></a>
          <div class="wf-arrow">→</div>
          <a class="wf-step" routerLink="/electricity/billing"><div class="wf-icon indigo-bg"><mat-icon>publish</mat-icon></div><span>5. ترحيل</span><small>قيود محاسبية</small></a>
          <div class="wf-arrow">→</div>
          <a class="wf-step" routerLink="/electricity/billing"><div class="wf-icon purple-bg"><mat-icon>payments</mat-icon></div><span>6. تحصيل</span><small>سداد الفواتير</small></a>
          <div class="wf-arrow">→</div>
          <a class="wf-step" routerLink="/electricity/reports"><div class="wf-icon red-bg"><mat-icon>analytics</mat-icon></div><span>7. تقارير</span><small>8 تقارير</small></a>
          <div class="wf-arrow">→</div>
          <a class="wf-step" routerLink="/electricity/messages"><div class="wf-icon teal-bg"><mat-icon>sms</mat-icon></div><span>8. رسائل</span><small>SMS/WhatsApp</small></a>
        </div>
      </mat-card>

      <!-- روابط سريعة -->
      <div class="quick-links">
        <a mat-stroked-button routerLink="/electricity/subscribers"><mat-icon>people</mat-icon> المشتركين</a>
        <a mat-stroked-button routerLink="/electricity/readings"><mat-icon>speed</mat-icon> القراءات</a>
        <a mat-stroked-button routerLink="/electricity/billing"><mat-icon>receipt</mat-icon> الفوترة</a>
        <a mat-stroked-button routerLink="/electricity/collections"><mat-icon>payments</mat-icon> التحصيل</a>
        <a mat-stroked-button routerLink="/electricity/meters"><mat-icon>settings_input_antenna</mat-icon> العدادات</a>
        <a mat-stroked-button routerLink="/electricity/centers"><mat-icon>business</mat-icon> المراكز</a>
        <a mat-stroked-button routerLink="/electricity/reports"><mat-icon>analytics</mat-icon> التقارير</a>
        <a mat-stroked-button routerLink="/electricity/messages"><mat-icon>sms</mat-icon> الرسائل</a>
      </div>
    </div>
  `,
  styles: [electricityPageStyles, `
    .stats-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem;margin:1.5rem 0; }
    .stat-card { display:flex;flex-wrap:wrap;align-items:center;gap:1rem;padding:1.5rem;border-radius:12px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.08);cursor:pointer;transition:transform 0.2s;border-right:4px solid #ccc; }
    .stat-card:hover { transform:translateY(-3px);box-shadow:0 4px 16px rgba(0,0,0,0.12); }
    .stat-card.blue { border-color:#2196f3; } .stat-card.orange { border-color:#ff9800; }
    .stat-card.green { border-color:#4caf50; } .stat-card.red { border-color:#f44336; }
    .stat-card.purple { border-color:#9c27b0; } .stat-card.teal { border-color:#009688; }
    .stat-card mat-icon { font-size:36px;width:36px;height:36px;color:#666; }
    .stat-info { display:flex;flex-direction:column; }
    .stat-info span { font-size:0.85rem;color:#888; }
    .stat-info strong { font-size:1.8rem;font-weight:700; }
    .stat-sub { width:100%;font-size:0.8rem;color:#999;border-top:1px solid #f0f0f0;padding-top:0.5rem; }

    .workflow-map { display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:0.5rem; }
    .wf-step { display:flex;flex-direction:column;align-items:center;text-decoration:none;color:#333;padding:0.5rem;border-radius:8px;transition:background 0.2s;min-width:90px; }
    .wf-step:hover { background:#f5f5f5; }
    .wf-icon { width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:0.3rem; }
    .wf-icon mat-icon { color:#fff;font-size:24px;width:24px;height:24px; }
    .blue-bg { background:#2196f3; } .cyan-bg { background:#00bcd4; } .orange-bg { background:#ff9800; }
    .green-bg { background:#4caf50; } .indigo-bg { background:#3f51b5; } .purple-bg { background:#9c27b0; }
    .red-bg { background:#f44336; } .teal-bg { background:#009688; }
    .wf-step span { font-size:0.8rem;font-weight:600;text-align:center; }
    .wf-step small { font-size:0.7rem;color:#999;text-align:center; }
    .wf-arrow { font-size:1.5rem;color:#ccc;font-weight:bold; }

    .quick-links { display:flex;flex-wrap:wrap;gap:0.75rem;margin:1rem 0;justify-content:center; }
    .quick-links a { min-width:140px; }
  `],
})
export class ElectricityOverviewComponent implements OnInit {
  subStats = signal<any>(null);
  readStats = signal<any>(null);
  billStats = signal<any>(null);
  msgStats = signal<any>(null);

  constructor(private svc: ElectricityWorkflowService) {}
  ngOnInit() {
    this.svc.getSubscriberStats().subscribe(r => this.subStats.set(r.data));
    this.svc.getReadingStats().subscribe(r => this.readStats.set(r.data));
    this.svc.getBillingStats().subscribe(r => this.billStats.set(r.data));
    this.svc.getMessageStats().subscribe(r => this.msgStats.set(r.data));
  }
  navigate(path: string) { window.location.href = path; }
}
