// =============================================
// وحدة القيود المحاسبية الكاملة
// DATAK + DATAKSNF + KDAY
// =============================================
import { Injectable, NotFoundException, BadRequestException, Logger, Module, Controller,
  Get, Post, Put, Delete, Patch, Body, Param, Query, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository, Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsOptional, IsNumber, IsDateString, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// ═══════ ENTITIES ═══════

@Entity('datak')
export class JournalEntryFullEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'datemo', type: 'date' }) datemo: Date;
  @Column({ name: 'namea', type: 'varchar', length: 500, nullable: true }) namea: string;
  @Column({ name: 'debit', type: 'decimal', precision: 18, scale: 2, default: 0 }) debit: number;
  @Column({ name: 'credit', type: 'decimal', precision: 18, scale: 2, default: 0 }) credit: number;
  @Column({ name: 'no_m', type: 'int', nullable: true }) noM: number;
  @Column({ name: 'year', type: 'int', nullable: true }) year: number;
  @Column({ name: 'notes', type: 'text', nullable: true }) notes: string;
  @Column({ name: 'user_id', type: 'int', nullable: true }) userId: number;
  @Column({ name: 'posted', type: 'int', default: 0 }) posted: number;
  @Column({ name: 'entry_ref', type: 'int', nullable: true }) entryRef: number;
  @CreateDateColumn({ name: 'entry_date' }) entryDate: Date;
}

@Entity('dataksnf')
export class EntryCategoryEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'noz', type: 'int', nullable: true }) noz: number;
  @Column({ name: 'name', type: 'varchar', length: 200, nullable: true }) name: string;
  @Column({ name: 'datek', type: 'date', nullable: true }) datek: Date;
}

@Entity('kday')
export class DailyRecordEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'kdate', type: 'date' }) kdate: Date;
  @Column({ name: 'amount', type: 'decimal', precision: 18, scale: 2, nullable: true }) amount: number;
  @Column({ name: 'type', type: 'varchar', length: 50, nullable: true }) type: string;
  @Column({ name: 'notes', type: 'text', nullable: true }) notes: string;
}

// ═══════ DTOs ═══════

class JournalLineDto {
  @ApiProperty({ example: 101 }) @IsInt() accountNo: number;
  @ApiPropertyOptional() @IsOptional() @IsString() accountName?: string;
  @ApiProperty({ example: 500000 }) @IsNumber() debit: number;
  @ApiProperty({ example: 0 }) @IsNumber() credit: number;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

class CreateJournalEntryDto {
  @ApiProperty({ example: '2026-04-07' }) @IsDateString() datemo: string;
  @ApiProperty({ example: 'تحصيل فواتير كهرباء' }) @IsString() @IsNotEmpty() namea: string;
  @ApiProperty({ example: 4 }) @IsInt() noM: number;
  @ApiProperty({ example: 2026 }) @IsInt() year: number;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
  @ApiProperty({ type: [JournalLineDto] }) @IsArray() @ValidateNested({ each: true }) @Type(() => JournalLineDto) lines: JournalLineDto[];
}

class CreateCategoryDto {
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() noz?: number;
}

// ═══════ SERVICE ═══════

@Injectable()
class JournalService {
  private readonly logger = new Logger(JournalService.name);
  private readonly maxInt32 = 2147483647;
  constructor(
    @InjectRepository(JournalEntryFullEntity) private readonly entryRepo: Repository<JournalEntryFullEntity>,
    @InjectRepository(EntryCategoryEntity) private readonly catRepo: Repository<EntryCategoryEntity>,
    @InjectRepository(DailyRecordEntity) private readonly dailyRepo: Repository<DailyRecordEntity>,
  ) {}

  private async getNextEntryRef(): Promise<number> {
    const raw = await this.entryRepo
      .createQueryBuilder('e')
      .select('COALESCE(MAX(e.entryRef), 0)', 'maxRef')
      .addSelect('COALESCE(MAX(e.id), 0)', 'maxId')
      .getRawOne<{ maxRef?: string | number; maxId?: string | number }>();

    const maxRef = Number(raw?.maxRef ?? 0);
    const maxId = Number(raw?.maxId ?? 0);
    const nextRef = Math.max(maxRef, maxId) + 1;

    if (!Number.isFinite(nextRef) || nextRef > this.maxInt32) {
      throw new BadRequestException('تعذر إنشاء مرجع قيد جديد (تجاوز الحد المسموح).');
    }

    return nextRef;
  }

