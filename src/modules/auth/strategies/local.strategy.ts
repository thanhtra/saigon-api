import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import * as argon2 from 'argon2';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private moduleRef: ModuleRef) {
    super({
      passReqToCallback: true,
      usernameField: 'phone',
      passwordField: 'password',
    });
  }

  async validate(req: Request, phone: string, password: string) {
    const contextId = ContextIdFactory.getByRequest(req);
    const authService = await this.moduleRef.resolve(AuthService, contextId);

    const user = await authService.getUserByPhone(phone);

    if (!user || !user?.password) {
      throw new UnauthorizedException('Số điện thoại hoặc mật khẩu không đúng');
    }

    const isValid = await argon2.verify(user.password, password);
    if (!isValid) {
      throw new UnauthorizedException('Số điện thoại hoặc mật khẩu không đúng');
    }

    const { password: _, refresh_token, ...safeUser } = user;
    return safeUser;
  }
}
