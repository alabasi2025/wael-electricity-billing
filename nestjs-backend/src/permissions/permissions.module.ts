// =============================================
// وحدة الصلاحيات والأدوار
// بديل: PRG + USERGN + USER_U + menun + menunr
// =============================================
import { Injectable, CanActivate, ExecutionContext, ForbiddenException,
  Module, Controller, Get, Post, Put, Delete, Body, Param, Query,
  ParseIntPipe, UseGuards, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository, Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsNotEmpty, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// ═══════ ENTITIES ═══════

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'varchar', length: 100, unique: true }) name: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ name: 'is_active', type: 'boolean', default: true }) isActive: boolean;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}

@Entity('permissions')
export class PermissionEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'varchar', length: 100 }) module: string;
  @Column({ type: 'varchar', length: 50 }) action: string;
  @Column({ type: 'varchar', length: 300, nullable: true }) description: string;
}

@Entity('role_permissions')
export class RolePermissionEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'role_id', type: 'int' }) roleId: number;
  @Column({ name: 'permission_id', type: 'int' }) permissionId: number;
}

@Entity('user_roles')
export class UserRoleEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'user_id', type: 'int' }) userId: number;
  @Column({ name: 'role_id', type: 'int' }) roleId: number;
}

@Entity('menu_items')
export class MenuItemEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'parent_id', type: 'int', nullable: true }) parentId: number;
  @Column({ type: 'varchar', length: 200 }) title: string;
  @Column({ type: 'varchar', length: 50, nullable: true }) icon: string;
  @Column({ type: 'varchar', length: 200, nullable: true }) route: string;
  @Column({ name: 'sort_order', type: 'int', default: 0 }) sortOrder: number;
  @Column({ type: 'varchar', length: 100, nullable: true }) module: string;
  @Column({ name: 'permission_needed', type: 'varchar', length: 100, nullable: true }) permissionNeeded: string;
  @Column({ name: 'is_active', type: 'boolean', default: true }) isActive: boolean;
}

// ═══════ DECORATOR ═══════
export const REQUIRED_PERMISSION = 'requiredPermission';
export const RequirePermission = (module: string, action: string) =>
  SetMetadata(REQUIRED_PERMISSION, { module, action });

// ═══════ GUARD ═══════
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector, private permSvc: PermissionsService) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const required = this.reflector.get<{module:string;action:string}>(REQUIRED_PERMISSION, ctx.getHandler());
    if (!required) return true;
    const req = ctx.switchToHttp().getRequest();
    const userId = req.user?.nou || req.user?.id;
    if (!userId) throw new ForbiddenException('غير مصرح');
    const has = await this.permSvc.userHasPermission(userId, required.module, required.action);
    if (!has) throw new ForbiddenException(`لا تملك صلاحية: ${required.module}.${required.action}`);
    return true;
  }
}

// ═══════ SERVICE ═══════
@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(RoleEntity) private roleRepo: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity) private permRepo: Repository<PermissionEntity>,
    @InjectRepository(RolePermissionEntity) private rpRepo: Repository<RolePermissionEntity>,
    @InjectRepository(UserRoleEntity) private urRepo: Repository<UserRoleEntity>,
    @InjectRepository(MenuItemEntity) private menuRepo: Repository<MenuItemEntity>,
  ) {}

  // التحقق من صلاحية المستخدم
  async userHasPermission(userId: number, module: string, action: string): Promise<boolean> {
    const result = await this.urRepo.createQueryBuilder('ur')
      .innerJoin(RolePermissionEntity, 'rp', 'ur.roleId = rp.roleId')
      .innerJoin(PermissionEntity, 'p', 'rp.permissionId = p.id')
      .where('ur.userId = :uid AND p.module = :mod AND p.action = :act', { uid: userId, mod: module, act: action })
      .getCount();
    return result > 0;
  }

  // جلب صلاحيات المستخدم
  async getUserPermissions(userId: number) {
    const perms = await this.urRepo.createQueryBuilder('ur')
      .innerJoin(RolePermissionEntity, 'rp', 'ur.roleId = rp.roleId')
      .innerJoin(PermissionEntity, 'p', 'rp.permissionId = p.id')
      .innerJoin(RoleEntity, 'r', 'ur.roleId = r.id')
      .select(['p.module', 'p.action', 'r.name AS roleName'])
      .where('ur.userId = :uid', { uid: userId })
      .getRawMany();
    return { data: perms };
  }

  // الأدوار
  async findAllRoles() { return { data: await this.roleRepo.find({ order: { id: 'ASC' } }) }; }
  async createRole(name: string, description?: string) {
    return { data: await this.roleRepo.save(this.roleRepo.create({ name, description })), message: 'تم إنشاء الدور' };
  }

  // الصلاحيات
  async findAllPermissions() { return { data: await this.permRepo.find({ order: { module: 'ASC', action: 'ASC' } }) }; }

  // ربط دور بصلاحية
  async assignPermissionToRole(roleId: number, permissionId: number) {
    const existing = await this.rpRepo.findOne({ where: { roleId, permissionId } });
    if (existing) return { message: 'مرتبط مسبقاً' };
    await this.rpRepo.save(this.rpRepo.create({ roleId, permissionId }));
    return { message: 'تم ربط الصلاحية بالدور' };
  }

  async removePermissionFromRole(roleId: number, permissionId: number) {
    await this.rpRepo.delete({ roleId, permissionId });
    return { message: 'تم إزالة الصلاحية' };
  }

  // ربط مستخدم بدور
  async assignRoleToUser(userId: number, roleId: number) {
    const existing = await this.urRepo.findOne({ where: { userId, roleId } });
    if (existing) return { message: 'مرتبط مسبقاً' };
    await this.urRepo.save(this.urRepo.create({ userId, roleId }));
    return { message: 'تم ربط الدور بالمستخدم' };
  }

  async removeRoleFromUser(userId: number, roleId: number) {
    await this.urRepo.delete({ userId, roleId });
    return { message: 'تم إزالة الدور' };
  }

  // صلاحيات دور معين
  async getRolePermissions(roleId: number) {
    const perms = await this.rpRepo.createQueryBuilder('rp')
      .innerJoin(PermissionEntity, 'p', 'rp.permissionId = p.id')
      .select(['p.id', 'p.module', 'p.action', 'p.description'])
      .where('rp.roleId = :rid', { rid: roleId }).getRawMany();
    return { data: perms };
  }

  // القائمة الديناميكية
  async getMenuForUser(userId: number) {
    const userPerms = await this.getUserPermissions(userId);
    const permSet = new Set(userPerms.data.map((p: any) => `${p.p_module}.${p.p_action}`));
    const allMenus = await this.menuRepo.find({ where: { isActive: true }, order: { sortOrder: 'ASC' } });
    const filtered = allMenus.filter(m => !m.permissionNeeded || permSet.has(m.permissionNeeded));
    return { data: filtered };
  }

  async findAllMenuItems() { return { data: await this.menuRepo.find({ order: { sortOrder: 'ASC' } }) }; }
  async createMenuItem(data: Partial<MenuItemEntity>) {
    return { data: await this.menuRepo.save(this.menuRepo.create(data)), message: 'تم' };
  }
}