  async createEntry(dto: CreateJournalEntryDto, userId: number) {
    const totalDebit = dto.lines.reduce((s, l) => s + l.debit, 0);
    const totalCredit = dto.lines.reduce((s, l) => s + l.credit, 0);
    if (Math.abs(totalDebit - totalCredit) > 0.01) throw new BadRequestException(`القيد غير متوازن: مدين=${totalDebit} دائن=${totalCredit}`);

    // حفظ سطر لكل حساب
    const entryRef = await this.getNextEntryRef(); // مرجع ربط أسطر القيد ضمن حدود int
    const saved = [];
    for (const line of dto.lines) {
      const entity = this.entryRepo.create({
        noa: line.accountNo, datemo: dto.datemo as any, namea: dto.namea || line.accountName,
        debit: line.debit, credit: line.credit, noM: dto.noM, year: dto.year,
        notes: line.notes || dto.notes, userId, posted: 0, entryRef,
      });
      saved.push(await this.entryRepo.save(entity));
    }
    this.logger.log(`قيد جديد: ${dto.namea} - ${totalDebit} د.ع`);
    return { data: { entryRef, lines: saved, totalDebit, totalCredit }, message: 'تم إنشاء القيد' };
  }

  async findAllEntries(pagination: PaginationDto, year?: number, month?: number) {
    const { page, pageSize, skip, search, sortBy, sortOrder } = pagination;
    const qb = this.entryRepo.createQueryBuilder('e');
    if (year) qb.andWhere('e.year = :year', { year });
    if (month) qb.andWhere('e.no_m = :month', { month });
    if (search) qb.andWhere('(e.namea LIKE :s OR e.notes LIKE :s)', { s: `%${search}%` });
    qb.orderBy(`e.${sortBy || 'id'}`, sortOrder || 'DESC').skip(skip).take(pageSize);
    const [data, totalCount] = await qb.getManyAndCount();
    return { data, totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize) };
  }

  async findOneEntry(id: number) {
    const entry = await this.entryRepo.findOne({ where: { id } });
    if (!entry) throw new NotFoundException(`القيد غير موجود`);
    // جلب كل أسطر نفس المرجع
    const lines = entry.entryRef ? await this.entryRepo.find({ where: { entryRef: entry.entryRef } }) : [entry];
    return { data: { entry, lines } };
  }

  async updateEntry(id: number, dto: CreateJournalEntryDto, userId: number) {
    const target = await this.entryRepo.findOne({ where: { id } });
    if (!target) throw new NotFoundException(`القيد غير موجود`);

    const existingLines = target.entryRef
      ? await this.entryRepo.find({ where: { entryRef: target.entryRef } })
      : [target];

    if (existingLines.some((line) => line.posted === 1)) {
      throw new BadRequestException('لا يمكن تعديل قيد مرحّل');
    }

    const totalDebit = dto.lines.reduce((s, l) => s + l.debit, 0);
    const totalCredit = dto.lines.reduce((s, l) => s + l.credit, 0);
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      throw new BadRequestException(`القيد غير متوازن: مدين=${totalDebit} دائن=${totalCredit}`);
    }

    const entryRef = target.entryRef || target.id;
    if (target.entryRef) {
      await this.entryRepo.delete({ entryRef: target.entryRef });
    } else {
      await this.entryRepo.delete({ id: target.id });
    }

    const saved = [];
    for (const line of dto.lines) {
      const entity = this.entryRepo.create({
        noa: line.accountNo,
        datemo: dto.datemo as any,
        namea: dto.namea || line.accountName,
        debit: line.debit,
        credit: line.credit,
        noM: dto.noM,
        year: dto.year,
        notes: line.notes || dto.notes,
        userId,
        posted: 0,
        entryRef,
      });
      saved.push(await this.entryRepo.save(entity));
    }

