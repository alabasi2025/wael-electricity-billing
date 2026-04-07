// =============================================
// خدمة القراءات - محرك دورة القراءة الكاملة
// بديل: addmz.fmb + منطق REDMZ/REDMMZ
// =============================================
import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  MeterReadingCycleEntity, MeterReadingEntity,
  MeterChangeEntity, MeterReadingAdjustmentEntity,
} from './entities/meter-reading.entity';
import { ElectricitySubscriberEntity } from '../subscribers/entities/electricity-subscriber.entity';
import {
  CreateReadingCycleDto, RecordReadingDto, BulkRecordReadingsDto,
  CreateMeterChangeDto, CreateReadingAdjustmentDto, ReadingQueryDto,
} from './dto';

@Injectable()
export class MeterReadingsService {
  private readonly logger = new Logger(MeterReadingsService.name);

  constructor(
    @InjectRepository(MeterReadingCycleEntity) private readonly cycleRepo: Repository<MeterReadingCycleEntity>,
    @InjectRepository(MeterReadingEntity) private readonly readingRepo: Repository<MeterReadingEntity>,
    @InjectRepository(MeterChangeEntity) private readonly changeRepo: Repository<MeterChangeEntity>,
    @InjectRepository(MeterReadingAdjustmentEntity) private readonly adjustRepo: Repository<MeterReadingAdjustmentEntity>,
    @InjectRepository(ElectricitySubscriberEntity) private readonly subRepo: Repository<ElectricitySubscriberEntity>,
    private readonly dataSource: DataSource,
  ) {}

  // ══════════════════════════════════════════
  // دورات القراءة (REDMZ)
  // ══════════════════════════════════════════

  // ─── إنشاء دورة قراءة جديدة ───
  async createCycle(dto: CreateReadingCycleDto, userId?: number) {
    // التحقق من عدم وجود دورة مفتوحة
    const openCycle = await this.cycleRepo.findOne({ where: { status: 0 } });
    if (openCycle) throw new BadRequestException('يوجد دورة قراءة مفتوحة بالفعل. أغلقها أولاً.');

    // توليد رقم دورة تلقائي
    const maxResult = await this.cycleRepo.createQueryBuilder('c')
      .select('MAX(c.cycleNo)', 'max').getRawOne();
    const nextCycleNo = (maxResult?.max || 0) + 1;

    // حساب التسلسل في السنة
    const year = new Date(dto.dateTo).getFullYear();
    const seqResult = await this.cycleRepo.createQueryBuilder('c')
      .select('MAX(c.cycleSeq)', 'max')
      .where("EXTRACT(YEAR FROM c.dateTo) = :year", { year }).getRawOne();
    const nextSeq = (seqResult?.max || 0) + 1;

    // جلب المشتركين للدورة
    const subQb = this.subRepo.createQueryBuilder('s')
      .where('s.status = 1 AND s.disconnectFlag = 0');
    if (dto.groupId) subQb.andWhere('s.groupId = :gid', { gid: dto.groupId });
    const subscribers = await subQb.getMany();

    // إنشاء الدورة
    const cycle = this.cycleRepo.create({
      cycleNo: nextCycleNo,
      cycleSeq: nextSeq,
      dateFrom: dto.dateFrom as any,
      dateTo: dto.dateTo as any,
      groupId: dto.groupId,
      centerId: dto.centerId,
      totalSubscribers: subscribers.length,
      notes: dto.notes,
      createdBy: userId,
    });
    const savedCycle = await this.cycleRepo.save(cycle);

    // إنشاء سجل قراءة فارغ لكل مشترك
    const readings = subscribers.map(sub => this.readingRepo.create({
      cycleId: savedCycle.id,
      subscriberId: sub.id,
      subscriberNoa: sub.noa,
      meterName: sub.meterNo,
      prevReading: 0, // سيتم ملؤها من آخر دورة
      readingDateFrom: dto.dateFrom as any,
      readingDateTo: dto.dateTo as any,
      unitPrice: +sub.unitPrice || 0,
    }));

    // جلب القراءة السابقة لكل مشترك
    const prevCycle = await this.cycleRepo.findOne({
      where: { status: 1 },
      order: { dateTo: 'DESC' },
    });
    if (prevCycle) {
      const prevReadings = await this.readingRepo.find({ where: { cycleId: prevCycle.id } });
      const prevMap = new Map(prevReadings.map(r => [r.subscriberNoa, r]));
      for (const reading of readings) {
        const prev = prevMap.get(reading.subscriberNoa);
        if (prev) {
          reading.prevReading = prev.currReading || prev.prevReading || 0;
        }
      }
    }

    await this.readingRepo.save(readings);

    return {
      data: { ...savedCycle, readingsCreated: readings.length },
      message: `تم إنشاء دورة القراءة رقم ${nextCycleNo} مع ${readings.length} مشترك`,
    };
  }

