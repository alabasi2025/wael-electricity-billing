// =============================================
// وحدة الإقفالات (AKFA + AKFAL) + الأمانات (AMANDHS) + الأعمال (AMLH)
// =============================================
import { Injectable, NotFoundException, BadRequestException, Module, Controller,
  Get, Post, Patch, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// ═══════ ENTITIES ═══════

@Entity('akfa') export class ClosingEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nom', type: 'int', nullable: true }) nom: number;
  @Column({ name: 'noy', type: 'int', nullable: true }) noy: number;
  @Column({ name: 'nod', type: 'varchar', length: 200, nullable: true }) nod: string;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'no_m', type: 'int', nullable: true }) noM: number;
  @Column({ name: 'year', type: 'int', nullable: true }) year: number;
  @Column({ name: 'status', type: 'int', default: 0 }) status: number;
  @Column({ name: 'type', type: 'varchar', length: 20, default: 'monthly' }) type: string;
}

@Entity('amandhs') export class DepositEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'namea', type: 'varchar', length: 200, nullable: true }) namea: string;
  @Column({ name: 'amount', type: 'decimal', precision: 18, scale: 2, default: 0 }) amount: number;
  @Column({ name: 'notes', type: 'text', nullable: true }) notes: string;
  @Column({ name: 'status', type: 'int', default: 1 }) status: number;
}

@Entity('amlh') export class WorkEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'name', type: 'varchar', length: 200 }) name: string;
  @Column({ name: 'type', type: 'int', nullable: true }) type: number;
  @Column({ name: 'amount', type: 'decimal', precision: 18, scale: 2, nullable: true }) amount: number;
  @Column({ name: 'notes', type: 'text', nullable: true }) notes: string;
}

// ═══════ SERVICE ═══════

@Injectable() class ClosingDepositsService {
  constructor(
    @InjectRepository(ClosingEntity) private readonly closingRepo: Repository<ClosingEntity>,
    @InjectRepository(DepositEntity) private readonly depositRepo: Repository<DepositEntity>,
    @InjectRepository(WorkEntity) private readonly workRepo: Repository<WorkEntity>,
  ) {}

  // الإقفالات
  async createMonthlyClosing(month: number, year: number) {
    const exists = await this.closingRepo.findOne({ where: { noM: month, year, type: 'monthly' } });
    if (exists) throw new BadRequestException(`الشهر ${month}/${year} مُقفل مسبقاً`);
    const closing = this.closingRepo.create({ nom: month, noM: month, year, dates: new Date(), status: 1, type: 'monthly', nod: `إقفال شهر ${month}/${year}` });
    return { data: await this.closingRepo.save(closing), message: `تم إقفال شهر ${month}/${year}` };
  }

  async createYearlyClosing(year: number) {
    const closing = this.closingRepo.create({ noy: year, year, dates: new Date(), status: 1, type: 'yearly', nod: `إقفال سنة ${year}` });
    return { data: await this.closingRepo.save(closing), message: `تم إقفال سنة ${year}` };
  }

  async findAllClosings(pagination: PaginationDto) {
    const [data, totalCount] = await this.closingRepo.findAndCount({ order: { id: 'DESC' }, skip: pagination.skip, take: pagination.pageSize });
    return { data, totalCount, page: pagination.page, pageSize: pagination.pageSize };
  }

  async reverseClosing(id: number) {
    const c = await this.closingRepo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('الإقفال غير موجود');
    c.status = 0; await this.closingRepo.save(c);
    return { message: 'تم عكس الإقفال' };
  }

  // الأمانات
  async createDeposit(dto: any) { return { data: await this.depositRepo.save(this.depositRepo.create(dto)), message: 'تم إنشاء الأمانة' }; }
  async findAllDeposits(pagination: PaginationDto) {
    const [data, totalCount] = await this.depositRepo.findAndCount({ order: { id: 'DESC' }, skip: pagination.skip, take: pagination.pageSize });
    return { data, totalCount };
  }
  async returnDeposit(id: number) {
    const d = await this.depositRepo.findOne({ where: { id } });
    if (!d) throw new NotFoundException('الأمانة غير موجودة');
    d.status = 0; await this.depositRepo.save(d);
    return { message: 'تم إرجاع الأمانة' };
  }

  // الأعمال
  async createWork(dto: any) { return { data: await this.workRepo.save(this.workRepo.create(dto)), message: 'تم الإنشاء' }; }
  async findAllWorks() { return { data: await this.workRepo.find({ order: { id: 'ASC' } }) }; }
}

// ═══════ CONTROLLER ═══════

@ApiTags('closing') @ApiBearerAuth('JWT-auth') @UseGuards(JwtAuthGuard) @Controller('closing')
class ClosingController {
  constructor(private readonly svc: ClosingDepositsService) {}
  @Post('monthly') @ApiOperation({ summary: 'إقفال شهري (AKFA)' }) createMonthly(@Body() b: any) { return this.svc.createMonthlyClosing(b.month, b.year); }
  @Post('yearly') @ApiOperation({ summary: 'إقفال سنوي (AKFAL)' }) createYearly(@Body() b: any) { return this.svc.createYearlyClosing(b.year); }
  @Get() @ApiOperation({ summary: 'قائمة الإقفالات' }) findAll(@Query() p: PaginationDto) { return this.svc.findAllClosings(p); }
  @Patch(':id/reverse') @ApiOperation({ summary: 'عكس إقفال' }) reverse(@Param('id', ParseIntPipe) id: number) { return this.svc.reverseClosing(id); }
}

@ApiTags('deposits') @ApiBearerAuth('JWT-auth') @UseGuards(JwtAuthGuard) @Controller('deposits')
class DepositsController {
  constructor(private readonly svc: ClosingDepositsService) {}
  @Post() @ApiOperation({ summary: 'إنشاء أمانة (AMANDHS)' }) create(@Body() dto: any) { return this.svc.createDeposit(dto); }
  @Get() @ApiOperation({ summary: 'قائمة الأمانات' }) findAll(@Query() p: PaginationDto) { return this.svc.findAllDeposits(p); }
  @Patch(':id/return') @ApiOperation({ summary: 'إرجاع أمانة' }) returnDep(@Param('id', ParseIntPipe) id: number) { return this.svc.returnDeposit(id); }
}

@ApiTags('works') @ApiBearerAuth('JWT-auth') @UseGuards(JwtAuthGuard) @Controller('works')
class WorksController {
  constructor(private readonly svc: ClosingDepositsService) {}
  @Post() @ApiOperation({ summary: 'إنشاء عمل (AMLH)' }) create(@Body() dto: any) { return this.svc.createWork(dto); }
  @Get() @ApiOperation({ summary: 'قائمة الأعمال' }) findAll() { return this.svc.findAllWorks(); }
}

// ═══════ MODULE ═══════
@Module({
  imports: [TypeOrmModule.forFeature([ClosingEntity, DepositEntity, WorkEntity])],
  controllers: [ClosingController, DepositsController, WorksController],
  providers: [ClosingDepositsService],
  exports: [ClosingDepositsService],
})
export class ClosingDepositsModule {}
