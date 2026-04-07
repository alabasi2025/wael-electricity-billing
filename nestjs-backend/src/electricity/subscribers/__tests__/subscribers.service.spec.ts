// =============================================
// اختبارات وحدة المشتركين الكهربائيين
// Jest Unit Tests
// =============================================
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ElectricitySubscribersService } from '../subscribers.service';
import { ElectricitySubscriberEntity } from '../entities/electricity-subscriber.entity';
import { Repository } from 'typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';

type MockRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepo = <T = any>(): MockRepo<T> => ({
  find: jest.fn(), findOne: jest.fn(), save: jest.fn(), create: jest.fn(),
  remove: jest.fn(), count: jest.fn(), createQueryBuilder: jest.fn(),
});

describe('ElectricitySubscribersService', () => {
  let service: ElectricitySubscribersService;
  let repo: MockRepo;

  const mockQB = {
    where: jest.fn().mockReturnThis(), andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(), skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(), select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(), groupBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(), getMany: jest.fn(), getOne: jest.fn(),
    getManyAndCount: jest.fn(), getRawOne: jest.fn(), getRawMany: jest.fn(),
  };

  beforeEach(async () => {
    repo = createMockRepo();
    (repo.createQueryBuilder as jest.Mock).mockReturnValue(mockQB);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElectricitySubscribersService,
        { provide: getRepositoryToken(ElectricitySubscriberEntity), useValue: repo },
      ],
    }).compile();
    service = module.get(ElectricitySubscribersService);
  });

  describe('create', () => {
    it('يجب إنشاء مشترك جديد بنجاح', async () => {
      const dto = { noa: 1001, namea: 'أحمد محمد', mobile: '777123456', billingCategory: 'ampere' };
      repo.findOne.mockResolvedValue(null);
      repo.create.mockReturnValue({ id: 1, ...dto });
      repo.save.mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(dto as any);
      expect(result.data.noa).toBe(1001);
      expect(result.data.namea).toBe('أحمد محمد');
      expect(result.message).toContain('تم إنشاء');
    });

    it('يجب رفض مشترك مكرر', async () => {
      repo.findOne.mockResolvedValue({ id: 1, noa: 1001 });
      await expect(service.create({ noa: 1001, namea: 'test' } as any)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('يجب إرجاع قائمة المشتركين مع الصفحات', async () => {
      mockQB.getManyAndCount.mockResolvedValue([[{ id: 1, noa: 1001 }], 1]);
      const result = await service.findAll({ page: 1, pageSize: 30, skip: 0 } as any);
      expect(result.data).toHaveLength(1);
      expect(result.totalCount).toBe(1);
    });

    it('يجب دعم البحث بالاسم', async () => {
      mockQB.getManyAndCount.mockResolvedValue([[], 0]);
      await service.findAll({ page: 1, pageSize: 30, skip: 0, search: 'أحمد' } as any);
      expect(mockQB.andWhere).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('يجب إرجاع مشترك واحد', async () => {
      repo.findOne.mockResolvedValue({ id: 1, noa: 1001, namea: 'أحمد' });
      const result = await service.findOne(1001);
      expect(result.data.noa).toBe(1001);
    });

    it('يجب رمي خطأ إذا المشترك غير موجود', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOne(9999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('يجب تحديث بيانات المشترك', async () => {
      const existing = { id: 1, noa: 1001, namea: 'أحمد', mobile: '777' };
      repo.findOne.mockResolvedValue({ ...existing });
      repo.save.mockResolvedValue({ ...existing, mobile: '778' });
      const result = await service.update(1001, { mobile: '778' });
      expect(result.message).toContain('تم تحديث');
    });
  });

  describe('toggleDisconnect', () => {
    it('يجب فصل المشترك', async () => {
      repo.findOne.mockResolvedValue({ id: 1, noa: 1001, disconnectFlag: 0 });
      repo.save.mockImplementation(e => Promise.resolve({ ...e, disconnectFlag: 1 }));
      const result = await service.toggleDisconnect(1001);
      expect(result.message).toContain('فصل');
    });

    it('يجب إعادة توصيل المشترك المفصول', async () => {
      repo.findOne.mockResolvedValue({ id: 1, noa: 1001, disconnectFlag: 1 });
      repo.save.mockImplementation(e => Promise.resolve({ ...e, disconnectFlag: 0 }));
      const result = await service.toggleDisconnect(1001);
      expect(result.message).toContain('إعادة توصيل');
    });
  });

  describe('updateBalance', () => {
    it('يجب إضافة مبلغ للرصيد', async () => {
      repo.findOne.mockResolvedValue({ id: 1, noa: 1001, balance: 5000 });
      repo.save.mockImplementation(e => Promise.resolve(e));
      const result = await service.updateBalance(1001, 1000, 'add');
      expect(result.data.newBalance).toBe(6000);
    });

    it('يجب خصم مبلغ من الرصيد', async () => {
      repo.findOne.mockResolvedValue({ id: 1, noa: 1001, balance: 5000 });
      repo.save.mockImplementation(e => Promise.resolve(e));
      const result = await service.updateBalance(1001, 2000, 'subtract');
      expect(result.data.newBalance).toBe(3000);
    });
  });

  describe('getStats', () => {
    it('يجب إرجاع الإحصائيات', async () => {
      repo.count.mockResolvedValueOnce(100).mockResolvedValueOnce(90)
        .mockResolvedValueOnce(10).mockResolvedValueOnce(50).mockResolvedValueOnce(5);
      mockQB.getRawOne.mockResolvedValue({ totalBalance: '50000', debtors: '30', totalDebt: '30000' });
      mockQB.getRawMany.mockResolvedValue([]);
      const result = await service.getStats();
      expect(result.data.total).toBe(100);
      expect(result.data.active).toBe(90);
      expect(result.data.disconnected).toBe(10);
    });
  });
});