  // ─── قائمة الدورات ───
  async findAllCycles() {
    const cycles = await this.cycleRepo.find({ order: { dateTo: 'DESC' } });
    return { data: cycles };
  }

  // ─── إغلاق دورة ───
  async closeCycle(cycleId: number) {
    const cycle = await this.cycleRepo.findOne({ where: { id: cycleId } });
    if (!cycle) throw new NotFoundException('الدورة غير موجودة');
    if (cycle.status !== 0) throw new BadRequestException('الدورة مغلقة بالفعل');

    // حساب الإحصائيات
    const stats = await this.readingRepo.createQueryBuilder('r')
      .select('COUNT(*)', 'total')
      .addSelect('COUNT(CASE WHEN r.currReading > 0 THEN 1 END)', 'read')
      .addSelect('SUM(r.consumption)', 'totalConsumption')
      .where('r.cycleId = :cid', { cid: cycleId }).getRawOne();

    cycle.status = 1;
    cycle.totalRead = +stats.read || 0;
    cycle.totalConsumption = +stats.totalConsumption || 0;
    cycle.closedAt = new Date();
    await this.cycleRepo.save(cycle);

    return { data: cycle, message: 'تم إغلاق الدورة' };
  }

  // ══════════════════════════════════════════
  // القراءات التفصيلية (REDMMZ)
  // ══════════════════════════════════════════

  // ─── قراءات دورة معينة ───
  async findReadingsByCycle(cycleId: number, query: ReadingQueryDto) {
    const qb = this.readingRepo.createQueryBuilder('r')
      .where('r.cycleId = :cid', { cid: cycleId });

    if (query.search) {
      qb.andWhere('(CAST(r.subscriberNoa AS TEXT) LIKE :s OR r.meterName ILIKE :s)', { s: `%${query.search}%` });
    }
    if (query.status !== undefined) qb.andWhere('r.status = :st', { st: query.status });

    qb.orderBy('r.subscriberNoa', 'ASC').skip(query.skip).take(query.pageSize);
    const [data, totalCount] = await qb.getManyAndCount();

    // حساب الملخص
    const summary = await this.readingRepo.createQueryBuilder('r')
      .select('COUNT(*)', 'total')
      .addSelect('COUNT(CASE WHEN r.currReading > 0 THEN 1 END)', 'completed')
      .addSelect('COUNT(CASE WHEN r.isAnomaly = true THEN 1 END)', 'anomalies')
      .addSelect('SUM(r.consumption)', 'totalConsumption')
      .where('r.cycleId = :cid', { cid: cycleId }).getRawOne();

    return { data, totalCount, summary, page: query.page, pageSize: query.pageSize };
  }

  // ─── تسجيل قراءة مشترك واحد (منطق addmz.fmb) ───
  async recordReading(cycleId: number, dto: RecordReadingDto, userId?: number) {
    const reading = await this.readingRepo.findOne({
      where: { cycleId, subscriberNoa: dto.subscriberNoa },
    });
    if (!reading) throw new NotFoundException('سجل القراءة غير موجود لهذا المشترك في هذه الدورة');

    const cycle = await this.cycleRepo.findOne({ where: { id: cycleId } });
    if (cycle?.status !== 0) throw new BadRequestException('الدورة مغلقة ولا يمكن التعديل عليها');

    // ─── حساب الاستهلاك (منطق addmz: AST = KH - KS) ───
    const prevReading = +reading.prevReading || 0;
    const currReading = dto.currReading;
    const consumption = currReading - prevReading;

    // ─── كشف القراءة الشاذة ───
    let isAnomaly = false;
    let anomalyReason = null;
    if (currReading === 0) {
      isAnomaly = true; anomalyReason = 'القراءة صفر';
    } else if (currReading === prevReading) {
      isAnomaly = true; anomalyReason = 'القراءة مطابقة للسابقة (لا استهلاك)';
    } else if (consumption < 0) {
      isAnomaly = true; anomalyReason = 'القراءة أقل من السابقة (تراجع)';
    } else if (consumption > prevReading * 3 && prevReading > 0) {
      isAnomaly = true; anomalyReason = 'استهلاك مرتفع جداً (أكثر من 3 أضعاف)';
    }

    // ─── حساب التعديلات (KHR + KHZ من DATAKSNF) ───
    const adjustments = await this.adjustRepo.find({
      where: { subscriberNoa: dto.subscriberNoa, cycleId, status: 1 },
    });
    const totalAdjusted = adjustments.reduce((sum, a) => sum + (+a.difference || 0), 0);

    // ─── حساب الفرق الصافي (FRK = AST - KHR - KHZ) ───
    const netConsumption = consumption - Math.abs(totalAdjusted);

    // ─── تحديث السجل ───
    reading.currReading = currReading;
    reading.consumption = consumption;
    reading.adjustedReading = totalAdjusted;
    reading.netConsumption = netConsumption;
    reading.isAnomaly = isAnomaly;
    reading.anomalyReason = anomalyReason;
    reading.readingDate = new Date();
    reading.status = isAnomaly ? 2 : 1;
    reading.enteredBy = userId;

    const saved = await this.readingRepo.save(reading);
    return {
      data: saved,
      message: isAnomaly
        ? `⚠️ قراءة شاذة: ${anomalyReason}. الاستهلاك: ${consumption}`
        : `✅ تم تسجيل القراءة. الاستهلاك: ${consumption}`,
    };
  }

