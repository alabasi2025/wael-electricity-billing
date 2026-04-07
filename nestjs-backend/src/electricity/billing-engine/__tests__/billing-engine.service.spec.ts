// =============================================
// اختبارات محرك الفوترة
// Jest Unit Tests - دورة الفوترة الكاملة
// =============================================
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BillingEngineService } from '../billing-engine.service';
import { TariffPlanEntity, TariffTierEntity, BillingCycleEntity, BillingInvoiceEntity, BillingInvoiceItemEntity, BillingPostingEntity } from '../entities/billing.entity';
import { MeterReadingEntity } from '../../meter-readings/entities/meter-reading.entity';
import { ElectricitySubscriberEntity } from '../../subscribers/entities/electricity-subscriber.entity';
import { BadRequestException } from '@nestjs/common';

const createMockRepo = () => ({
  find: jest.fn(), findOne: jest.fn(), save: jest.fn(), create: jest.fn(),
  count: jest.fn(), createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(), andWhere: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(), addSelect: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(), orderBy: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(), getMany: jest.fn().mockResolvedValue([]),
    getRawOne: jest.fn().mockResolvedValue({}), getRawMany: jest.fn().mockResolvedValue([]),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  })),
});

describe('BillingEngineService', () => {
  let service: BillingEngineService;
  let tariffRepo: any, tierRepo: any, cycleRepo: any, invoiceRepo: any, itemRepo: any, postingRepo: any, readingRepo: any, subRepo: any;

  beforeEach(async () => {
    tariffRepo = createMockRepo(); tierRepo = createMockRepo(); cycleRepo = createMockRepo();
    invoiceRepo = createMockRepo(); itemRepo = createMockRepo(); postingRepo = createMockRepo();
    readingRepo = createMockRepo(); subRepo = createMockRepo();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingEngineService,
        { provide: getRepositoryToken(TariffPlanEntity), useValue: tariffRepo },
        { provide: getRepositoryToken(TariffTierEntity), useValue: tierRepo },
        { provide: getRepositoryToken(BillingCycleEntity), useValue: cycleRepo },
        { provide: getRepositoryToken(BillingInvoiceEntity), useValue: invoiceRepo },
        { provide: getRepositoryToken(BillingInvoiceItemEntity), useValue: itemRepo },
        { provide: getRepositoryToken(BillingPostingEntity), useValue: postingRepo },
        { provide: getRepositoryToken(MeterReadingEntity), useValue: readingRepo },
        { provide: getRepositoryToken(ElectricitySubscriberEntity), useValue: subRepo },
        { provide: 'DataSource', useValue: {} },
      ],
    }).compile();
    service = module.get(BillingEngineService);
  });

  describe('calculateConsumptionAmount (بديل SAR_K)', () => {
    it('يجب حساب المبلغ بسعر ثابت بدون شرائح', () => {
      const tariff = { unitPrice: 50, tiers: [] } as any;
      expect(service.calculateConsumptionAmount(100, tariff)).toBe(5000);
    });

    it('يجب حساب المبلغ بشرائح', () => {
      const tariff = {
        unitPrice: 50, tiers: [
          { tierOrder: 1, fromUnits: 0, toUnits: 50, pricePerUnit: 30 },
          { tierOrder: 2, fromUnits: 50, toUnits: 100, pricePerUnit: 50 },
          { tierOrder: 3, fromUnits: 100, toUnits: null, pricePerUnit: 80 },
        ],
      } as any;
      // 50*30 + 50*50 + 20*80 = 1500 + 2500 + 1600 = 5600
      expect(service.calculateConsumptionAmount(120, tariff)).toBe(5600);
    });

    it('يجب حساب استهلاك صفر', () => {
      const tariff = { unitPrice: 50, tiers: [] } as any;
      expect(service.calculateConsumptionAmount(0, tariff)).toBe(0);
    });

    it('يجب حساب استهلاك ضمن شريحة واحدة فقط', () => {
      const tariff = {
        unitPrice: 50, tiers: [
          { tierOrder: 1, fromUnits: 0, toUnits: 100, pricePerUnit: 30 },
          { tierOrder: 2, fromUnits: 100, toUnits: null, pricePerUnit: 60 },
        ],
      } as any;
      expect(service.calculateConsumptionAmount(50, tariff)).toBe(1500);
    });
  });

  describe('createTariff', () => {
    it('يجب إنشاء تعرفة مع شرائح', async () => {
      tariffRepo.create.mockReturnValue({ id: 1, name: 'عادي' });
      tariffRepo.save.mockResolvedValue({ id: 1, name: 'عادي' });
      tariffRepo.findOne.mockResolvedValue({ id: 1, name: 'عادي', tiers: [] });
      tierRepo.create.mockReturnValue({});
      tierRepo.save.mockResolvedValue([]);

      const result = await service.createTariff({ name: 'عادي', unitPrice: 50, tiers: [{ tierOrder: 1, fromUnits: 0, toUnits: 100, pricePerUnit: 30 }] });
      expect(result.message).toContain('تم إنشاء التعرفة');
    });
  });

  describe('generateBilling', () => {
    it('يجب رفض الفوترة المكررة', async () => {
      cycleRepo.findOne.mockResolvedValue({ id: 1 }); // موجودة
      await expect(service.generateBilling({ billingMonth: 1, billingYear: 2026, readingCycleId: 1 }))
        .rejects.toThrow(BadRequestException);
    });

    it('يجب رفض الفوترة بدون قراءات', async () => {
      cycleRepo.findOne.mockResolvedValue(null);
      readingRepo.createQueryBuilder.mockReturnValue({
        where: jest.fn().mockReturnThis(), getMany: jest.fn().mockResolvedValue([]),
      });
      await expect(service.generateBilling({ billingMonth: 1, billingYear: 2026, readingCycleId: 1 }))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('recordPayment', () => {
    it('يجب تسجيل سداد كامل', async () => {
      invoiceRepo.findOne.mockResolvedValue({ id: 1, invoiceNo: 100, subscriberNoa: 1001, grandTotal: 5000, paidAmount: 0, remainingAmount: 5000, status: 2 });
      invoiceRepo.save.mockImplementation(e => Promise.resolve(e));
      subRepo.findOne.mockResolvedValue({ noa: 1001, balance: 5000 });
      subRepo.save.mockImplementation(e => Promise.resolve(e));

      const result = await service.recordPayment({ invoiceId: 1, amount: 5000 });
      expect(result.message).toContain('تم تسجيل سداد');
      expect(result.data.status).toBe(4); // مسددة بالكامل
    });

    it('يجب تسجيل سداد جزئي', async () => {
      invoiceRepo.findOne.mockResolvedValue({ id: 1, invoiceNo: 100, subscriberNoa: 1001, grandTotal: 5000, paidAmount: 0, remainingAmount: 5000, status: 2 });
      invoiceRepo.save.mockImplementation(e => Promise.resolve(e));
      subRepo.findOne.mockResolvedValue({ noa: 1001, balance: 5000 });
      subRepo.save.mockImplementation(e => Promise.resolve(e));

      const result = await service.recordPayment({ invoiceId: 1, amount: 2000 });
      expect(result.data.status).toBe(3); // مسددة جزئياً
      expect(result.data.remaining).toBe(3000);
    });
  });

  describe('getBillingStats', () => {
    it('يجب إرجاع الإحصائيات', async () => {
      cycleRepo.count.mockResolvedValue(5);
      invoiceRepo.count.mockResolvedValue(100);
      invoiceRepo.createQueryBuilder.mockReturnValue({
        select: jest.fn().mockReturnThis(), addSelect: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ totalBilled: '50000', totalPaid: '30000', totalUnpaid: '20000', paidInvoices: '60', unpaidInvoices: '40' }),
      });
      const result = await service.getBillingStats();
      expect(result.data.totalCycles).toBe(5);
      expect(result.data.collectionRate).toBe(60);
    });
  });
});
