// =============================================
// خدمة المصادقة (Auth Service)
// =============================================
import {
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto, LoginResponseDto } from './dto';
import { JwtPayload } from '../common/interfaces';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // ─── تسجيل الدخول ───
  async login(dto: LoginDto): Promise<{ data: LoginResponseDto; message: string }> {
    const { userId, password } = dto;

    // البحث عن المستخدم
    const user = await this.usersService.findOneForAuth(userId);
    if (!user) {
      throw new UnauthorizedException('رقم المستخدم أو كلمة السر غير صحيحة');
    }

    // التحقق من الحالة
    if (user.statu !== 1) {
      throw new UnauthorizedException('حساب المستخدم معطّل');
    }

    // التحقق من كلمة السر
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('رقم المستخدم أو كلمة السر غير صحيحة');
    }

    // إنشاء التوكن
    const payload: JwtPayload = {
      sub: user.nou,
      username: user.nameu,
      statu: user.statu,
    };

    const token = this.jwtService.sign(payload);

    // بناء الصلاحيات
    const permissions = this.buildPermissions(user);

    // تسجيل الدخول في سجل النظام
    await this.usersService.logAction(user.nou, 'تسجيل دخول');

    this.logger.log(`تسجيل دخول: ${user.nameu} (${user.nou})`);

    return {
      data: {
        token,
        user: {
          nou: user.nou,
          nameu: user.nameu,
          statu: user.statu,
          ed: user.ed,
          de: user.de,
          repa: user.repa,
        },
        permissions,
      },
      message: `مرحباً ${user.nameu}`,
    };
  }

  // ─── التحقق من التوكن ───
  async validateToken(payload: JwtPayload) {
    const user = await this.usersService.findOneForAuth(payload.sub);
    if (!user || user.statu !== 1) {
      throw new UnauthorizedException('جلسة غير صالحة');
    }
    return user;
  }

  // ─── بناء قائمة الصلاحيات ───
  private buildPermissions(user: any): string[] {
    const permissions: string[] = ['dashboard.view'];

    // المستخدم رقم 1 = مدير النظام (كل الصلاحيات)
    if (user.nou === 1) {
      return [
        'dashboard.view',
        'accounts.view', 'accounts.create', 'accounts.edit', 'accounts.delete',
        'journal.view', 'journal.create', 'journal.edit', 'journal.delete', 'journal.post',
        'vouchers.view', 'vouchers.create', 'vouchers.edit', 'vouchers.delete', 'vouchers.post',
        'invoices.view', 'invoices.create', 'invoices.edit', 'invoices.delete',
        'reports.view', 'reports.export',
        'employees.view', 'employees.create', 'employees.edit', 'employees.delete',
        'electricity.view', 'electricity.create', 'electricity.edit',
        'users.view', 'users.create', 'users.edit', 'users.delete',
        'settings.view', 'settings.edit',
        'backup.create', 'backup.restore',
        'closing.view', 'closing.create',
      ];
    }

    // صلاحيات عادية
    permissions.push('accounts.view', 'journal.view', 'vouchers.view', 'invoices.view', 'reports.view');

    if (user.ed === 'Y' || user.ed === '1') {
      permissions.push(
        'accounts.create', 'accounts.edit',
        'journal.create', 'journal.edit',
        'vouchers.create', 'vouchers.edit',
        'invoices.create', 'invoices.edit',
      );
    }

    if (user.de === 'Y' || user.de === '1') {
      permissions.push(
        'accounts.delete', 'journal.delete',
        'vouchers.delete', 'invoices.delete',
      );
    }

    if (user.repa) {
      permissions.push('reports.export');
    }

    return permissions;
  }
}
