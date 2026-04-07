// =============================================
// وحدة المخازن والأمانات الكهربائية
// بديل: mhzn* + mkrna* + mhssat + mkb* + kat
//        + amandhs* + gnob + btrba + car + shk
// =============================================
import { Injectable, NotFoundException, Module, Controller,
  Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository, Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

// ═══════ ENTITIES ═══════

@Entity('electricity_warehouse')
export class WarehouseEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'item_no', type: 'int', unique: true }) itemNo: number;
  @Column({ type: 'varchar', length: 200 }) name: string;
  @Column({ type: 'varchar', length: 50, nullable: true }) category: string;
  @Column({ type: 'varchar', length: 50, nullable: true }) unit: string;
  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 }) quantity: number;
  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2, default: 0 }) unitPrice: number;
  @Column({ name: 'min_stock', type: 'decimal', precision: 10, scale: 2, default: 0 }) minStock: number;
  @Column({ type: 'varchar', length: 200, nullable: true }) location: string;
  @Column({ type: 'text', nullable: true }) notes: string;
  @Column({ type: 'int', default: 1 }) status: number;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}

@Entity('warehouse_movements')
export class WarehouseMovementEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'item_id', type: 'int' }) itemId: number;
  @Column({ name: 'movement_type', type: 'varchar', length: 20 }) movementType: string; // in/out/adjust
  @Column({ type: 'decimal', precision: 18, scale: 2 }) quantity: number;
  @Column({ name: 'unit_price', type: 'decimal', precision: 10, scale: 2, nullable: true }) unitPrice: number;
  @Column({ type: 'date' }) dates: Date;
  @Column({ type: 'text', nullable: true }) reason: string;
  @Column({ name: 'subscriber_noa', type: 'int', nullable: true }) subscriberNoa: number;
  @Column({ name: 'created_by', type: 'int', nullable: true }) createdBy: number;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}

@Entity('electricity_deposits')
export class ElecDepositEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'deposit_no', type: 'int', unique: true }) depositNo: number;
  @Column({ name: 'subscriber_noa', type: 'int', nullable: true }) subscriberNoa: number;
  @Column({ name: 'subscriber_name', type: 'varchar', length: 200, nullable: true }) subscriberName: string;
  @Column({ type: 'decimal', precision: 18, scale: 2 }) amount: number;
  @Column({ name: 'deposit_type', type: 'varchar', length: 50 }) depositType: string; // meter_deposit/service_deposit/guarantee
  @Column({ type: 'date' }) dates: Date;
  @Column({ type: 'int', default: 0 }) status: number; // 0=محتجز 1=مسترد
  @Column({ type: 'text', nullable: true }) notes: string;
  @Column({ name: 'returned_date', type: 'date', nullable: true }) returnedDate: Date;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}

