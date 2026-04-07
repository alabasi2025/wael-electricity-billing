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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { ElectricityWorkflowService } from '../../../core/services/electricity-workflow.service';
import { electricityPageStyles } from '../electricity-page.styles';

@Component({
  selector: 'app-electricity-billing',
  imports: [ CommonModule, FormsModule, RouterModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressSpinnerModule, MatTableModule, MatSelectModule, MatSnackBarModule, MatTooltipModule, MatTabsModule ],
  template: `
    <div class="electricity-page" dir="rtl">
      <section class="hero">
        <div class="hero-copy">
          <span class="hero-kicker">FTORA + THOEL + SNDK22 / الفوترة والترحيل والسداد</span>
          <h1>محرك الفوترة الكهربائية</h1>
          <p>إصدار الفواتير الشهرية من القراءات المؤكدة، ترحيلها لإنشاء قيود محاسبية، وتسجيل المدفوعات.</p>
        </div>
        <div class="hero-side">
          <div class="metric-row"><span>إجمالي الفواتير</span><strong>{{ billingStats()?.totalInvoices || 0 }}</strong></div>
          <div class="metric-row"><span>إجمالي المفوتر</span><strong>{{ (billingStats()?.totalBilled || 0) | number }}</strong></div>
          <div class="metric-row"><span>إجمالي المحصّل</span><strong style="color:#4caf50">{{ (billingStats()?.totalPaid || 0) | number }}</strong></div>
          <div class="metric-row"><span>غير مسدد</span><strong style="color:#f44336">{{ (billingStats()?.totalUnpaid || 0) | number }}</strong></div>
          <div class="metric-row"><span>نسبة التحصيل</span><strong>{{ billingStats()?.collectionRate || 0 }}%</strong></div>
        </div>
      </section>

      <mat-tab-group>
        <!-- تبويب 1: إصدار فوترة -->
        <mat-tab label="🔥 إصدار فوترة جديدة">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>receipt</mat-icon> إصدار الفوترة الشهرية</h3>
            <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:end">
              <mat-form-field appearance="outline"><mat-label>الشهر</mat-label>
                <mat-select [(ngModel)]="genForm.billingMonth">
                  @for(m of months; track m.v) { <mat-option [value]="m.v">{{m.n}}</mat-option> }
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline"><mat-label>السنة</mat-label><input matInput type="number" [(ngModel)]="genForm.billingYear"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>دورة القراءة</mat-label>
                <mat-select [(ngModel)]="genForm.readingCycleId">
                  @for(c of readingCycles(); track c.id) { <mat-option [value]="c.id">دورة {{c.cycleNo}} ({{c.dateFrom | date:'shortDate'}})</mat-option> }
                </mat-select>
              </mat-form-field>
              <button mat-flat-button color="primary" (click)="generateBilling()" [disabled]="generating()"><mat-icon>bolt</mat-icon> إصدار</button>
            </div>
            <div *ngIf="genResult()" style="margin-top:1rem;padding:1rem;background:#e8f5e9;border-radius:8px">
              <strong>✅ {{genResult()?.message}}</strong>
            </div>
          </mat-card>
        </mat-tab>

        <!-- تبويب 2: الترحيل -->
        <mat-tab label="✅ ترحيل الفوترة">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>publish</mat-icon> ترحيل واعتماد الفوترة (بديل thoel)</h3>
            <table mat-table [dataSource]="billingCycles()" style="width:100%">
              <ng-container matColumnDef="cycleName"><th mat-header-cell *matHeaderCellDef>الدورة</th><td mat-cell *matCellDef="let r">{{r.cycleName}}</td></ng-container>
              <ng-container matColumnDef="totalInvoices"><th mat-header-cell *matHeaderCellDef>الفواتير</th><td mat-cell *matCellDef="let r">{{r.totalInvoices}}</td></ng-container>
              <ng-container matColumnDef="totalAmount"><th mat-header-cell *matHeaderCellDef>الإجمالي</th><td mat-cell *matCellDef="let r">{{r.totalAmount | number}}</td></ng-container>
              <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>الحالة</th><td mat-cell *matCellDef="let r">
                <span [style.color]="r.status===0?'#ff9800':r.status===1?'#2196f3':'#4caf50'">{{r.status===0?'مفتوح':r.status===1?'مكتمل':'مرحّل'}}</span>
              </td></ng-container>
              <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>ترحيل</th><td mat-cell *matCellDef="let r">
                <button mat-flat-button color="accent" *ngIf="r.status===1" (click)="postBilling(r.id)"><mat-icon>publish</mat-icon> ترحيل</button>
                <span *ngIf="r.status===2" style="color:#4caf50">✅ مرحّل</span>
              </td></ng-container>
              <tr mat-header-row *matHeaderRowDef="['cycleName','totalInvoices','totalAmount','status','actions']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['cycleName','totalInvoices','totalAmount','status','actions'];"></tr>
            </table>
          </mat-card>
        </mat-tab>

        <!-- تبويب 3: الفواتير غير المسددة + سداد -->
        <mat-tab label="💰 السداد">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>payments</mat-icon> الفواتير المستحقة والسداد (بديل SNDK22)</h3>
            <mat-form-field appearance="outline" style="width:300px"><mat-label>بحث برقم المشترك</mat-label>
              <input matInput type="number" [(ngModel)]="paymentSearchNoa" (keyup.enter)="loadUnpaid()">
              <button matSuffix mat-icon-button (click)="loadUnpaid()"><mat-icon>search</mat-icon></button>
            </mat-form-field>
            <table mat-table [dataSource]="unpaidInvoices()" style="width:100%">
              <ng-container matColumnDef="invoiceNo"><th mat-header-cell *matHeaderCellDef>الفاتورة</th><td mat-cell *matCellDef="let r">{{r.invoiceNo}}</td></ng-container>
              <ng-container matColumnDef="subscriberName"><th mat-header-cell *matHeaderCellDef>المشترك</th><td mat-cell *matCellDef="let r">{{r.subscriberName}}</td></ng-container>
              <ng-container matColumnDef="totalAmount"><th mat-header-cell *matHeaderCellDef>المبلغ</th><td mat-cell *matCellDef="let r">{{r.totalAmount | number}}</td></ng-container>
              <ng-container matColumnDef="paidAmount"><th mat-header-cell *matHeaderCellDef>المسدد</th><td mat-cell *matCellDef="let r" style="color:#4caf50">{{r.paidAmount | number}}</td></ng-container>
              <ng-container matColumnDef="remainingAmount"><th mat-header-cell *matHeaderCellDef>المتبقي</th><td mat-cell *matCellDef="let r" style="color:#f44336;font-weight:bold">{{r.remainingAmount | number}}</td></ng-container>
              <ng-container matColumnDef="pay"><th mat-header-cell *matHeaderCellDef>سداد</th><td mat-cell *matCellDef="let r">
                <div style="display:flex;gap:4px;align-items:center">
                  <input matInput type="number" [(ngModel)]="r._payAmount" [placeholder]="r.remainingAmount" style="width:80px;border:1px solid #ccc;border-radius:4px;padding:4px;text-align:center">
                  <button mat-icon-button color="primary" (click)="payInvoice(r)" matTooltip="تسجيل سداد"><mat-icon>payment</mat-icon></button>
                </div>
              </td></ng-container>
              <tr mat-header-row *matHeaderRowDef="['invoiceNo','subscriberName','totalAmount','paidAmount','remainingAmount','pay']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['invoiceNo','subscriberName','totalAmount','paidAmount','remainingAmount','pay'];"></tr>
            </table>
          </mat-card>
        </mat-tab>

        <!-- تبويب 4: التعرفة -->
        <mat-tab label="⚙️ التعرفة">
          <mat-card style="margin:1rem 0;padding:1.5rem">
            <h3><mat-icon>tune</mat-icon> خطط التعرفة والشرائح</h3>
            <div *ngFor="let t of tariffs()" style="border:1px solid #e0e0e0;border-radius:8px;padding:1rem;margin:0.5rem 0">
              <strong>{{t.name}}</strong> ({{t.billingType}}) - سعر الوحدة: {{t.unitPrice}} | ثابت: {{t.fixedFee}} | ضريبة: {{t.taxRate}}%
              <div *ngIf="t.tiers?.length" style="margin-top:0.5rem;font-size:0.9rem;color:#666">
                <span *ngFor="let tier of t.tiers">الشريحة {{tier.tierOrder}}: {{tier.fromUnits}}-{{tier.toUnits || '∞'}} = {{tier.pricePerUnit}}/وحدة | </span>
              </div>
            </div>
            <button mat-stroked-button (click)="showTariffForm = !showTariffForm" style="margin-top:1rem"><mat-icon>add</mat-icon> تعرفة جديدة</button>
            <div *ngIf="showTariffForm" style="display:flex;gap:1rem;flex-wrap:wrap;margin-top:1rem;align-items:end">
              <mat-form-field appearance="outline"><mat-label>الاسم</mat-label><input matInput [(ngModel)]="tariffForm.name"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>سعر الوحدة</mat-label><input matInput type="number" [(ngModel)]="tariffForm.unitPrice"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>رسوم ثابتة</mat-label><input matInput type="number" [(ngModel)]="tariffForm.fixedFee"></mat-form-field>
              <mat-form-field appearance="outline"><mat-label>نسبة ضريبة %</mat-label><input matInput type="number" [(ngModel)]="tariffForm.taxRate"></mat-form-field>
              <button mat-flat-button color="primary" (click)="createTariff()"><mat-icon>save</mat-icon> حفظ</button>
            </div>
          </mat-card>
        </mat-tab>
      </mat-tab-group>

      <mat-spinner *ngIf="loading()" diameter="40" style="margin:2rem auto"></mat-spinner>
    </div>
  `,
  styles: [electricityPageStyles, `.metric-row { display:flex; justify-content:space-between; padding:0.3rem 0; }`],
})
export class ElectricityBillingComponent implements OnInit {
  billingStats = signal<any>(null);
  readingCycles = signal<any[]>([]);
  billingCycles = signal<any[]>([]);
  unpaidInvoices = signal<any[]>([]);
  tariffs = signal<any[]>([]);
  genResult = signal<any>(null);
  loading = signal(false);
  generating = signal(false);

