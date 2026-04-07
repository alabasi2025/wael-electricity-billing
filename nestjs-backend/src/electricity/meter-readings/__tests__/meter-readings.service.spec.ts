// =============================================
// اختبارات نظام القراءات
// Jest Unit Tests
// =============================================
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MeterReadingsService } from '../meter-readings.service';
import { MeterReadingCycleEntity, MeterReadingEntity, MeterChangeEntity, MeterReadingAdjustmentEntity } from '../entities/meter-reading.entity';
import { ElectricitySubscriberEntity } from '../../subscribers/entities/electricity-subscriber.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockQB = () => ({
  where: jest.fn().mockReturnThis(), andWhere: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(), addSelect: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(), addOrderBy: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(), take: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue([]), getOne: jest.fn(),
  getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  getRawOne: jest.fn().mockResolvedValue({}), getCount: jest.fn().mockResolvedValue(0),
});

const createMockRepo = () => ({
  find: jest.fn(), findOne: jest.fn(), save: jest.fn(), create: jest.fn(),
  count: jest.fn(), createQueryBuilder: jest.fn(() => mockQB()),
});

describe('MeterReadingsService', () => {
  let service: MeterReadingsService;
  let cycleRepo: any, readingRepo: any, changeRepo: any, adjustRepo: any, subRepo: any;

  beforeEach(async () => {
    cycleRepo = createMockRepo(); readingRepo = createMockRepo();
    changeRepo = createMockRepo(); adjustRepo = createMockRepo(); subRepo = createMockRepo();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeterReadingsService,
        { provide: getRepositoryToken(MeterReadingCycleEntity), useValue: cycleRepo },
        { provide: getRepositoryToken(MeterReadingEntity), useValue: readingRepo },
        { provide: getRepositoryToken(MeterChangeEntity), useValue: changeRepo },
        { provide: getRepositoryToken(MeterReadingAdjustmentEntity), useValue: adjustRepo },
        { provide: getRepositoryToken(ElectricitySubscriberEntity), useValue: subRepo },
        { provide: 'DataSource', useValue: {} },
      ],
    }).compile();
    service = module.get(MeterReadingsService);
  });

  describe('createCycle', () => {
    it('يجب رفض إنشاء دورة إذا وجدت مفتوحة', async () => {
      cycleRepo.findOne.mockResolvedValue({ id: 1, status: 0 });
      await expect(service.createCycle({ dateFrom: '2026-01-01', dateTo: '2026-01-31' }))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('recordReading', () => {
    it('يجب حساب الاستهلاك (AST = KH - KS)', async () => {
      readingRepo.findOne.mockResolvedValue({ id: 1, cycleId: 1, subscriberNoa: 1001, prevReading: 100, currReading: 0, consumption: 0, status: 0 });
      cycleRepo.findOne.mockResolvedValue({ id: 1, status: 0 });
      adjustRepo.find.mockResolvedValue([]);
      readingRepo.save.mockImplementation(e => Promise.resolve(e));

      const result = await service.recordReading(1, { subscriberNoa: 1001, currReading: 250 });
      expect(result.data.consumption).toBe(150); // 250 - 100
      expect(result.data.isAnomaly).toBe(false);
    });

    it('يجب كشف قراءة صفرية كشاذة', async () => {
      readingRepo.findOne.mockResolvedValue({ id: 1, cycleId: 1, subscriberNoa: 1001, prevReading: 100, status: 0 });
      cycleRepo.findOne.mockResolvedValue({ id: 1, status: 0 });
      adjustRepo.find.mockResolvedValue([]);
      readingRepo.save.mockImplementation(e => Promise.resolve(e));

      const result = await service.recordReading(1, { subscriberNoa: 1001, currReading: 0 });
      expect(result.data.isAnomaly).toBe(true);
      expect(result.data.anomalyReason).toContain('صفر');
    });

    it('يجب كشف قراءة متراجعة كشاذة', async () => {
      readingRepo.findOne.mockResolvedValue({ id: 1, cycleId: 1, subscriberNoa: 1001, prevReading: 200, status: 0 });
      cycleRepo.findOne.mockResolvedValue({ id: 1, status: 0 });
      adjustRepo.find.mockResolvedValue([]);
      readingRepo.save.mockImplementation(e => Promise.resolve(e));

      const result = await service.recordReading(1, { subscriberNoa: 1001, currReading: 150 });
      expect(result.data.isAnomaly).toBe(true);
      expect(result.data.anomalyReason).toContain('تراجع');
    });

    it('يجب كشف استهلاك مرتفع جداً كشاذ', async () => {
      readingRepo.findOne.mockResolvedValue({ id: 1, cycleId: 1, subscriberNoa: 1001, prevReading: 100, status: 0 });
      cycleRepo.findOne.mockResolvedValue({ id: 1, status: 0 });
      adjustRepo.find.mockResolvedValue([]);
      readingRepo.save.mockImplementation(e => Promise.resolve(e));

      const result = await service.recordReading(1, { subscriberNoa: 1001, currReading: 500 }); // 400 > 100*3
      expect(result.data.isAnomaly).toBe(true);
      expect(result.data.anomalyReason).toContain('مرتفع');
    });

    it('يجب رفض التعديل على دورة مغلقة', async () => {
      readingRepo.findOne.mockResolvedValue({ id: 1, cycleId: 1, subscriberNoa: 1001 });
      cycleRepo.findOne.mockResolvedValue({ id: 1, status: 1 }); // مغلقة
      await expect(service.recordReading(1, { subscriberNoa: 1001, currReading: 200 }))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('createMeterChange', () => {
    it('يجب تسجيل تغيير العداد وتحديث المشترك', async () => {
      subRepo.findOne.mockResolvedValue({ id: 1, noa: 1001, meterNo: 'OLD-001' });
      subRepo.save.mockImplementation(e => Promise.resolve(e));
      changeRepo.create.mockReturnValue({ id: 1 });
      changeRepo.save.mockResolvedValue({ id: 1, subscriberNoa: 1001, newMeterNo: 'NEW-001' });

      const result = await service.createMeterChange({
        subscriberNoa: 1001, newMeterNo: 'NEW-001', changeDate: '2026-04-01', reason: 'عطل',
      });
      expect(result.message).toContain('تم تغيير عداد');
    });

    it('يجب رفض تغيير عداد لمشترك غير موجود', async () => {
      subRepo.findOne.mockResolvedValue(null);
      await expect(service.createMeterChange({ subscriberNoa: 9999, newMeterNo: 'X', changeDate: '2026-01-01' }))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('closeCycle', () => {
    it('يجب إغلاق الدورة مع إحصائيات', async () => {
      cycleRepo.findOne.mockResolvedValue({ id: 1, status: 0 });
      readingRepo.createQueryBuilder.mockReturnValue({
        select: jest.fn().mockReturnThis(), addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ total: '50', read: '45', totalConsumption: '5000' }),
      });
      cycleRepo.save.mockImplementation(e => Promise.resolve(e));

      const result = await service.closeCycle(1);
      expect(result.message).toContain('تم إغلاق');
    });

    it('يجب رفض إغلاق دورة مغلقة', async () => {
      cycleRepo.findOne.mockResolvedValue({ id: 1, status: 1 });
      await expect(service.closeCycle(1)).rejects.toThrow(BadRequestException);
    });
  });
});
