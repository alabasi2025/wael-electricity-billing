// =============================================
// خدمة + متحكم + وحدة الحسابات
// =============================================
import { Injectable, NotFoundException, ConflictException, Logger, Module, Controller,
  Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChartOfAccountEntity, SubAccountEntity, AccountDetailEntity, GroupEntity } from './entities/account.entity';
import { CreateChartAccountDto, UpdateChartAccountDto, CreateSubAccountDto, UpdateSubAccountDto,
  CreateAccountDetailDto, UpdateAccountDetailDto, CreateGroupDto, UpdateGroupDto, SubAccountQueryDto } from './dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// ═══════════════════════════════════════════
// SERVICE
// ═══════════════════════════════════════════
@Injectable()
export class AccountsService {
  private readonly logger = new Logger(AccountsService.name);
  constructor(
    @InjectRepository(ChartOfAccountEntity) private readonly chartRepo: Repository<ChartOfAccountEntity>,
    @InjectRepository(SubAccountEntity) private readonly subRepo: Repository<SubAccountEntity>,
    @InjectRepository(AccountDetailEntity) private readonly detailRepo: Repository<AccountDetailEntity>,
    @InjectRepository(GroupEntity) private readonly groupRepo: Repository<GroupEntity>,
  ) {}

  // ─── دليل الحسابات CRUD ───
  async createChart(dto: CreateChartAccountDto) {
    const exists = await this.chartRepo.findOne({ where: { noA: dto.noA } });
    if (exists) throw new ConflictException(`الحساب رقم ${dto.noA} موجود مسبقاً`);
    const entity = this.chartRepo.create(dto);
    return { data: await this.chartRepo.save(entity), message: 'تم إنشاء الحساب' };
  }

