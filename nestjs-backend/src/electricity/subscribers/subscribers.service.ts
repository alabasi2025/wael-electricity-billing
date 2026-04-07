// =============================================
// خدمة المشتركين الكهربائيين
// CRUD كامل + بحث متقدم + إحصائيات
// =============================================
import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ElectricitySubscriberEntity } from './entities/electricity-subscriber.entity';
import { CreateElectricitySubscriberDto, UpdateElectricitySubscriberDto, SubscriberQueryDto } from './dto';

@Injectable()
export class ElectricitySubscribersService {
  private readonly logger = new Logger(ElectricitySubscribersService.name);

  constructor(
    @InjectRepository(ElectricitySubscriberEntity)
    private readonly repo: Repository<ElectricitySubscriberEntity>,
  ) {}

  // ─── إنشاء مشترك ───
  async create(dto: CreateElectricitySubscriberDto) {
    const exists = await this.repo.findOne({ where: { noa: dto.noa } });
    if (exists) throw new ConflictException(`المشترك رقم ${dto.noa} موجود مسبقاً`);
    const entity = this.repo.create(dto);
    const saved = await this.repo.save(entity);
    return { data: saved, message: 'تم إنشاء المشترك بنجاح' };
  }

  // ─── قائمة المشتركين مع بحث متقدم ───
  async findAll(query: SubscriberQueryDto) {
    const { page, pageSize, skip, search, groupId, collectorId, centerId,
            status, disconnectFlag, billingCategory, sortBy, sortOrder } = query;

    const qb = this.repo.createQueryBuilder('s');

    // ─── فلاتر البحث ───
    if (search) {
      qb.andWhere(
        '(s.namea ILIKE :s OR CAST(s.noa AS TEXT) LIKE :s OR s.mobile LIKE :s OR s.meterNo LIKE :s OR s.addressText ILIKE :s)',
        { s: `%${search}%` },
      );
    }
    if (groupId) qb.andWhere('s.groupId = :groupId', { groupId });
    if (collectorId) qb.andWhere('s.collectorId = :collectorId', { collectorId });
    if (centerId) qb.andWhere('s.centerId = :centerId', { centerId });
    if (status !== undefined) qb.andWhere('s.status = :status', { status });
    if (disconnectFlag !== undefined) qb.andWhere('s.disconnectFlag = :df', { df: disconnectFlag });
    if (billingCategory) qb.andWhere('s.billingCategory = :bc', { bc: billingCategory });

    // ─── الترتيب والصفحات ───
    const allowedSort = ['noa','namea','groupId','status','balance','billingCategory','createdAt'];
    const col = allowedSort.includes(sortBy) ? sortBy : 'noa';
    qb.orderBy(`s.${col}`, sortOrder === 'DESC' ? 'DESC' : 'ASC');
    qb.skip(skip).take(pageSize);

    const [data, totalCount] = await qb.getManyAndCount();
    return {
      data,
      totalCount,
      page: page || 1,
      pageSize: pageSize || 30,
      totalPages: Math.ceil(totalCount / (pageSize || 30)),
    };
  }

  // ─── مشترك واحد بالتفصيل ───
  async findOne(noa: number) {
    const sub = await this.repo.findOne({ where: { noa } });
    if (!sub) throw new NotFoundException(`المشترك ${noa} غير موجود`);
    return { data: sub };
  }

  // ─── مشترك بالـ ID ───
  async findById(id: number) {
    const sub = await this.repo.findOne({ where: { id } });
    if (!sub) throw new NotFoundException(`المشترك غير موجود`);
    return { data: sub };
  }

  // ─── تحديث مشترك ───
  async update(noa: number, dto: UpdateElectricitySubscriberDto) {
    const sub = await this.repo.findOne({ where: { noa } });
    if (!sub) throw new NotFoundException(`المشترك ${noa} غير موجود`);
    Object.assign(sub, dto);
    const saved = await this.repo.save(sub);
    return { data: saved, message: 'تم تحديث بيانات المشترك' };
  }

