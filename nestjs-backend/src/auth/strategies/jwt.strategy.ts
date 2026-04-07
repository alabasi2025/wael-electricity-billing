// =============================================
// JWT Strategy + JWT Auth Guard
// =============================================

// ─── src/auth/strategies/jwt.strategy.ts ───
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../../common/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'default-secret-change-me',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.validateToken(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      userId: payload.sub,
      username: payload.username,
      statu: payload.statu,
    };
  }
}
