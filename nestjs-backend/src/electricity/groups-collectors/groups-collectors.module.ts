// =============================================
// وحدة المجموعات والمحصلين
// بديل: GRP + NOMK2
// =============================================
import { Injectable, NotFoundException, Module, Controller,
  Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository, Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

// ═══════ ENTITIES ═══════

@Entity('electricity_groups')
export class ElectricityGroupEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'int', unique: true }) nog: number;
  @Column({ type: 'varchar', length: 200 }) name: string;
  @Column({ type: 'int', default: 1 }) type: number;
  @Column({ type: 'varchar', length: 200, nullable: true }) area: string;
  @Column({ name: 'collector_id', type: 'int', nullable: true }) collectorId: number;
  @Column({ name: 'center_id', type: 'int', nullable: true }) centerId: number;
  @Column({ type: 'text', nullable: true }) notes: string;
  @Column({ type: 'int', default: 1 }) status: number;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}

@Entity('electricity_collectors')
export class ElectricityCollectorEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'int', unique: true, nullable: true }) nomk2: number;
  @Column({ type: 'varchar', length: 200 }) name: string;
  @Column({ type: 'varchar', length: 50, nullable: true }) mobile: string;
  @Column({ name: 'group_id', type: 'int', nullable: true }) groupId: number;
  @Column({ type: 'int', default: 1 }) status: number;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}

// ═══════ DTOs ═══════

class CreateGroupDto {
  @ApiProperty() @IsInt() nog: number;
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() type?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() area?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() collectorId?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() centerId?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

class CreateCollectorDto {
  @ApiPropertyOptional() @IsOptional() @IsInt() nomk2?: number;
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mobile?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() groupId?: number;
}

// ═══════ SERVICE ═══════

@Injectable()
export class GroupsCollectorsService {
  constructor(
    @InjectRepository(ElectricityGroupEntity) private readonly groupRepo: Repository<ElectricityGroupEntity>,
    @InjectRepository(ElectricityCollectorEntity) private readonly collectorRepo: Repository<ElectricityCollectorEntity>,
  ) {}

  // المجموعات
  async createGroup(dto: CreateGroupDto) {
    return { data: await this.groupRepo.save(this.groupRepo.create(dto)), message: 'تم إنشاء المجموعة' };
  }
  async findAllGroups() { return { data: await this.groupRepo.find({ order: { nog: 'ASC' } }) }; }
  async findOneGroup(id: number) {
    const g = await this.groupRepo.findOne({ where: { id } });
    if (!g) throw new NotFoundException('المجموعة غير موجودة');
    return { data: g };
  }
  async updateGroup(id: number, dto: Partial<CreateGroupDto>) {
    const g = await this.groupRepo.findOne({ where: { id } });
    if (!g) throw new NotFoundException('المجموعة غير موجودة');
    Object.assign(g, dto); return { data: await this.groupRepo.save(g), message: 'تم التحديث' };
  }
  async removeGroup(id: number) {
    const g = await this.groupRepo.findOne({ where: { id } });
    if (!g) throw new NotFoundException('المجموعة غير موجودة');
    await this.groupRepo.remove(g); return { message: 'تم الحذف' };
  }

  // المحصلين
  async createCollector(dto: CreateCollectorDto) {
    return { data: await this.collectorRepo.save(this.collectorRepo.create(dto)), message: 'تم إنشاء المحصل' };
  }
  async findAllCollectors() { return { data: await this.collectorRepo.find({ order: { name: 'ASC' } }) }; }
  async updateCollector(id: number, dto: Partial<CreateCollectorDto>) {
    const c = await this.collectorRepo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('المحصل غير موجود');
    Object.assign(c, dto); return { data: await this.collectorRepo.save(c), message: 'تم التحديث' };
  }
  async removeCollector(id: number) {
    const c = await this.collectorRepo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('المحصل غير موجود');
    await this.collectorRepo.remove(c); return { message: 'تم الحذف' };
  }

  async getGroupStats() {
    const groups = await this.groupRepo.count();
    const collectors = await this.collectorRepo.count();
    return { data: { groups, collectors } };
  }
}

// ═══════ CONTROLLER ═══════

@ApiTags('electricity/groups')
@ApiBearerAuth('JWT-auth') @UseGuards(JwtAuthGuard)
@Controller('electricity/groups')
export class GroupsCollectorsController {
  constructor(private readonly svc: GroupsCollectorsService) {}

  @Get('stats') @ApiOperation({ summary: 'إحصائيات المجموعات والمحصلين' })
  getStats() { return this.svc.getGroupStats(); }

  // المجموعات
  @Post() @ApiOperation({ summary: 'إنشاء مجموعة' })
  createGroup(@Body() dto: CreateGroupDto) { return this.svc.createGroup(dto); }
  @Get() @ApiOperation({ summary: 'قائمة المجموعات' })
  findAllGroups() { return this.svc.findAllGroups(); }
  @Get(':id') findOneGroup(@Param('id', ParseIntPipe) id: number) { return this.svc.findOneGroup(id); }
  @Put(':id') updateGroup(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateGroup(id, dto); }
  @Delete(':id') removeGroup(@Param('id', ParseIntPipe) id: number) { return this.svc.removeGroup(id); }

  // المحصلين
  @Post('collectors') @ApiOperation({ summary: 'إنشاء محصل' })
  createCollector(@Body() dto: CreateCollectorDto) { return this.svc.createCollector(dto); }
  @Get('collectors/list') @ApiOperation({ summary: 'قائمة المحصلين' })
  findAllCollectors() { return this.svc.findAllCollectors(); }
  @Put('collectors/:id') updateCollector(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateCollector(id, dto); }
  @Delete('collectors/:id') removeCollector(@Param('id', ParseIntPipe) id: number) { return this.svc.removeCollector(id); }
}

// ═══════ MODULE ═══════

@Module({
  imports: [TypeOrmModule.forFeature([ElectricityGroupEntity, ElectricityCollectorEntity])],
  controllers: [GroupsCollectorsController],
  providers: [GroupsCollectorsService],
  exports: [GroupsCollectorsService],
})
export class GroupsCollectorsModule {}
