import { Component, computed, signal } from '@angular/core';

import { RouterModule } from '@angular/router';
import { LEGACY_FORMS, LEGACY_FORMS_COUNT, LegacyFormDefinition } from '../legacy-forms.data';

@Component({
    selector: 'app-legacy-index',
    imports: [RouterModule],
    template: `
    <section class="legacy-index" dir="rtl">
      <header class="hero">
        <h2>شاشات النظام القديم</h2>
        <p>تم استيراد {{ totalCount }} شاشة من Oracle Forms وربطها في Angular.</p>
      </header>
    
      <div class="search-box">
        <label for="legacy-search">بحث بالشاشة أو الاسم:</label>
        <input
          id="legacy-search"
          type="text"
          [value]="query()"
          (input)="updateQuery($event)"
          placeholder="مثال: datak أو akfal"
          />
      </div>
    
      <p class="stats">المعروض: {{ filteredForms().length }} من أصل {{ totalCount }}</p>
    
      @if (filteredForms().length) {
        <div class="cards">
          @for (form of filteredForms(); track form.id) {
            <a class="form-card" [routerLink]="['/legacy', form.id]">
              <h3>{{ form.formName }}</h3>
              <p>{{ form.sourceFile }}</p>
              <code>/legacy/{{ form.id }}</code>
            </a>
          }
        </div>
      } @else {
        <div class="empty-state">لا توجد نتائج مطابقة للبحث الحالي.</div>
      }
    
    </section>
    `,
    styles: [`
    .legacy-index {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 20px;
    }

    .hero h2 {
      margin: 0 0 8px;
      font-size: 24px;
      color: #1a237e;
    }

    .hero p {
      margin: 0 0 16px;
      color: #555;
    }

    .search-box {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 12px;
    }

    .search-box label {
      font-size: 14px;
      color: #374151;
    }

    .search-box input {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 14px;
      outline: none;
    }

    .search-box input:focus {
      border-color: #3f51b5;
      box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.12);
    }

    .stats {
      margin: 0 0 12px;
      color: #64748b;
      font-size: 13px;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 12px;
    }

    .form-card {
      display: block;
      text-decoration: none;
      color: inherit;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px;
      transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
      background: #fafcff;
    }

    .form-card:hover {
      transform: translateY(-2px);
      border-color: #3f51b5;
      box-shadow: 0 6px 16px rgba(63, 81, 181, 0.15);
    }

    .form-card h3 {
      margin: 0 0 6px;
      font-size: 16px;
      color: #0f172a;
    }

    .form-card p {
      margin: 0 0 8px;
      color: #475569;
      font-size: 13px;
    }

    .form-card code {
      font-size: 12px;
      color: #1d4ed8;
      background: #eff6ff;
      padding: 2px 6px;
      border-radius: 6px;
    }

    .empty-state {
      border: 1px dashed #cbd5e1;
      border-radius: 10px;
      padding: 18px;
      text-align: center;
      color: #64748b;
    }
  `]
})
export class LegacyIndexComponent {
  protected readonly totalCount = LEGACY_FORMS_COUNT;
  protected readonly query = signal('');

  protected readonly filteredForms = computed<LegacyFormDefinition[]>(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) {
      return LEGACY_FORMS;
    }

    return LEGACY_FORMS.filter((form) =>
      form.id.includes(q) || form.formName.toLowerCase().includes(q)
    );
  });

  protected updateQuery(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.query.set(target?.value ?? '');
  }
}

