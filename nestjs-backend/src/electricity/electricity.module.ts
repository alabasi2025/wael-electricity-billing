// =============================================
// وحدة الكهرباء الكاملة
// MZ + TRKB + MOLDAT + MOLDATS + MRCZE + HSMMSH
// =============================================
import { Injectable, NotFoundException, Module, Controller,
  Get, Post, Put, Delete, Patch, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDateString, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// ═══════ ENTITIES ═══════

@Entity('mz') export class MeterEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'meter_number', type: 'varchar', length: 50, nullable: true }) meterNumber: string;
  @Column({ name: 'subscriber_name', type: 'varchar', length: 200, nullable: true }) subscriberName: string;
  @Column({ type: 'varchar', length: 300, nullable: true }) location: string;
  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true }) reading: number;
  @Column({ name: 'prev_reading', type: 'decimal', precision: 18, scale: 2, nullable: true }) prevReading: number;
  @Column({ name: 'last_read_date', type: 'date', nullable: true }) lastReadDate: Date;
  @Column({ type: 'int', default: 1 }) status: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
}

@Entity('trkb') export class InstallationEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ type: 'date', nullable: true }) dates: Date;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true }) amount: number;
  @Column({ type: 'int', default: 1 }) status: number;
  @Column({ type: 'text', nullable: true }) notes: string;
  @Column({ name: 'subscriber_name', type: 'varchar', length: 200, nullable: true }) subscriberName: string;
  @Column({ name: 'meter_id', type: 'int', nullable: true }) meterId: number;
}

@Entity('moldat') export class GeneratorEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'varchar', length: 200 }) name: string;
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true }) capacity: number;
  @Column({ type: 'varchar', length: 300, nullable: true }) location: string;
  @Column({ type: 'int', default: 1 }) status: number;
  @Column({ type: 'text', nullable: true }) notes: string;
  @Column({ name: 'fuel_consumption', type: 'decimal', precision: 10, scale: 2, nullable: true }) fuelConsumption: number;
  @Column({ name: 'working_hours', type: 'decimal', precision: 10, scale: 2, nullable: true }) workingHours: number;
}

@Entity('moldats') export class GeneratorScheduleEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'varchar', length: 200, nullable: true }) name: string;
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true }) capacity: number;
  @Column({ type: 'varchar', length: 300, nullable: true }) location: string;
  @Column({ type: 'int', default: 1 }) status: number;
  @Column({ type: 'text', nullable: true }) notes: string;
}

@Entity('mrcze') export class CenterEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'varchar', length: 200 }) name: string;
  @Column({ type: 'varchar', length: 300, nullable: true }) location: string;
  @Column({ type: 'varchar', length: 50, nullable: true }) type: string;
  @Column({ type: 'int', default: 1 }) status: number;
}

@Entity('hsmmsh') export class SubscriberDiscountEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'subscriber_id', type: 'int', nullable: true }) subscriberId: number;
  @Column({ type: 'date', nullable: true }) dates: Date;
  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true }) amount: number;
  @Column({ type: 'varchar', length: 300, nullable: true }) reason: string;
  @Column({ type: 'text', nullable: true }) notes: string;
}

// ═══════ SERVICE ═══════

@Injectable() class ElectricityService {
  constructor(
    @InjectRepository(MeterEntity) private readonly meterRepo: Repository<MeterEntity>,
    @InjectRepository(InstallationEntity) private readonly installRepo: Repository<InstallationEntity>,
    @InjectRepository(GeneratorEntity) private readonly genRepo: Repository<GeneratorEntity>,
    @InjectRepository(GeneratorScheduleEntity) private readonly genSchedRepo: Repository<GeneratorScheduleEntity>,
    @InjectRepository(CenterEntity) private readonly centerRepo: Repository<CenterEntity>,
    @InjectRepository(SubscriberDiscountEntity) private readonly discountRepo: Repository<SubscriberDiscountEntity>,
  ) {}

