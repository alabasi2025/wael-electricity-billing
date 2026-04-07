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
import { ElectricityWorkflowService } from '../../../core/services/electricity-workflow.service';
import { electricityPageStyles } from '../electricity-page.styles';

@Component({
  selector: 'app-electricity-messages',
  imports: [ CommonModule, FormsModule, RouterModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, MatTableModule, MatSelectModule, MatSnackBarModule, MatTabsModule ],
  template: `
    <div class="electricity-page" dir="rtl">
      <section class="hero">
        <div class="hero-copy">
          <span class="hero-kicker">MSM + SENDSMS / الرسائل والمتابعة</span>
          <h1>إدارة الرسائل</h1>
          <p>إرسال رسائل SMS/WhatsApp للمشتركين، إدارة قوالب الرسائل، وعرض سجل الإرسال.</p>
        </div>
        <div class="hero-side">
          <div class="metric-row"><span>إجمالي المرسلة</span><strong>{{ msgStats()?.sent || 0 }}</strong></div>
          <div class="metric-row"><span>معلقة</span><strong style="color:#ff9800">{{ msgStats()?.pending || 0 }}</strong></div>
          <div class="metric-row"><span>فشل</span><strong style="color:#f44336">{{ msgStats()?.failed || 0 }}</strong></div>
          <div class="metric-row"><span>القوالب</span><strong>{{ msgStats()?.templates || 0 }}</strong></div>
        </div>
      </section>

      <mat-tab-group>
        <!-- إرسال رسالة -->
        <mat-tab label="📤 إرسال رسالة">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>send</mat-icon> إرسال رسالة لمشترك</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem">
              <mat-form-field appearance="outline"><mat-label>رقم المشترك</mat-label><input matInput type="number" [(ngModel)]="sendForm.subscriberNoa"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>القالب</mat-label>
                <mat-select [(ngModel)]="sendForm.templateId">
                  <mat-option [value]="null">بدون قالب</mat-option>
                  @for(t of templates(); track t.id) { <mat-option [value]="t.id">{{t.name}}</mat-option> }
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline" class="span-2"><mat-label>نص مخصص (اختياري)</mat-label><textarea matInput [(ngModel)]="sendForm.customMessage" rows="2"></textarea></mat-form-field>
            </div>
            <button mat-flat-button color="primary" (click)="sendMessage()"><mat-icon>send</mat-icon> إرسال</button>
          </mat-card>
        </mat-tab>

        <!-- القوالب -->
        <mat-tab label="📝 القوالب">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>description</mat-icon> قوالب الرسائل</h3>
            <div *ngFor="let t of templates()" style="border:1px solid #e0e0e0;border-radius:8px;padding:1rem;margin:0.5rem 0">
              <strong>{{t.name}}</strong> <span style="background:#e3f2fd;padding:2px 8px;border-radius:12px;font-size:0.8rem">{{t.templateType}}</span>
              <p style="color:#666;margin:0.5rem 0">{{t.content}}</p>
            </div>
            <h4 style="margin-top:1.5rem">إنشاء قالب جديد:</h4>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem">
              <mat-form-field appearance="outline"><mat-label>الاسم</mat-label><input matInput [(ngModel)]="templateForm.name"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>النوع</mat-label>
                <mat-select [(ngModel)]="templateForm.templateType">
                  <mat-option value="balance">رصيد</mat-option><mat-option value="invoice">فاتورة</mat-option>
                  <mat-option value="payment">سداد</mat-option><mat-option value="overdue">متأخر</mat-option>
                  <mat-option value="disconnect">فصل</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline" class="span-2"><mat-label>النص (متغيرات: {name} {noa} {balance} {amount})</mat-label><textarea matInput [(ngModel)]="templateForm.content" rows="2"></textarea></mat-form-field>
            </div>
            <button mat-flat-button color="primary" (click)="createTemplate()"><mat-icon>save</mat-icon> حفظ القالب</button>
          </mat-card>
        </mat-tab>

        <!-- السجل -->
        <mat-tab label="📜 سجل الرسائل">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>history</mat-icon> سجل الرسائل المرسلة</h3>
            <table mat-table [dataSource]="messages()" style="width:100%">
              <ng-container matColumnDef="subscriberNoa"><th mat-header-cell *matHeaderCellDef>المشترك</th><td mat-cell *matCellDef="let r">{{r.subscriberNoa}}</td></ng-container>
              <ng-container matColumnDef="channel"><th mat-header-cell *matHeaderCellDef>القناة</th><td mat-cell *matCellDef="let r">{{r.channel}}</td></ng-container>
              <ng-container matColumnDef="messageText"><th mat-header-cell *matHeaderCellDef>النص</th><td mat-cell *matCellDef="let r" style="max-width:300px;overflow:hidden;text-overflow:ellipsis">{{r.messageText}}</td></ng-container>
              <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>الحالة</th><td mat-cell *matCellDef="let r">
                <mat-icon [style.color]="r.status===1?'#4caf50':r.status===2?'#f44336':'#ff9800'">{{r.status===1?'check_circle':r.status===2?'error':'schedule'}}</mat-icon>
              </td></ng-container>
              <ng-container matColumnDef="createdAt"><th mat-header-cell *matHeaderCellDef>التاريخ</th><td mat-cell *matCellDef="let r">{{r.createdAt | date:'short'}}</td></ng-container>
              <tr mat-header-row *matHeaderRowDef="['subscriberNoa','channel','messageText','status','createdAt']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['subscriberNoa','channel','messageText','status','createdAt'];"></tr>
            </table>
          </mat-card>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [electricityPageStyles, `.span-2 { grid-column: span 2; } .metric-row { display:flex;justify-content:space-between;padding:0.3rem 0; }`],
})
export class ElectricityMessagesComponent implements OnInit {
  msgStats = signal<any>(null);
  templates = signal<any[]>([]);
  messages = signal<any[]>([]);

  sendForm = { subscriberNoa: 0, templateId: null as number|null, customMessage: '' };
  templateForm = { name: '', templateType: 'balance', content: '' };

  constructor(private svc: ElectricityWorkflowService, private snack: MatSnackBar) {}
  ngOnInit() { this.loadAll(); }

  loadAll() {
    this.svc.getMessageStats().subscribe(r => this.msgStats.set(r.data));
    this.svc.getMessageTemplates().subscribe(r => this.templates.set(r.data || []));
    this.svc.getMessages({ pageSize: 50 }).subscribe(r => this.messages.set(r.data || []));
  }

  sendMessage() {
    this.svc.sendMessage(this.sendForm as any).subscribe({ next: r => {
      this.snack.open(r.message,'حسناً',{duration:3000}); this.loadAll();
    }, error: e => this.snack.open(e.error?.message||'خطأ','حسناً',{duration:3000}) });
  }

  createTemplate() {
    this.svc.createMessageTemplate(this.templateForm).subscribe({ next: r => {
      this.snack.open(r.message||'تم','حسناً',{duration:3000}); this.loadAll();
      this.templateForm = { name: '', templateType: 'balance', content: '' };
    }});
  }
}
