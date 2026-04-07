import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map } from 'rxjs/operators';
import { LEGACY_FORMS_BY_ID, LegacyFormDefinition } from '../legacy-forms.data';

@Component({
    selector: 'app-legacy-form-shell',
    imports: [CommonModule, AsyncPipe, RouterModule],
    template: `
    <section class="legacy-form-shell" dir="rtl">
      @if (form$ | async; as form) {
        <header>
          <h2>{{ form.formName }}</h2>
          <p>هذه صفحة Angular مرتبطة بالشاشة القديمة المقابلة من Oracle Forms.</p>
        </header>
        <div class="meta">
          <div class="meta-item">
            <span class="label">المعرّف في المسار</span>
            <code>{{ form.id }}</code>
          </div>
          <div class="meta-item">
            <span class="label">الملف الأصلي</span>
            <code>{{ form.sourceFile }}</code>
          </div>
        </div>
        <div class="state-box">
          <h3>حالة التنفيذ</h3>
          <p>تم إنشاء هيكل الصفحة بنجاح. الخطوة القادمة هي نقل الحقول والوظائف من الشاشة القديمة.</p>
        </div>
        <a class="back-link" routerLink="/legacy">العودة إلى فهرس الشاشات</a>
      } @else {
        <div class="state-box not-found">
          <h3>الشاشة غير موجودة</h3>
          <p>لم يتم العثور على شاشة مطابقة لهذا المسار.</p>
          <a class="back-link" routerLink="/legacy">العودة إلى الفهرس</a>
        </div>
      }
    
    </section>
    `,
    styles: [`
    .legacy-form-shell {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 20px;
    }

    header h2 {
      margin: 0 0 8px;
      color: #1a237e;
      font-size: 24px;
    }

    header p {
      margin: 0 0 16px;
      color: #4b5563;
    }

    .meta {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
      margin-bottom: 16px;
    }

    .meta-item {
      border: 1px solid #dbeafe;
      background: #f8fbff;
      border-radius: 8px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .meta-item .label {
      font-size: 12px;
      color: #64748b;
    }

    .meta-item code {
      color: #0f172a;
      font-size: 13px;
      word-break: break-all;
    }

    .state-box {
      border: 1px dashed #cbd5e1;
      border-radius: 10px;
      padding: 14px;
      background: #fcfcfd;
      margin-bottom: 12px;
    }

    .state-box h3 {
      margin: 0 0 8px;
      font-size: 16px;
      color: #111827;
    }

    .state-box p {
      margin: 0;
      color: #475569;
    }

    .not-found {
      border-color: #fecaca;
      background: #fff7f7;
    }

    .back-link {
      display: inline-block;
      margin-top: 8px;
      color: #1d4ed8;
      text-decoration: none;
      font-weight: 500;
    }
  `]
})
export class LegacyFormShellComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly form$ = this.route.paramMap.pipe(
    map((params) => (params.get('formId') ?? '').toLowerCase()),
    map((id): LegacyFormDefinition | null => LEGACY_FORMS_BY_ID[id] ?? null)
  );
}

