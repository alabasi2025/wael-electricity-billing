// =============================================
// متحكم المصادقة (Auth Controller)
// =============================================
import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ─── POST /api/auth/login ───
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'تسجيل الدخول' })
  @ApiResponse({ status: 200, description: 'تم تسجيل الدخول بنجاح' })
  @ApiResponse({ status: 401, description: 'بيانات دخول غير صحيحة' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // ─── GET /api/auth/profile ───
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'جلب معلومات المستخدم الحالي' })
  getProfile(@Request() req) {
    return {
      data: req.user,
      message: 'معلومات المستخدم الحالي',
    };
  }

  // ─── POST /api/auth/logout ───
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'تسجيل الخروج' })
  logout(@Request() req) {
    // يمكن إضافة التوكن لقائمة سوداء هنا
    return { message: 'تم تسجيل الخروج بنجاح' };
  }
}