  // العدادات
  async createMeter(dto: any) { return { data: await this.meterRepo.save(this.meterRepo.create(dto)), message: 'تم إنشاء العداد' }; }
  async findAllMeters(p: PaginationDto) {
    const qb = this.meterRepo.createQueryBuilder('m');
    if (p.search) qb.where('m.subscriberName LIKE :s OR m.meterNumber LIKE :s', { s: `%${p.search}%` });
    qb.orderBy('m.id', 'ASC').skip(p.skip).take(p.pageSize);
    const [data, tc] = await qb.getManyAndCount();
    return { data, totalCount: tc, page: p.page, pageSize: p.pageSize };
  }
  async findOneMeter(id: number) { const m = await this.meterRepo.findOne({ where: { id } }); if (!m) throw new NotFoundException('العداد غير موجود'); return { data: m }; }
  async updateMeter(id: number, dto: any) { const m = await this.meterRepo.findOne({ where: { id } }); if (!m) throw new NotFoundException('العداد غير موجود'); Object.assign(m, dto); return { data: await this.meterRepo.save(m) }; }
  async recordReading(id: number, reading: number) {
    const m = await this.meterRepo.findOne({ where: { id } }); if (!m) throw new NotFoundException('العداد غير موجود');
    m.prevReading = m.reading; m.reading = reading; m.lastReadDate = new Date();
    const consumption = reading - (+m.prevReading || 0);
    await this.meterRepo.save(m);
    return { data: { ...m, consumption }, message: `تم تسجيل القراءة. الاستهلاك: ${consumption}` };
  }

  // التركيبات
  async createInstall(dto: any) { return { data: await this.installRepo.save(this.installRepo.create(dto)), message: 'تم' }; }
  async findAllInstalls(p: PaginationDto) { const [data, tc] = await this.installRepo.findAndCount({ order: { id: 'DESC' }, skip: p.skip, take: p.pageSize }); return { data, totalCount: tc }; }
  async updateInstall(id: number, dto: any) { const e = await this.installRepo.findOne({ where: { id } }); if (!e) throw new NotFoundException('غير موجود'); Object.assign(e, dto); return { data: await this.installRepo.save(e) }; }

  // المولدات
  async createGen(dto: any) { return { data: await this.genRepo.save(this.genRepo.create(dto)), message: 'تم' }; }
  async findAllGens(p: PaginationDto) { const [data, tc] = await this.genRepo.findAndCount({ order: { id: 'ASC' }, skip: p.skip, take: p.pageSize }); return { data, totalCount: tc }; }
  async updateGen(id: number, dto: any) { const e = await this.genRepo.findOne({ where: { id } }); if (!e) throw new NotFoundException('غير موجود'); Object.assign(e, dto); return { data: await this.genRepo.save(e) }; }

  // جداول المولدات
  async createGenSched(dto: any) { return { data: await this.genSchedRepo.save(this.genSchedRepo.create(dto)) }; }
  async findAllGenScheds() { return { data: await this.genSchedRepo.find() }; }

  // المراكز
  async createCenter(dto: any) { return { data: await this.centerRepo.save(this.centerRepo.create(dto)), message: 'تم' }; }
  async findAllCenters() { return { data: await this.centerRepo.find({ order: { id: 'ASC' } }) }; }
  async updateCenter(id: number, dto: any) { const e = await this.centerRepo.findOne({ where: { id } }); if (!e) throw new NotFoundException('غير موجود'); Object.assign(e, dto); return { data: await this.centerRepo.save(e) }; }

  // حسم المشتركين
  async createDiscount(dto: any) { return { data: await this.discountRepo.save(this.discountRepo.create(dto)), message: 'تم' }; }
  async findAllDiscounts(p: PaginationDto) { const [data, tc] = await this.discountRepo.findAndCount({ order: { id: 'DESC' }, skip: p.skip, take: p.pageSize }); return { data, totalCount: tc }; }