  async findAllChart(pagination: PaginationDto) {
    const { page, pageSize, skip, search, sortBy, sortOrder } = pagination;
    const qb = this.chartRepo.createQueryBuilder('c').leftJoinAndSelect('c.subAccounts', 'sub');
    if (search) qb.where('c.nameA LIKE :s OR CAST(c.noA AS TEXT) LIKE :s', { s: `%${search}%` });
    qb.orderBy(`c.${sortBy || 'noA'}`, sortOrder || 'ASC').skip(skip).take(pageSize);
    const [data, totalCount] = await qb.getManyAndCount();
    return { data, totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize) };
  }

  async findOneChart(noA: number) {
    const account = await this.chartRepo.findOne({ where: { noA }, relations: ['subAccounts'] });
    if (!account) throw new NotFoundException(`الحساب ${noA} غير موجود`);
    return { data: account };
  }

  async updateChart(noA: number, dto: UpdateChartAccountDto) {
    const account = await this.chartRepo.findOne({ where: { noA } });
    if (!account) throw new NotFoundException(`الحساب ${noA} غير موجود`);
    Object.assign(account, dto);
    return { data: await this.chartRepo.save(account), message: 'تم تحديث الحساب' };
  }

  async removeChart(noA: number) {
    const account = await this.chartRepo.findOne({ where: { noA } });
    if (!account) throw new NotFoundException(`الحساب ${noA} غير موجود`);
    await this.chartRepo.remove(account);
    return { message: `تم حذف الحساب ${noA}` };
  }

  async getAccountTree() {
    const charts = await this.chartRepo.find({ relations: ['subAccounts'], order: { noA: 'ASC' } });
    return { data: charts, message: 'شجرة الحسابات' };
  }

  // ─── الحسابات الفرعية CRUD ───
  async createSub(dto: CreateSubAccountDto) {
    const exists = await this.subRepo.findOne({ where: { noa: dto.noa } });
    if (exists) throw new ConflictException(`الحساب الفرعي ${dto.noa} موجود`);
    return { data: await this.subRepo.save(this.subRepo.create(dto)), message: 'تم إنشاء الحساب الفرعي' };
  }

  async findAllSub(pagination: SubAccountQueryDto) {
    const { page, pageSize, skip, search, sortBy, sortOrder, typea } = pagination;
    const qb = this.subRepo.createQueryBuilder('s').leftJoinAndSelect('s.parentAccount', 'parent');
    if (typea !== undefined) qb.where('s.typea = :typea', { typea });
    if (search) qb.andWhere('(s.namea LIKE :s OR CAST(s.noa AS TEXT) LIKE :s)', { s: `%${search}%` });
    qb.orderBy(`s.${sortBy || 'noa'}`, sortOrder || 'ASC').skip(skip).take(pageSize);
    const [data, totalCount] = await qb.getManyAndCount();
    return { data, totalCount, page, pageSize, totalPages: Math.ceil(totalCount / pageSize) };
  }

  async findOneSub(noa: number) {
    const acc = await this.subRepo.findOne({ where: { noa }, relations: ['parentAccount', 'details'] });
    if (!acc) throw new NotFoundException(`الحساب الفرعي ${noa} غير موجود`);
    return { data: acc };
  }

  async updateSub(noa: number, dto: UpdateSubAccountDto) {
    const acc = await this.subRepo.findOne({ where: { noa } });
    if (!acc) throw new NotFoundException(`الحساب الفرعي ${noa} غير موجود`);
    Object.assign(acc, dto);
    return { data: await this.subRepo.save(acc), message: 'تم التحديث' };
  }

  async removeSub(noa: number) {
    const acc = await this.subRepo.findOne({ where: { noa } });
    if (!acc) throw new NotFoundException(`الحساب الفرعي ${noa} غير موجود`);
    await this.subRepo.remove(acc);
    return { message: `تم حذف الحساب الفرعي ${noa}` };
  }

  async searchSub(query: string) {
    const results = await this.subRepo.createQueryBuilder('s')
      .where('s.namea LIKE :q OR CAST(s.noa AS TEXT) LIKE :q', { q: `%${query}%` })
      .orderBy('s.noa', 'ASC').take(20).getMany();
    return { data: results };
  }

  // ─── تفاصيل الحسابات CRUD ───
  async createDetail(dto: CreateAccountDetailDto) {
    return { data: await this.detailRepo.save(this.detailRepo.create(dto)), message: 'تم إنشاء التفاصيل' };
  }

  async findAllDetails(pagination: PaginationDto) {
    const { skip, pageSize } = pagination;
    const [data, totalCount] = await this.detailRepo.findAndCount({ skip, take: pageSize, relations: ['account'] });
    return { data, totalCount };
  }

  async updateDetail(noa: number, dto: UpdateAccountDetailDto) {
    const detail = await this.detailRepo.findOne({ where: { noa } });
    if (!detail) throw new NotFoundException(`التفاصيل غير موجودة`);
    Object.assign(detail, dto);
    return { data: await this.detailRepo.save(detail), message: 'تم التحديث' };
  }

  // ─── المجموعات CRUD ───
  async createGroup(dto: CreateGroupDto) {
    return { data: await this.groupRepo.save(this.groupRepo.create(dto)), message: 'تم إنشاء المجموعة' };
  }

  async findAllGroups() {
    return { data: await this.groupRepo.find({ order: { id: 'ASC' } }) };
  }

  async updateGroup(id: number, dto: UpdateGroupDto) {
    const group = await this.groupRepo.findOne({ where: { id } });
    if (!group) throw new NotFoundException(`المجموعة غير موجودة`);
    Object.assign(group, dto);
    return { data: await this.groupRepo.save(group), message: 'تم التحديث' };
  }

  async removeGroup(id: number) {
    await this.groupRepo.delete(id);
    return { message: 'تم الحذف' };
  }
}

