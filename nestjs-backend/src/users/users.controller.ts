// =============================================
// متحكم المستخدمين (Users Controller)
// =============================================
import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
  UpdatePermissionsDto,
} from './dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ─── POST /api/users ───
  @Post()
  @ApiOperation({ summary: 'إنشاء مستخدم جديد' })
  @ApiResponse({ status: 201, description: 'تم إنشاء المستخدم بنجاح' })
  @ApiResponse({ status: 409, description: 'المستخدم موجود مسبقاً' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // ─── GET /api/users ───
  @Get()
  @ApiOperation({ summary: 'جلب قائمة المستخدمين مع ترقيم وبحث' })
  @ApiResponse({ status: 200, description: 'قائمة المستخدمين' })
  findAll(@Query() pagination: PaginationDto) {
    return this.usersService.findAll(pagination);
  }

  // ─── GET /api/users/stats ───
  @Get('stats')
  @ApiOperation({ summary: 'إحصائيات المستخدمين' })
  getStats() {
    return this.usersService.getStats();
  }

  // ─── GET /api/users/activity-log ───
  @Get('activity-log')
  @ApiOperation({ summary: 'سجل نشاط المستخدمين (SYSDATA)' })
  getActivityLog(@Query() pagination: PaginationDto) {
    return this.usersService.getActivityLog(pagination);
  }

  // ─── GET /api/users/:id ───
  @Get(':id')
  @ApiOperation({ summary: 'جلب مستخدم بالرقم' })
  @ApiParam({ name: 'id', description: 'رقم المستخدم (NOU)' })
  @ApiResponse({ status: 200, description: 'بيانات المستخدم' })
  @ApiResponse({ status: 404, description: 'المستخدم غير موجود' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  // ─── PUT /api/users/:id ───
  @Put(':id')
  @ApiOperation({ summary: 'تحديث بيانات مستخدم' })
  @ApiParam({ name: 'id', description: 'رقم المستخدم (NOU)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(id, dto);
  }

  // ─── DELETE /api/users/:id ───
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'حذف مستخدم' })
  @ApiParam({ name: 'id', description: 'رقم المستخدم (NOU)' })
  @ApiResponse({ status: 204, description: 'تم الحذف' })
  @ApiResponse({ status: 400, description: 'لا يمكن حذف مدير النظام' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  // ─── PATCH /api/users/:id/password ───
  @Patch(':id/password')
  @ApiOperation({ summary: 'تغيير كلمة السر' })
  changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(id, dto);
  }

  // ─── PATCH /api/users/:id/permissions ───
  @Patch(':id/permissions')
  @ApiOperation({ summary: 'تحديث صلاحيات المستخدم' })
  updatePermissions(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePermissionsDto,
  ) {
    return this.usersService.updatePermissions(id, dto);
  }

  // ─── PATCH /api/users/:id/toggle-status ───
  @Patch(':id/toggle-status')
  @ApiOperation({ summary: 'تفعيل/تعطيل المستخدم' })
  toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.toggleStatus(id);
  }
}
