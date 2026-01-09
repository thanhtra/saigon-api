import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { PasswordUtil } from 'src/common/helpers/password';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  'local',
) {
  constructor(private readonly moduleRef: ModuleRef) {
    super({
      usernameField: 'phone',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, phone: string, password: string) {
    const contextId = ContextIdFactory.getByRequest(req);
    const authService = await this.moduleRef.resolve(
      AuthService,
      contextId,
    );

    const user = await authService.getUserByPhone(phone);

    if (!user || !user.password || !user.active) {
      throw new UnauthorizedException('Sai thông tin đăng nhập');
    }

    const isValid = await PasswordUtil.verify(
      user.password,
      password,
    );

    if (!isValid) {
      throw new UnauthorizedException('Sai thông tin đăng nhập');
    }

    return user;
  }
}