  genForm = { billingMonth: new Date().getMonth() + 1, billingYear: new Date().getFullYear(), readingCycleId: 0 as number };
  paymentSearchNoa: number | undefined;
  showTariffForm = false;
  tariffForm: any = { name: '', unitPrice: 0, fixedFee: 0, taxRate: 0 };

  months = [{v:1,n:'يناير'},{v:2,n:'فبراير'},{v:3,n:'مارس'},{v:4,n:'أبريل'},{v:5,n:'مايو'},{v:6,n:'يونيو'},{v:7,n:'يوليو'},{v:8,n:'أغسطس'},{v:9,n:'سبتمبر'},{v:10,n:'أكتوبر'},{v:11,n:'نوفمبر'},{v:12,n:'ديسمبر'}];

  constructor(private svc: ElectricityWorkflowService, private snack: MatSnackBar) {}
  ngOnInit() { this.loadAll(); }

  loadAll() {
    this.svc.getBillingStats().subscribe(r => this.billingStats.set(r.data));
    this.svc.getReadingCycles().subscribe(r => this.readingCycles.set(r.data || []));
    this.svc.getBillingCycles().subscribe(r => this.billingCycles.set(r.data || []));
    this.svc.getTariffs().subscribe(r => this.tariffs.set(r.data || []));
    this.loadUnpaid();
  }

