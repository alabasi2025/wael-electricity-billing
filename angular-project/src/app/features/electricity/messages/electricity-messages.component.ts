import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { ElectricityWorkflowService } from '../../../core/services/electricity-workflow.service';
import { electricityPageStyles } from '../electricity-page.styles';

@Component({
  selector: 'app-electricity-messages',
  imports: [ CommonModule, FormsModule, RouterModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, MatTableModule, MatSelectModule, MatSnackBarModule, MatTabsModule, MatTooltipModule, MatChipsModule ],
  template: `
    <div class="electricity-page" dir="rtl">
      <section class="hero">
        <div class="hero-copy">
          <span class="hero-kicker">MSM + SENDSMS + NSMS + TY_MS + smsgsm + smstxt / الرسائل الشاملة</span>
          <h1>إدارة الرسائل والإشعارات</h1>
          <p>بديل 6 شاشات Oracle: إرسال SMS/WhatsApp، قوالب، إعدادات البوابة، الإرسال الجماعي، سجل الإرسال.</p>
        </div>
        <div class="hero-side">
          <div class="metric-row"><span>مرسلة</span><strong style="color:#4caf50">{{ msgStats()?.sent || 0 }}</strong></div>
          <div class="metric-row"><span>معلقة</span><strong style="color:#ff9800">{{ msgStats()?.pending || 0 }}</strong></div>
          <div class="metric-row"><span>فشل</span><strong style="color:#f44336">{{ msgStats()?.failed || 0 }}</strong></div>
          <div class="metric-row"><span>القوالب</span><strong>{{ msgStats()?.templates || 0 }}</strong></div>
        </div>
      </section>

      <mat-tab-group>
        <!-- 1: إرسال فردي (msm + smsgsm + smstxt) -->
        <mat-tab label="📤 إرسال رسالة">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>send</mat-icon> إرسال رسالة لمشترك (بديل msm + smsgsm + smstxt)</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:0.75rem">
              <mat-form-field appearance="outline"><mat-label>رقم المشترك</mat-label><input matInput type="number" [(ngModel)]="sendForm.subscriberNoa"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>القناة</mat-label>
                <mat-select [(ngModel)]="sendForm.channel"><mat-option value="sms">SMS</mat-option><mat-option value="whatsapp">WhatsApp</mat-option></mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline"><mat-label>القالب</mat-label>
                <mat-select [(ngModel)]="sendForm.templateId"><mat-option [value]="null">بدون قالب</mat-option>@for(t of templates();track t.id){<mat-option [value]="t.id">{{t.name}}</mat-option>}</mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline" style="grid-column:span 2"><mat-label>نص مخصص</mat-label><textarea matInput [(ngModel)]="sendForm.customMessage" rows="2" placeholder="اتركه فارغاً لاستخدام القالب..."></textarea></mat-form-field>
            </div>
            <button mat-flat-button color="primary" (click)="sendMessage()"><mat-icon>send</mat-icon> إرسال</button>
          </mat-card>
        </mat-tab>

        <!-- 2: إرسال جماعي (smsn) -->
        <mat-tab label="📨 إرسال جماعي">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>campaign</mat-icon> إرسال جماعي (بديل smsn)</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:0.75rem">
              <mat-form-field appearance="outline"><mat-label>القالب</mat-label>
                <mat-select [(ngModel)]="bulkForm.templateId">@for(t of templates();track t.id){<mat-option [value]="t.id">{{t.name}}</mat-option>}</mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline"><mat-label>الفئة المستهدفة</mat-label>
                <mat-select [(ngModel)]="bulkForm.filterType">
                  <mat-option value="all">كل المشتركين</mat-option>
                  <mat-option value="overdue">المتأخرين (مديونية)</mat-option>
                  <mat-option value="disconnected">المفصولين</mat-option>
                  <mat-option value="sms_enabled">المشتركين بـ SMS</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline"><mat-label>المجموعة (اختياري)</mat-label><input matInput type="number" [(ngModel)]="bulkForm.groupId"></mat-form-field>
            </div>
            <button mat-flat-button color="warn" (click)="bulkSend()"><mat-icon>send</mat-icon> إرسال جماعي</button>
          </mat-card>
        </mat-tab>

        <!-- 3: القوالب -->
        <mat-tab label="📝 القوالب">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>description</mat-icon> قوالب الرسائل</h3>
            <div *ngFor="let t of templates()" style="border:1px solid #e0e0e0;border-radius:8px;padding:1rem;margin:0.5rem 0;display:flex;justify-content:space-between;align-items:start">
              <div><strong>{{t.name}}</strong> <span style="background:#e3f2fd;padding:2px 8px;border-radius:12px;font-size:0.8rem">{{t.templateType}}</span> <span style="background:#f3e5f5;padding:2px 8px;border-radius:12px;font-size:0.8rem">{{t.channel||'sms'}}</span><p style="color:#666;margin:0.5rem 0;font-family:monospace;direction:ltr">{{t.content}}</p></div>
            </div>
            <hr style="margin:1rem 0">
            <h4>إنشاء قالب جديد:</h4>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:0.75rem">
              <mat-form-field appearance="outline"><mat-label>الاسم</mat-label><input matInput [(ngModel)]="templateForm.name"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>النوع</mat-label>
                <mat-select [(ngModel)]="templateForm.templateType"><mat-option value="balance">رصيد</mat-option><mat-option value="invoice">فاتورة</mat-option><mat-option value="payment">سداد</mat-option><mat-option value="overdue">متأخر</mat-option><mat-option value="disconnect">فصل</mat-option><mat-option value="general">عام</mat-option></mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline"><mat-label>القناة</mat-label>
                <mat-select [(ngModel)]="templateForm.channel"><mat-option value="sms">SMS</mat-option><mat-option value="whatsapp">WhatsApp</mat-option><mat-option value="both">كلاهما</mat-option></mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline" style="grid-column:span 2"><mat-label>النص (متغيرات: {name} {noa} {balance} {amount} {invoice})</mat-label><textarea matInput [(ngModel)]="templateForm.content" rows="2"></textarea></mat-form-field>
            </div>
            <button mat-flat-button color="primary" (click)="createTemplate()"><mat-icon>save</mat-icon> حفظ القالب</button>
          </mat-card>
        </mat-tab>

        <!-- 4: إعدادات SMS (NSMS) -->
        <mat-tab label="⚙️ إعدادات SMS">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>settings</mat-icon> إعدادات بوابة SMS (بديل NSMS)</h3>
            <div style="background:#fff3e0;padding:1rem;border-radius:8px;margin-bottom:1rem">
              <strong>حالة البوابة:</strong>
              <span *ngIf="gatewayStatus()" style="margin-right:8px">
                {{gatewayStatus()?.configured ? '✅ مُعدّة' : '⚠️ وضع المحاكاة'}} - المزود: <strong>{{gatewayStatus()?.provider}}</strong>
              </span>
              <p style="color:#666;margin-top:4px">{{gatewayStatus()?.details}}</p>
            </div>
            <p style="color:#666">لتفعيل SMS فعلي، أضف هذه الإعدادات في ملف <code>.env</code>:</p>
            <pre style="background:#263238;color:#aed581;padding:1rem;border-radius:8px;direction:ltr;font-size:0.85rem">
SMS_PROVIDER=twilio          # twilio / nexmo / local_gateway
SMS_API_KEY=your_api_key
SMS_API_SECRET=your_secret
SMS_SENDER_ID=ELECTRICITY

# WhatsApp (اختياري)
WHATSAPP_API_URL=https://graph.facebook.com/v17.0/.../messages
WHATSAPP_TOKEN=your_token</pre>
          </mat-card>
        </mat-tab>

        <!-- 5: أنواع الرسائل (TY_MS) -->
        <mat-tab label="🏷️ أنواع الرسائل">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>category</mat-icon> أنواع الرسائل (بديل TY_MS)</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1rem">
              <div style="border:2px solid #e3f2fd;border-radius:8px;padding:1rem"><mat-icon style="color:#2196f3">account_balance_wallet</mat-icon><br><strong>رسالة رصيد</strong><br><small>يتم إرسالها عند استعلام المشترك عن رصيده</small></div>
              <div style="border:2px solid #fff3e0;border-radius:8px;padding:1rem"><mat-icon style="color:#ff9800">receipt</mat-icon><br><strong>رسالة فاتورة</strong><br><small>يتم إرسالها عند إصدار فاتورة جديدة</small></div>
              <div style="border:2px solid #e8f5e9;border-radius:8px;padding:1rem"><mat-icon style="color:#4caf50">payments</mat-icon><br><strong>رسالة سداد</strong><br><small>يتم إرسالها عند تسجيل دفعة</small></div>
              <div style="border:2px solid #ffebee;border-radius:8px;padding:1rem"><mat-icon style="color:#f44336">warning</mat-icon><br><strong>رسالة تأخر</strong><br><small>يتم إرسالها للمشتركين المتأخرين</small></div>
              <div style="border:2px solid #fce4ec;border-radius:8px;padding:1rem"><mat-icon style="color:#c62828">power_off</mat-icon><br><strong>رسالة فصل</strong><br><small>يتم إرسالها قبل/بعد فصل الخدمة</small></div>
              <div style="border:2px solid #f3e5f5;border-radius:8px;padding:1rem"><mat-icon style="color:#9c27b0">campaign</mat-icon><br><strong>رسالة عامة</strong><br><small>إعلانات وتنبيهات عامة</small></div>
            </div>
          </mat-card>
        </mat-tab>

        <!-- 6: سجل الإرسال -->
        <mat-tab label="📜 السجل">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>history</mat-icon> سجل الرسائل المرسلة</h3>
            <div style="display:flex;gap:1rem;margin-bottom:1rem;align-items:end">
              <mat-form-field appearance="outline" style="width:200px"><mat-label>بحث</mat-label><input matInput [(ngModel)]="msgSearch" (keyup.enter)="loadMessages()"></mat-form-field>
              <mat-form-field appearance="outline" style="width:130px"><mat-label>الحالة</mat-label>
                <mat-select [(ngModel)]="msgStatusFilter" (selectionChange)="loadMessages()"><mat-option [value]="undefined">الكل</mat-option><mat-option [value]="0">معلق</mat-option><mat-option [value]="1">مرسل</mat-option><mat-option [value]="2">فشل</mat-option></mat-select>
              </mat-form-field>
              <button mat-icon-button (click)="loadMessages()"><mat-icon>refresh</mat-icon></button>
            </div>
            <table mat-table [dataSource]="messages()" style="width:100%">
              <ng-container matColumnDef="subscriberNoa"><th mat-header-cell *matHeaderCellDef>المشترك</th><td mat-cell *matCellDef="let r">{{r.subscriberNoa}}</td></ng-container>
              <ng-container matColumnDef="channel"><th mat-header-cell *matHeaderCellDef>القناة</th><td mat-cell *matCellDef="let r"><mat-icon style="font-size:16px">{{r.channel==='whatsapp'?'whatsapp':'sms'}}</mat-icon> {{r.channel}}</td></ng-container>
              <ng-container matColumnDef="messageText"><th mat-header-cell *matHeaderCellDef>النص</th><td mat-cell *matCellDef="let r" style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{{r.messageText}}</td></ng-container>
              <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>الحالة</th><td mat-cell *matCellDef="let r">
                <mat-icon [style.color]="r.status===1?'#4caf50':r.status===2?'#f44336':'#ff9800'">{{r.status===1?'check_circle':r.status===2?'error':'schedule'}}</mat-icon>
              </td></ng-container>
              <ng-container matColumnDef="createdAt"><th mat-header-cell *matHeaderCellDef>التاريخ</th><td mat-cell *matCellDef="let r">{{r.createdAt | date:'short'}}</td></ng-container>
              <tr mat-header-row *matHeaderRowDef="['subscriberNoa','channel','messageText','status','createdAt']"></tr>
              <tr mat-row *matRowDef="let row; columns:['subscriberNoa','channel','messageText','status','createdAt']"></tr>
            </table>
          </mat-card>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [electricityPageStyles, `.metric-row{display:flex;justify-content:space-between;padding:0.3rem 0}`],
})
export class ElectricityMessagesComponent implements OnInit {
  msgStats = signal<any>(null); templates = signal<any[]>([]); messages = signal<any[]>([]); gatewayStatus = signal<any>(null);
  sendForm: any = { channel: 'sms', templateId: null, customMessage: '' };
  bulkForm: any = { filterType: 'all' };
  templateForm: any = { templateType: 'balance', channel: 'sms' };
  msgSearch = ''; msgStatusFilter: number | undefined;

  constructor(private svc: ElectricityWorkflowService, private snack: MatSnackBar) {}
  ngOnInit() { this.loadAll(); }

  loadAll() {
    this.svc.getMessageStats().subscribe(r => this.msgStats.set(r.data));
    this.svc.getMessageTemplates().subscribe(r => this.templates.set(r.data || []));
    this.loadMessages();
    this.svc.getSmsGatewayStatus().subscribe({ next: r => this.gatewayStatus.set(r.data), error: () => this.gatewayStatus.set({ provider: 'mock', configured: false, details: 'غير متصل' }) });
  }

  loadMessages() {
    const params: any = { pageSize: 50 };
    if (this.msgSearch) params.search = this.msgSearch;
    if (this.msgStatusFilter !== undefined) params.status = this.msgStatusFilter;
    this.svc.getMessages(params).subscribe(r => this.messages.set(r.data || []));
  }

  sendMessage() {
    if (!this.sendForm.subscriberNoa) return this.snack.open('أدخل رقم المشترك', 'حسناً', { duration: 3000 });
    this.svc.sendMessage(this.sendForm).subscribe({
      next: r => { this.snack.open(r.message, 'حسناً', { duration: 3000 }); this.loadAll(); },
      error: e => this.snack.open(e.error?.message || 'خطأ', 'حسناً', { duration: 3000 }),
    });
  }

  bulkSend() {
    this.svc.bulkSendMessages(this.bulkForm).subscribe({
      next: r => { this.snack.open(r.message, 'حسناً', { duration: 5000 }); this.loadAll(); },
      error: e => this.snack.open(e.error?.message || 'خطأ', 'حسناً', { duration: 3000 }),
    });
  }

  createTemplate() {
    if (!this.templateForm.name || !this.templateForm.content) return this.snack.open('أكمل البيانات', 'حسناً', { duration: 3000 });
    this.svc.createMessageTemplate(this.templateForm).subscribe({
      next: r => { this.snack.open(r.message || 'تم', 'حسناً', { duration: 3000 }); this.templateForm = { templateType: 'balance', channel: 'sms' }; this.loadAll(); },
    });
  }
}
