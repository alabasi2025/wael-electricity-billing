// =============================================
// وحدة الموظفين الكاملة
// EMP1 + EMP2 + EMPAB1 + EMPAB2
// =============================================
import { Injectable, NotFoundException, Module, Controller,
  Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository, Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDateString, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// ═══════ ENTITIES ═══════

@Entity('emp1') export class EmployeeEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'varchar', length: 200 }) name: string;
  @Column({ type: 'date', nullable: true }) dates: Date;
  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true }) salary: number;
  @Column({ type: 'varchar', length: 100, nullable: true }) department: string;
  @Column({ type: 'varchar', length: 50, nullable: true }) phone: string;
  @Column({ type: 'varchar', length: 300, nullable: true }) address: string;
  @Column({ type: 'int', default: 1 }) status: number;
  @Column({ type: 'text', nullable: true }) notes: string;
  @OneToMany(() => AbsenceEntity, a => a.employee) absences: AbsenceEntity[];
  @OneToMany(() => EmpExtra1Entity, e => e.employee) extras1: EmpExtra1Entity[];
  @OneToMany(() => EmpExtra2Entity, e => e.employee) extras2: EmpExtra2Entity[];
}

@Entity('emp2') export class AbsenceEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'emp_id', type: 'int' }) empId: number;
  @Column({ type: 'date' }) dates: Date;
  @Column({ type: 'varchar', length: 300, nullable: true }) reason: string;
  @Column({ type: 'int', nullable: true }) duration: number;
  @ManyToOne(() => EmployeeEntity, e => e.absences) @JoinColumn({ name: 'emp_id' }) employee: EmployeeEntity;
}

@Entity('empab1') export class EmpExtra1Entity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'emp_id', type: 'int' }) empId: number;
  @Column({ type: 'varchar', length: 50, nullable: true }) type: string;
  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true }) amount: number;
  @Column({ type: 'date', nullable: true }) dates: Date;
  @Column({ type: 'text', nullable: true }) notes: string;
  @ManyToOne(() => EmployeeEntity, e => e.extras1) @JoinColumn({ name: 'emp_id' }) employee: EmployeeEntity;
}

@Entity('empab2') export class EmpExtra2Entity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'emp_id', type: 'int' }) empId: number;
  @Column({ type: 'varchar', length: 50, nullable: true }) type: string;
  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true }) amount: number;
  @Column({ type: 'date', nullable: true }) dates: Date;
  @Column({ type: 'text', nullable: true }) notes: string;
  @ManyToOne(() => EmployeeEntity, e => e.extras2) @JoinColumn({ name: 'emp_id' }) employee: EmployeeEntity;
}

// ═══════ DTOs ═══════

class CreateEmployeeDto {
  @ApiProperty({ example: 'أحمد محمود' }) @IsString() @IsNotEmpty() name: string;
  @ApiPropertyOptional({ example: '2026-01-15' }) @IsOptional() @IsDateString() dates?: string;
  @ApiPropertyOptional({ example: 750000 }) @IsOptional() @IsNumber() salary?: number;
  @ApiPropertyOptional({ example: 'قسم الكهرباء' }) @IsOptional() @IsString() department?: string;
  @ApiPropertyOptional({ example: '07701234567' }) @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional({ example: 'بغداد' }) @IsOptional() @IsString() address?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}
class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}

class CreateAbsenceDto {
  @ApiProperty() @IsInt() empId: number;
  @ApiProperty() @IsDateString() dates: string;
  @ApiPropertyOptional() @IsOptional() @IsString() reason?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() duration?: number;
}

class CreateEmpExtraDto {
  @ApiProperty() @IsInt() empId: number;
  @ApiPropertyOptional() @IsOptional() @IsString() type?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() amount?: number;
  @ApiPropertyOptional() @IsOptional() @IsDateString() dates?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

// ═══════ SERVICE ═══════

@Injectable() class EmployeesService {
  constructor(
    @InjectRepository(EmployeeEntity) private readonly empRepo: Repository<EmployeeEntity>,
    @InjectRepository(AbsenceEntity) private readonly absRepo: Repository<AbsenceEntity>,
    @InjectRepository(EmpExtra1Entity) private readonly extra1Repo: Repository<EmpExtra1Entity>,
    @InjectRepository(EmpExtra2Entity) private readonly extra2Repo: Repository<EmpExtra2Entity>,
  ) {}

  async create(dto: CreateEmployeeDto) { return { data: await this.empRepo.save(this.empRepo.create(dto)), message: 'تم إنشاء الموظف' }; }

  async findAll(pagination: PaginationDto) {
    const { skip, pageSize, search } = pagination;
    const qb = this.empRepo.createQueryBuilder('e');
    if (search) qb.where('e.name LIKE :s OR e.department LIKE :s', { s: `%${search}%` });
    qb.orderBy('e.id', 'ASC').skip(skip).take(pageSize);
    const [data, totalCount] = await qb.getManyAndCount();
    return { data, totalCount, page: pagination.page, pageSize };
  }