  // ─── تسجيل قراءات جماعية ───
  async bulkRecordReadings(cycleId: number, dto: BulkRecordReadingsDto, userId?: number) {
    const results = [];
    for (const reading of dto.readings) {
      try {
        const result = await this.recordReading(cycleId, reading, userId);
        results.push({ noa: reading.subscriberNoa, success: true, ...result.data });
      } catch (err) {
        results.push({ noa: reading.subscriberNoa, success: false, error: err.message });
      }
    }
    const success = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    return {
      data: results,
      message: `تم تسجيل ${success} قراءة بنجاح، ${failed} فشل`,
    };
  }

  // ══════════════════════════════════════════
  // تغيير العدادات (TRK)
  // ══════════════════════════════════════════

  async createMeterChange(dto: CreateMeterChangeDto, userId?: number) {
    const sub = await this.subRepo.findOne({ where: { noa: dto.subscriberNoa } });
    if (!sub) throw new NotFoundException('المشترك غير موجود');

    const change = this.changeRepo.create({
      subscriberId: sub.id,
      subscriberNoa: dto.subscriberNoa,
      oldMeterNo: dto.oldMeterNo || sub.meterNo,
      newMeterNo: dto.newMeterNo,
      removalReading: dto.removalReading,
      installReading: dto.installReading,
      changeDate: dto.changeDate as any,
      reason: dto.reason,
    });
    const saved = await this.changeRepo.save(change);

    // تحديث العداد في سجل المشترك
    sub.meterNo = dto.newMeterNo;
    await this.subRepo.save(sub);

    return { data: saved, message: `تم تغيير عداد المشترك ${dto.subscriberNoa}` };
  }

  async findAllMeterChanges(subscriberNoa?: number) {
    const qb = this.changeRepo.createQueryBuilder('c');
    if (subscriberNoa) qb.where('c.subscriberNoa = :noa', { noa: subscriberNoa });
    qb.orderBy('c.changeDate', 'DESC');
    const data = await qb.getMany();
    return { data };
  }

  // ══════════════════════════════════════════
  // التسويات (A_D_TRK)
  // ══════════════════════════════════════════

  async createAdjustment(dto: CreateReadingAdjustmentDto, userId?: number) {
    const sub = await this.subRepo.findOne({ where: { noa: dto.subscriberNoa } });
    if (!sub) throw new NotFoundException('المشترك غير موجود');

    const adjust = this.adjustRepo.create({
      subscriberId: sub.id,
      subscriberNoa: dto.subscriberNoa,
      cycleId: dto.cycleId,
      adjustmentType: dto.adjustmentType,
      oldValue: dto.oldValue,
      newValue: dto.newValue,
      difference: (dto.newValue || 0) - (dto.oldValue || 0),
      reason: dto.reason,
    });
    return { data: await this.adjustRepo.save(adjust), message: 'تم إنشاء التسوية' };
  }

  // ─── إحصائيات القراءات ───
  async getReadingStats() {
    const totalCycles = await this.cycleRepo.count();
    const openCycles = await this.cycleRepo.count({ where: { status: 0 } });
    const totalReadings = await this.readingRepo.count();
    const anomalies = await this.readingRepo.count({ where: { isAnomaly: true } });

    return { data: { totalCycles, openCycles, totalReadings, anomalies } };
  }
}