// ═══════ CONTROLLER ═══════
@ApiTags('permissions')
@ApiBearerAuth('JWT-auth') @UseGuards(JwtAuthGuard)
@Controller('permissions')
export class PermissionsController {
  constructor(private svc: PermissionsService) {}

  @Get('roles') @ApiOperation({ summary: 'قائمة الأدوار' }) findAllRoles() { return this.svc.findAllRoles(); }
  @Post('roles') @ApiOperation({ summary: 'إنشاء دور' }) createRole(@Body('name') name: string, @Body('description') desc?: string) { return this.svc.createRole(name, desc); }
  @Get('permissions') @ApiOperation({ summary: 'قائمة الصلاحيات' }) findAllPerms() { return this.svc.findAllPermissions(); }
  @Get('roles/:id/permissions') @ApiOperation({ summary: 'صلاحيات دور' }) getRolePerms(@Param('id', ParseIntPipe) id: number) { return this.svc.getRolePermissions(id); }
  @Post('roles/:roleId/permissions/:permId') @ApiOperation({ summary: 'ربط صلاحية بدور' })
  assignPerm(@Param('roleId', ParseIntPipe) roleId: number, @Param('permId', ParseIntPipe) permId: number) { return this.svc.assignPermissionToRole(roleId, permId); }
  @Delete('roles/:roleId/permissions/:permId') removePerm(@Param('roleId', ParseIntPipe) roleId: number, @Param('permId', ParseIntPipe) permId: number) { return this.svc.removePermissionFromRole(roleId, permId); }
  @Post('users/:userId/roles/:roleId') @ApiOperation({ summary: 'ربط دور بمستخدم' })
  assignRole(@Param('userId', ParseIntPipe) uid: number, @Param('roleId', ParseIntPipe) rid: number) { return this.svc.assignRoleToUser(uid, rid); }
  @Delete('users/:userId/roles/:roleId') removeRole(@Param('userId', ParseIntPipe) uid: number, @Param('roleId', ParseIntPipe) rid: number) { return this.svc.removeRoleFromUser(uid, rid); }
  @Get('users/:userId') @ApiOperation({ summary: 'صلاحيات مستخدم' }) getUserPerms(@Param('userId', ParseIntPipe) uid: number) { return this.svc.getUserPermissions(uid); }
  @Get('menu/:userId') @ApiOperation({ summary: 'القائمة الديناميكية للمستخدم' }) getUserMenu(@Param('userId', ParseIntPipe) uid: number) { return this.svc.getMenuForUser(uid); }
  @Get('menu') @ApiOperation({ summary: 'كل عناصر القائمة' }) findAllMenu() { return this.svc.findAllMenuItems(); }
  @Post('menu') @ApiOperation({ summary: 'إنشاء عنصر قائمة' }) createMenu(@Body() data: any) { return this.svc.createMenuItem(data); }
}

// ═══════ MODULE ═══════
@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, PermissionEntity, RolePermissionEntity, UserRoleEntity, MenuItemEntity])],
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionGuard],
  exports: [PermissionsService, PermissionGuard],
})
export class PermissionsModule {}