  // إحصائيات
  async getStats() {
    const meters = await this.meterRepo.count(); const activeMeters = await this.meterRepo.count({ where: { status: 1 } });
    const installs = await this.installRepo.count(); const gens = await this.genRepo.count();
    const centers = await this.centerRepo.count();
    return { data: { meters, activeMeters, installations: installs, generators: gens, centers } };
  }
}

// ═══════ CONTROLLER ═══════

@ApiTags('electricity') @ApiBearerAuth('JWT-auth') @UseGuards(JwtAuthGuard) @Controller('electricity')
class ElectricityController {
  constructor(private readonly svc: ElectricityService) {}
  @Get('stats') @ApiOperation({ summary: 'إحصائيات الكهرباء' }) getStats() { return this.svc.getStats(); }
  // العدادات
  @Post('meters') @ApiOperation({ summary: 'إنشاء عداد (MZ)' }) createMeter(@Body() dto: any) { return this.svc.createMeter(dto); }
  @Get('meters') @ApiOperation({ summary: 'قائمة العدادات' }) findAllMeters(@Query() p: PaginationDto) { return this.svc.findAllMeters(p); }
  @Get('meters/:id') findOneMeter(@Param('id', ParseIntPipe) id: number) { return this.svc.findOneMeter(id); }
  @Put('meters/:id') @ApiOperation({ summary: 'تحديث عداد' }) updateMeter(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateMeter(id, dto); }
  @Patch('meters/:id/reading') @ApiOperation({ summary: 'تسجيل قراءة عداد' }) recordReading(@Param('id', ParseIntPipe) id: number, @Body('reading') reading: number) { return this.svc.recordReading(id, reading); }
  // التركيبات
  @Post('installations') @ApiOperation({ summary: 'إنشاء تركيب (TRKB)' }) createInstall(@Body() dto: any) { return this.svc.createInstall(dto); }
  @Get('installations') @ApiOperation({ summary: 'قائمة التركيبات' }) findAllInstalls(@Query() p: PaginationDto) { return this.svc.findAllInstalls(p); }
  @Put('installations/:id') updateInstall(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateInstall(id, dto); }
  // المولدات
  @Post('generators') @ApiOperation({ summary: 'إنشاء مولد (MOLDAT)' }) createGen(@Body() dto: any) { return this.svc.createGen(dto); }
  @Get('generators') @ApiOperation({ summary: 'قائمة المولدات' }) findAllGens(@Query() p: PaginationDto) { return this.svc.findAllGens(p); }
  @Put('generators/:id') updateGen(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateGen(id, dto); }
  // جداول المولدات
  @Post('generator-schedules') @ApiOperation({ summary: 'جدول مولد (MOLDATS)' }) createGenSched(@Body() dto: any) { return this.svc.createGenSched(dto); }
  @Get('generator-schedules') findAllGenScheds() { return this.svc.findAllGenScheds(); }
  // المراكز
  @Post('centers') @ApiOperation({ summary: 'إنشاء مركز (MRCZE)' }) createCenter(@Body() dto: any) { return this.svc.createCenter(dto); }
  @Get('centers') @ApiOperation({ summary: 'قائمة المراكز' }) findAllCenters() { return this.svc.findAllCenters(); }
  @Put('centers/:id') updateCenter(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateCenter(id, dto); }
  // حسم المشتركين
  @Post('discounts') @ApiOperation({ summary: 'حسم مشترك (HSMMSH)' }) createDiscount(@Body() dto: any) { return this.svc.createDiscount(dto); }
  @Get('discounts') @ApiOperation({ summary: 'قائمة الحسومات' }) findAllDiscounts(@Query() p: PaginationDto) { return this.svc.findAllDiscounts(p); }
}

@Module({
  imports: [TypeOrmModule.forFeature([MeterEntity, InstallationEntity, GeneratorEntity, GeneratorScheduleEntity, CenterEntity, SubscriberDiscountEntity])],
  controllers: [ElectricityController], providers: [ElectricityService], exports: [ElectricityService],
})
export class ElectricityModule {}