// ═══════════════════════════════════════════
// CONTROLLER
// ═══════════════════════════════════════════
@ApiTags('accounts')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly svc: AccountsService) {}

  // دليل الحسابات
  @Post('chart') @ApiOperation({ summary: 'إنشاء حساب رئيسي' }) create(@Body() dto: CreateChartAccountDto) { return this.svc.createChart(dto); }
  @Get('chart') @ApiOperation({ summary: 'قائمة الحسابات الرئيسية' }) findAll(@Query() p: PaginationDto) { return this.svc.findAllChart(p); }
  @Get('tree') @ApiOperation({ summary: 'شجرة الحسابات' }) getTree() { return this.svc.getAccountTree(); }
  @Get('chart/:id') @ApiOperation({ summary: 'حساب رئيسي بالرقم' }) findOne(@Param('id', ParseIntPipe) id: number) { return this.svc.findOneChart(id); }
  @Put('chart/:id') @ApiOperation({ summary: 'تحديث حساب رئيسي' }) update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateChartAccountDto) { return this.svc.updateChart(id, dto); }
  @Delete('chart/:id') @ApiOperation({ summary: 'حذف حساب رئيسي' }) remove(@Param('id', ParseIntPipe) id: number) { return this.svc.removeChart(id); }

  // الحسابات الفرعية
  @Post('sub') @ApiOperation({ summary: 'إنشاء حساب فرعي' }) createSub(@Body() dto: CreateSubAccountDto) { return this.svc.createSub(dto); }
  @Get('sub') @ApiOperation({ summary: 'قائمة الحسابات الفرعية' }) findAllSub(@Query() p: SubAccountQueryDto) { return this.svc.findAllSub(p); }
  @Get('sub/search') @ApiOperation({ summary: 'بحث في الحسابات الفرعية' }) searchSub(@Query('q') q: string) { return this.svc.searchSub(q); }
  @Get('sub/:id') @ApiOperation({ summary: 'حساب فرعي بالرقم' }) findOneSub(@Param('id', ParseIntPipe) id: number) { return this.svc.findOneSub(id); }
  @Put('sub/:id') @ApiOperation({ summary: 'تحديث حساب فرعي' }) updateSub(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSubAccountDto) { return this.svc.updateSub(id, dto); }
  @Delete('sub/:id') @ApiOperation({ summary: 'حذف حساب فرعي' }) removeSub(@Param('id', ParseIntPipe) id: number) { return this.svc.removeSub(id); }

  // تفاصيل الحسابات
  @Post('details') @ApiOperation({ summary: 'إنشاء تفاصيل حساب' }) createDetail(@Body() dto: CreateAccountDetailDto) { return this.svc.createDetail(dto); }
  @Get('details') @ApiOperation({ summary: 'قائمة التفاصيل' }) findAllDetails(@Query() p: PaginationDto) { return this.svc.findAllDetails(p); }
  @Put('details/:id') @ApiOperation({ summary: 'تحديث تفاصيل' }) updateDetail(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAccountDetailDto) { return this.svc.updateDetail(id, dto); }

  // المجموعات
  @Post('groups') @ApiOperation({ summary: 'إنشاء مجموعة' }) createGroup(@Body() dto: CreateGroupDto) { return this.svc.createGroup(dto); }
  @Get('groups') @ApiOperation({ summary: 'قائمة المجموعات' }) findAllGroups() { return this.svc.findAllGroups(); }
  @Put('groups/:id') @ApiOperation({ summary: 'تحديث مجموعة' }) updateGroup(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGroupDto) { return this.svc.updateGroup(id, dto); }
  @Delete('groups/:id') @ApiOperation({ summary: 'حذف مجموعة' }) removeGroup(@Param('id', ParseIntPipe) id: number) { return this.svc.removeGroup(id); }
}

// ═══════════════════════════════════════════
// MODULE
// ═══════════════════════════════════════════
@Module({
  imports: [TypeOrmModule.forFeature([ChartOfAccountEntity, SubAccountEntity, AccountDetailEntity, GroupEntity])],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