  async findOne(id: number) {
    const emp = await this.empRepo.findOne({ where: { id }, relations: ['absences', 'extras1', 'extras2'] });
    if (!emp) throw new NotFoundException('الموظف غير موجود');
    return { data: emp };
  }

  async update(id: number, dto: UpdateEmployeeDto) {
    const emp = await this.empRepo.findOne({ where: { id } });
    if (!emp) throw new NotFoundException('الموظف غير موجود');
    Object.assign(emp, dto); return { data: await this.empRepo.save(emp), message: 'تم التحديث' };
  }

  async remove(id: number) { await this.empRepo.delete(id); return { message: 'تم الحذف' }; }

  // غياب
  async createAbsence(dto: CreateAbsenceDto) { return { data: await this.absRepo.save(this.absRepo.create(dto)), message: 'تم التسجيل' }; }
  async getAbsences(empId: number) { return { data: await this.absRepo.find({ where: { empId }, order: { dates: 'DESC' } }) }; }
  async getAllAbsences(pagination: PaginationDto, date?: string) {
    const qb = this.absRepo.createQueryBuilder('a').leftJoinAndSelect('a.employee', 'emp');
    if (date) qb.where('a.dates = :date', { date });
    const [data, totalCount] = await qb.orderBy('a.dates', 'DESC').skip(pagination.skip).take(pagination.pageSize).getManyAndCount();
    return { data, totalCount };
  }

  // بيانات إضافية
  async createExtra(type: 1 | 2, dto: CreateEmpExtraDto) {
    const repo = type === 1 ? this.extra1Repo : this.extra2Repo;
    return { data: await repo.save(repo.create(dto)), message: 'تم الإنشاء' };
  }
  async getExtras(empId: number, type: 1 | 2) {
    const repo = type === 1 ? this.extra1Repo : this.extra2Repo;
    return { data: await repo.find({ where: { empId } }) };
  }

  // إحصائيات
  async getStats() {
    const total = await this.empRepo.count();
    const active = await this.empRepo.count({ where: { status: 1 } });
    const totalSalary = await this.empRepo.createQueryBuilder('e').select('COALESCE(SUM(e.salary),0)', 'total').where('e.status=1').getRawOne();
    return { data: { total, active, inactive: total - active, totalSalary: +totalSalary.total } };
  }
}

// ═══════ CONTROLLER ═══════

@ApiTags('employees') @ApiBearerAuth('JWT-auth') @UseGuards(JwtAuthGuard) @Controller('employees')
class EmployeesController {
  constructor(private readonly svc: EmployeesService) {}
  @Post() @ApiOperation({ summary: 'إضافة موظف (EMP1)' }) create(@Body() dto: CreateEmployeeDto) { return this.svc.create(dto); }
  @Get() @ApiOperation({ summary: 'قائمة الموظفين' }) findAll(@Query() p: PaginationDto) { return this.svc.findAll(p); }
  @Get('stats') @ApiOperation({ summary: 'إحصائيات الموظفين' }) getStats() { return this.svc.getStats(); }
  @Get('absences') @ApiOperation({ summary: 'كل سجلات الغياب (EMP2)' }) getAllAbs(@Query() p: PaginationDto, @Query('date') d?: string) { return this.svc.getAllAbsences(p, d); }
  @Get(':id') @ApiOperation({ summary: 'تفاصيل موظف' }) findOne(@Param('id', ParseIntPipe) id: number) { return this.svc.findOne(id); }
  @Put(':id') @ApiOperation({ summary: 'تحديث موظف' }) update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEmployeeDto) { return this.svc.update(id, dto); }
  @Delete(':id') @ApiOperation({ summary: 'حذف موظف' }) remove(@Param('id', ParseIntPipe) id: number) { return this.svc.remove(id); }
  @Post(':id/absences') @ApiOperation({ summary: 'تسجيل غياب' }) createAbs(@Body() dto: CreateAbsenceDto) { return this.svc.createAbsence(dto); }
  @Get(':id/absences') @ApiOperation({ summary: 'سجل غياب موظف' }) getAbs(@Param('id', ParseIntPipe) id: number) { return this.svc.getAbsences(id); }
  @Post(':id/extras/:type') @ApiOperation({ summary: 'بيانات إضافية (EMPAB1/EMPAB2)' }) createExtra(@Param('type', ParseIntPipe) type: number, @Body() dto: CreateEmpExtraDto) { return this.svc.createExtra(type as 1|2, dto); }
  @Get(':id/extras/:type') getExtras(@Param('id', ParseIntPipe) id: number, @Param('type', ParseIntPipe) type: number) { return this.svc.getExtras(id, type as 1|2); }
}

// ═══════ MODULE ═══════
@Module({
  imports: [TypeOrmModule.forFeature([EmployeeEntity, AbsenceEntity, EmpExtra1Entity, EmpExtra2Entity])],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}