    this.logger.log(`تم تحديث القيد #${id}`);
    return { data: { entryRef, lines: saved, totalDebit, totalCredit }, message: 'تم تحديث القيد' };
  }

  async postEntry(id: number) {
    const entry = await this.entryRepo.findOne({ where: { id } });
    if (!entry) throw new NotFoundException(`القيد غير موجود`);
    if (entry.entryRef) {
      await this.entryRepo.update({ entryRef: entry.entryRef }, { posted: 1 });
    } else {
      entry.posted = 1;
      await this.entryRepo.save(entry);
    }
    return { message: 'تم ترحيل القيد' };
  }

  async reverseEntry(id: number, userId: number) {
    const entry = await this.entryRepo.findOne({ where: { id } });
    if (!entry) throw new NotFoundException(`القيد غير موجود`);
    const lines = entry.entryRef ? await this.entryRepo.find({ where: { entryRef: entry.entryRef } }) : [entry];
    const reverseRef = await this.getNextEntryRef();
    for (const line of lines) {
      await this.entryRepo.save(this.entryRepo.create({
        noa: line.noa, datemo: new Date(), namea: `عكس: ${line.namea}`,
        debit: +line.credit, credit: +line.debit, noM: line.noM, year: line.year,
        notes: `عكس قيد #${line.id}`, userId, posted: 0, entryRef: reverseRef,
      }));
    }
    return { message: 'تم عكس القيد' };
  }

  async deleteEntry(id: number) {
    const entry = await this.entryRepo.findOne({ where: { id } });
    if (!entry) throw new NotFoundException(`القيد غير موجود`);
    if (entry.posted === 1) throw new BadRequestException('لا يمكن حذف قيد مرحّل');
    if (entry.entryRef) await this.entryRepo.delete({ entryRef: entry.entryRef });
    else await this.entryRepo.remove(entry);
    return { message: 'تم حذف القيد' };
  }

  // أصناف القيود
  async getCategories() { return { data: await this.catRepo.find({ order: { id: 'ASC' } }) }; }
  async createCategory(dto: CreateCategoryDto) {
    return { data: await this.catRepo.save(this.catRepo.create({ ...dto, datek: new Date() })), message: 'تم إنشاء الصنف' };
  }
  async deleteCategory(id: number) { await this.catRepo.delete(id); return { message: 'تم الحذف' }; }

  // اليوميات
  async getDailyRecords(date: string) {
    return { data: await this.dailyRepo.find({ where: { kdate: date as any }, order: { id: 'ASC' } }) };
  }
}

// ═══════ CONTROLLER ═══════

@ApiTags('journal')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('journal')
class JournalController {
  constructor(private readonly svc: JournalService) {}

  @Post() @ApiOperation({ summary: 'إنشاء قيد محاسبي جديد (متعدد الأسطر)' })
  create(@Body() dto: CreateJournalEntryDto, @Request() req) { return this.svc.createEntry(dto, req.user.userId); }

  @Get() @ApiOperation({ summary: 'عرض القيود المحاسبية' })
  findAll(@Query() p: PaginationDto, @Query('year') year?: number, @Query('month') month?: number) {
    return this.svc.findAllEntries(p, year, month);
  }

  @Get('categories') @ApiOperation({ summary: 'أصناف القيود (DATAKSNF)' }) getCategories() { return this.svc.getCategories(); }
  @Post('categories') @ApiOperation({ summary: 'إنشاء صنف قيد' }) createCat(@Body() dto: CreateCategoryDto) { return this.svc.createCategory(dto); }
  @Delete('categories/:id') @ApiOperation({ summary: 'حذف صنف قيد' }) deleteCat(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteCategory(id); }
  @Get('daily/:date') @ApiOperation({ summary: 'يوميات تاريخ معين (KDAY)' }) getDaily(@Param('date') date: string) { return this.svc.getDailyRecords(date); }

  @Get(':id') @ApiOperation({ summary: 'تفاصيل قيد بكل أسطره' }) findOne(@Param('id', ParseIntPipe) id: number) { return this.svc.findOneEntry(id); }
  @Put(':id') @ApiOperation({ summary: 'تحديث قيد بكل أسطره' }) update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateJournalEntryDto, @Request() req) { return this.svc.updateEntry(id, dto, req.user.userId); }
  @Patch(':id/post') @ApiOperation({ summary: 'ترحيل قيد' }) post(@Param('id', ParseIntPipe) id: number) { return this.svc.postEntry(id); }
  @Patch(':id/reverse') @ApiOperation({ summary: 'عكس قيد' }) reverse(@Param('id', ParseIntPipe) id: number, @Request() req) { return this.svc.reverseEntry(id, req.user.userId); }
  @Delete(':id') @ApiOperation({ summary: 'حذف قيد (غير مرحّل فقط)' }) remove(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteEntry(id); }
}

// ═══════ MODULE ═══════

@Module({
  imports: [TypeOrmModule.forFeature([JournalEntryFullEntity, EntryCategoryEntity, DailyRecordEntity])],
  controllers: [JournalController],
  providers: [JournalService],
  exports: [JournalService],
})
export class JournalModule {}