// ═══════ SERVICE ═══════

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(WarehouseEntity) private itemRepo: Repository<WarehouseEntity>,
    @InjectRepository(WarehouseMovementEntity) private moveRepo: Repository<WarehouseMovementEntity>,
    @InjectRepository(ElecDepositEntity) private depRepo: Repository<ElecDepositEntity>,
  ) {}

  // المخازن
  async createItem(dto: any) {
    const maxNo = await this.itemRepo.createQueryBuilder('i').select('MAX(i.itemNo)','max').getRawOne();
    return { data: await this.itemRepo.save(this.itemRepo.create({ ...dto, itemNo: (maxNo?.max || 0) + 1 })), message: 'تم إضافة الصنف' };
  }
  async findAllItems() { return { data: await this.itemRepo.find({ order: { itemNo: 'ASC' } }) }; }
  async updateItem(id: number, dto: any) { const i = await this.itemRepo.findOne({ where: { id } }); if (!i) throw new NotFoundException('غير موجود'); Object.assign(i, dto); return { data: await this.itemRepo.save(i) }; }
  async getLowStockItems() {
    const items = await this.itemRepo.createQueryBuilder('i').where('i.quantity <= i.minStock AND i.minStock > 0').getMany();
    return { data: items, message: `${items.length} صنف تحت الحد الأدنى` };
  }

  // حركات المخزن
  async createMovement(dto: any) {
    const item = await this.itemRepo.findOne({ where: { id: dto.itemId } });
    if (!item) throw new NotFoundException('الصنف غير موجود');
    if (dto.movementType === 'in') item.quantity = +item.quantity + +dto.quantity;
    else if (dto.movementType === 'out') item.quantity = +item.quantity - +dto.quantity;
    else item.quantity = +dto.quantity;
    await this.itemRepo.save(item);
    return { data: await this.moveRepo.save(this.moveRepo.create({ ...dto, dates: new Date() })), message: 'تم تسجيل الحركة' };
  }
  async findMovements(itemId?: number) {
    const qb = this.moveRepo.createQueryBuilder('m');
    if (itemId) qb.where('m.itemId = :id', { id: itemId });
    qb.orderBy('m.createdAt', 'DESC');
    return { data: await qb.getMany() };
  }

  // الأمانات
  async createDeposit(dto: any) {
    const maxNo = await this.depRepo.createQueryBuilder('d').select('MAX(d.depositNo)','max').getRawOne();
    return { data: await this.depRepo.save(this.depRepo.create({ ...dto, depositNo: (maxNo?.max || 0) + 1 })), message: 'تم تسجيل الأمانة' };
  }
  async findAllDeposits(status?: number) {
    const qb = this.depRepo.createQueryBuilder('d');
    if (status !== undefined) qb.where('d.status = :s', { s: status });
    qb.orderBy('d.createdAt', 'DESC');
    return { data: await qb.getMany() };
  }
  async returnDeposit(id: number) {
    const d = await this.depRepo.findOne({ where: { id } });
    if (!d) throw new NotFoundException('الأمانة غير موجودة');
    d.status = 1; d.returnedDate = new Date() as any;
    return { data: await this.depRepo.save(d), message: 'تم استرداد الأمانة' };
  }

  async getWarehouseStats() {
    const items = await this.itemRepo.count();
    const totalValue = await this.itemRepo.createQueryBuilder('i').select('SUM(i.quantity * i.unitPrice)', 'total').getRawOne();
    const deposits = await this.depRepo.count({ where: { status: 0 } });
    const depositTotal = await this.depRepo.createQueryBuilder('d').select('SUM(d.amount)', 'total').where('d.status = 0').getRawOne();
    return { data: { items, totalValue: +totalValue?.total || 0, activeDeposits: deposits, depositTotal: +depositTotal?.total || 0 } };
  }
}

// ═══════ CONTROLLER ═══════

@ApiTags('electricity/warehouse')
@ApiBearerAuth('JWT-auth') @UseGuards(JwtAuthGuard)
@Controller('electricity/warehouse')
export class WarehouseController {
  constructor(private svc: WarehouseService) {}

  @Get('stats') @ApiOperation({ summary: 'إحصائيات المخازن' }) getStats() { return this.svc.getWarehouseStats(); }
  @Post('items') @ApiOperation({ summary: 'إضافة صنف (mhzn)' }) createItem(@Body() dto: any) { return this.svc.createItem(dto); }
  @Get('items') @ApiOperation({ summary: 'قائمة الأصناف' }) findItems() { return this.svc.findAllItems(); }
  @Put('items/:id') updateItem(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateItem(id, dto); }
  @Get('items/low-stock') @ApiOperation({ summary: 'أصناف تحت الحد الأدنى' }) lowStock() { return this.svc.getLowStockItems(); }

  @Post('movements') @ApiOperation({ summary: 'تسجيل حركة مخزن' }) createMove(@Body() dto: any) { return this.svc.createMovement(dto); }
  @Get('movements') @ApiOperation({ summary: 'حركات المخزن' }) findMoves(@Query('itemId') itemId?: number) { return this.svc.findMovements(itemId ? +itemId : undefined); }

  @Post('deposits') @ApiOperation({ summary: 'تسجيل أمانة (amandhs)' }) createDeposit(@Body() dto: any) { return this.svc.createDeposit(dto); }
  @Get('deposits') @ApiOperation({ summary: 'قائمة الأمانات' }) findDeposits(@Query('status') st?: number) { return this.svc.findAllDeposits(st !== undefined ? +st : undefined); }
  @Post('deposits/:id/return') @ApiOperation({ summary: 'استرداد أمانة' }) returnDeposit(@Param('id', ParseIntPipe) id: number) { return this.svc.returnDeposit(id); }
}

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseEntity, WarehouseMovementEntity, ElecDepositEntity])],
  controllers: [WarehouseController], providers: [WarehouseService], exports: [WarehouseService],
})
export class WarehouseModule {}
