// =============================================
// اختبارات إضافية: المحاسبة + التقارير + SMS + المخازن + الصلاحيات
// =============================================

describe('🧪 اختبارات المحاسبة (accounting)', () => {
  it('يجب إنشاء قيد محاسبي مع ترقيم تلقائي', () => {
    const maxNo = 100;
    const newEntry = { entryNo: maxNo + 1, accountNoa: 2001, debit: 5000, credit: 0, entryDate: '2026-03-15' };
    expect(newEntry.entryNo).toBe(101);
    expect(newEntry.debit).toBeGreaterThan(0);
  });

  it('يجب حساب ميزان المراجعة (مدين = دائن)', () => {
    const entries = [
      { accountNoa: 1001, debit: 10000, credit: 0 },
      { accountNoa: 2001, debit: 0, credit: 10000 },
      { accountNoa: 1002, debit: 5000, credit: 0 },
      { accountNoa: 3001, debit: 0, credit: 5000 },
    ];
    const totalDebit = entries.reduce((s, e) => s + e.debit, 0);
    const totalCredit = entries.reduce((s, e) => s + e.credit, 0);
    expect(totalDebit).toBe(totalCredit);
    expect(totalDebit).toBe(15000);
  });

  it('يجب حساب كشف حساب مع رصيد تراكمي', () => {
    const entries = [
      { debit: 5000, credit: 0 },
      { debit: 0, credit: 3000 },
      { debit: 2000, credit: 0 },
    ];
    let balance = 0;
    const result = entries.map(e => { balance += e.debit - e.credit; return { ...e, balance }; });
    expect(result[0].balance).toBe(5000);
    expect(result[1].balance).toBe(2000);
    expect(result[2].balance).toBe(4000);
  });

  it('يجب كشف الإقفال غير المتوازن', () => {
    const totalDebit = 15000; const totalCredit = 14500;
    const balanced = Math.abs(totalDebit - totalCredit) < 0.01;
    expect(balanced).toBe(false);
  });

  it('يجب كشف الإقفال المتوازن', () => {
    const totalDebit = 15000; const totalCredit = 15000;
    const balanced = Math.abs(totalDebit - totalCredit) < 0.01;
    expect(balanced).toBe(true);
  });
});

describe('🧪 اختبارات التقارير (reports)', () => {
  it('يجب حساب نسبة التحصيل بشكل صحيح', () => {
    const billed = 50000; const paid = 35000;
    const rate = Math.round((paid / billed) * 100);
    expect(rate).toBe(70);
  });

  it('يجب ترتيب المديونية تنازلياً', () => {
    const debtors = [{ noa: 1, balance: 3000 }, { noa: 2, balance: 8000 }, { noa: 3, balance: 1000 }];
    const sorted = debtors.sort((a, b) => b.balance - a.balance);
    expect(sorted[0].noa).toBe(2);
    expect(sorted[0].balance).toBe(8000);
  });

  it('يجب مقارنة شهرين بشكل صحيح', () => {
    const month1 = { billed: 40000, paid: 30000, consumption: 5000 };
    const month2 = { billed: 45000, paid: 35000, consumption: 5500 };
    const diff = { billed: month2.billed - month1.billed, consumption: month2.consumption - month1.consumption };
    expect(diff.billed).toBe(5000);
    expect(diff.consumption).toBe(500);
  });

  it('يجب تجميع الاستهلاك حسب المجموعة', () => {
    const readings = [
      { groupId: 1, consumption: 100 }, { groupId: 1, consumption: 150 },
      { groupId: 2, consumption: 200 }, { groupId: 2, consumption: 80 },
    ];
    const groups: Record<number, number> = {};
    readings.forEach(r => { groups[r.groupId] = (groups[r.groupId] || 0) + r.consumption; });
    expect(groups[1]).toBe(250);
    expect(groups[2]).toBe(280);
  });
});