  loadUnpaid() { this.svc.getUnpaidInvoices(this.paymentSearchNoa).subscribe(r => this.unpaidInvoices.set((r.data||[]).map((x:any)=>({...x,_payAmount:null})))); }

  generateBilling() {
    this.generating.set(true); this.genResult.set(null);
    this.svc.generateBilling(this.genForm).subscribe({ next: r => {
      this.genResult.set(r); this.generating.set(false); this.loadAll();
      this.snack.open(r.message,'حسناً',{duration:5000});
    }, error: e => { this.generating.set(false); this.snack.open(e.error?.message||'خطأ','حسناً',{duration:3000}); }});
  }

  postBilling(cycleId: number) {
    this.svc.postBilling({ billingCycleId: cycleId }).subscribe({ next: r => {
      this.snack.open(r.message,'حسناً',{duration:3000}); this.loadAll();
    }, error: e => this.snack.open(e.error?.message||'خطأ','حسناً',{duration:3000}) });
  }

  payInvoice(inv: any) {
    const amount = inv._payAmount || inv.remainingAmount;
    this.svc.recordPayment({ invoiceId: inv.id, amount }).subscribe({ next: r => {
      this.snack.open(r.message,'حسناً',{duration:3000}); this.loadUnpaid(); this.loadAll();
    }, error: e => this.snack.open(e.error?.message||'خطأ','حسناً',{duration:3000}) });
  }

  createTariff() {
    this.svc.createTariff(this.tariffForm).subscribe({ next: r => {
      this.snack.open(r.message||'تم','حسناً',{duration:3000}); this.showTariffForm = false; this.loadAll();
    }});
  }
}