  // ─── حذف مشترك ───
  async remove(noa: number) {
    const sub = await this.repo.findOne({ where: { noa } });
    if (!sub) throw new NotFoundException(`المشترك ${noa} غير موجود`);
    await this.repo.remove(sub);
    return { message: `تم حذف المشترك ${noa}` };
  }

  // ─── فصل/إعادة توصيل ───
  async toggleDisconnect(noa: number) {
    const sub = await this.repo.findOne({ where: { noa } });
    if (!sub) throw new NotFoundException(`المشترك ${noa} غير موجود`);
    sub.disconnectFlag = sub.disconnectFlag === 0 ? 1 : 0;
    const saved = await this.repo.save(sub);
    const action = saved.disconnectFlag === 1 ? 'فصل' : 'إعادة توصيل';
    return { data: saved, message: `تم ${action} المشترك ${noa}` };
  }

  // ─── تحديث الرصيد ───
  async updateBalance(noa: number, amount: number, operation: 'add' | 'subtract') {
    const sub = await this.repo.findOne({ where: { noa } });
    if (!sub) throw new NotFoundException(`المشترك ${noa} غير موجود`);
    if (operation === 'add') sub.balance = +sub.balance + amount;
    else sub.balance = +sub.balance - amount;
    await this.repo.save(sub);
    return { data: { noa, newBalance: sub.balance }, message: 'تم تحديث الرصيد' };
  }

  // ─── إحصائيات المشتركين ───
  async getStats() {
    const total = await this.repo.count();
    const active = await this.repo.count({ where: { status: 1 } });
    const disconnected = await this.repo.count({ where: { disconnectFlag: 1 } });
    const withSms = await this.repo.count({ where: { smsEnabled: true } });
    const prepaid = await this.repo.count({ where: { prepaidFlag: true } });

    const balanceResult = await this.repo
      .createQueryBuilder('s')
      .select('SUM(s.balance)', 'totalBalance')
      .addSelect('COUNT(CASE WHEN s.balance > 0 THEN 1 END)', 'debtors')
      .addSelect('SUM(CASE WHEN s.balance > 0 THEN s.balance ELSE 0 END)', 'totalDebt')
      .getRawOne();

    const byCategory = await this.repo
      .createQueryBuilder('s')
      .select('s.billingCategory', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('s.billingCategory')
      .getRawMany();

    const byGroup = await this.repo
      .createQueryBuilder('s')
      .select('s.groupId', 'groupId')
      .addSelect('COUNT(*)', 'count')
      .where('s.groupId IS NOT NULL')
      .groupBy('s.groupId')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      data: {
        total,
        active,
        disconnected,
        withSms,
        prepaid,
        totalBalance: +balanceResult?.totalBalance || 0,
        debtors: +balanceResult?.debtors || 0,
        totalDebt: +balanceResult?.totalDebt || 0,
        byCategory,
        byGroup,
      },
    };
  }

  // ─── بحث سريع (للقوائم المنسدلة) ───
  async quickSearch(term: string, limit: number = 10) {
    const results = await this.repo
      .createQueryBuilder('s')
      .select(['s.id', 's.noa', 's.namea', 's.meterNo', 's.mobile', 's.balance'])
      .where('s.namea ILIKE :t OR CAST(s.noa AS TEXT) LIKE :t OR s.meterNo LIKE :t', { t: `%${term}%` })
      .orderBy('s.namea', 'ASC')
      .take(limit)
      .getMany();
    return { data: results };
  }

  // ─── المشتركين المطلوب فصلهم (رصيد مرتفع) ───
  async getOverdueSubscribers(minBalance: number = 10000) {
    const results = await this.repo
      .createQueryBuilder('s')
      .where('s.balance >= :min AND s.disconnectFlag = 0 AND s.status = 1', { min: minBalance })
      .orderBy('s.balance', 'DESC')
      .getMany();
    return { data: results, totalCount: results.length };
  }
}