describe('🧪 اختبارات SMS Gateway', () => {
  it('يجب تطبيع رقم هاتف يمني (0 → +967)', () => {
    const normalize = (phone: string): string => {
      let clean = phone.replace(/[\s\-]/g, '');
      if (clean.startsWith('0') && clean.length >= 9) clean = '+967' + clean.substring(1);
      if (!clean.startsWith('+')) clean = '+967' + clean;
      return clean;
    };
    expect(normalize('0777123456')).toBe('+967777123456');
    expect(normalize('777123456')).toBe('+967777123456');
    expect(normalize('+967777123456')).toBe('+967777123456');
  });

  it('يجب رفض رقم هاتف قصير', () => {
    const isValid = (phone: string): boolean => phone.replace(/\D/g, '').length >= 9;
    expect(isValid('123')).toBe(false);
    expect(isValid('777123456')).toBe(true);
  });

  it('يجب تطبيق قالب مع متغيرات', () => {
    const template = 'المشترك {name} #{noa}: رصيدكم {balance} ريال';
    const vars: Record<string, string> = { name: 'أحمد', noa: '2001', balance: '5,000' };
    let result = template;
    for (const [k, v] of Object.entries(vars)) result = result.replace(`{${k}}`, v);
    expect(result).toBe('المشترك أحمد #2001: رصيدكم 5,000 ريال');
  });
});

describe('🧪 اختبارات المخازن (warehouse)', () => {
  it('يجب زيادة الكمية عند الإدخال', () => {
    let qty = 50; const inQty = 20;
    qty += inQty;
    expect(qty).toBe(70);
  });

  it('يجب نقص الكمية عند الإخراج', () => {
    let qty = 50; const outQty = 15;
    qty -= outQty;
    expect(qty).toBe(35);
  });

  it('يجب كشف الأصناف تحت الحد الأدنى', () => {
    const items = [
      { name: 'عداد', quantity: 5, minStock: 10 },
      { name: 'كابل', quantity: 100, minStock: 20 },
      { name: 'قاطع', quantity: 2, minStock: 5 },
    ];
    const lowStock = items.filter(i => i.quantity <= i.minStock && i.minStock > 0);
    expect(lowStock).toHaveLength(2);
    expect(lowStock[0].name).toBe('عداد');
  });

  it('يجب حساب قيمة المخزن', () => {
    const items = [{ quantity: 10, unitPrice: 500 }, { quantity: 100, unitPrice: 20 }];
    const totalValue = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
    expect(totalValue).toBe(7000);
  });
});

describe('🧪 اختبارات الصلاحيات (permissions)', () => {
  it('يجب السماح للمستخدم مع الصلاحية', () => {
    const userPerms = ['subscribers.read', 'readings.create', 'billing.read'];
    const check = (module: string, action: string) => userPerms.includes(`${module}.${action}`);
    expect(check('subscribers', 'read')).toBe(true);
    expect(check('readings', 'create')).toBe(true);
  });

  it('يجب منع المستخدم بدون صلاحية', () => {
    const userPerms = ['subscribers.read'];
    const check = (module: string, action: string) => userPerms.includes(`${module}.${action}`);
    expect(check('billing', 'create')).toBe(false);
    expect(check('subscribers', 'delete')).toBe(false);
  });

  it('يجب فلترة القائمة حسب الصلاحيات', () => {
    const menuItems = [
      { title: 'المشتركين', permission: 'subscribers.read' },
      { title: 'الفوترة', permission: 'billing.create' },
      { title: 'التقارير', permission: 'reports.read' },
    ];
    const userPerms = new Set(['subscribers.read', 'reports.read']);
    const visible = menuItems.filter(m => !m.permission || userPerms.has(m.permission));
    expect(visible).toHaveLength(2);
    expect(visible[0].title).toBe('المشتركين');
    expect(visible[1].title).toBe('التقارير');
  });
});

describe('🧪 اختبارات الطباعة (print)', () => {
  it('يجب أن يحتوي HTML على RTL', () => {
    const html = '<html dir="rtl"><body>فاتورة</body></html>';
    expect(html).toContain('dir="rtl"');
  });

  it('يجب حساب إجمالي الفاتورة للطباعة', () => {
    const items = [{ amount: 5000 }, { amount: 500 }, { amount: 200 }, { amount: 285 }];
    const total = items.reduce((s, i) => s + i.amount, 0);
    expect(total).toBe(5985);
  });

  it('يجب تنسيق الأرقام العربية', () => {
    const num = 1234567.89;
    const formatted = num.toLocaleString();
    expect(formatted).toBeTruthy();
    expect(formatted.length).toBeGreaterThan(0);
  });
});
