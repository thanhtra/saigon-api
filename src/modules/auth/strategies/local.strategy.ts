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
      passReqToCallback: true, // Cho phép truyền request vào validate()
      usernameField: 'phone',  // nếu login dùng phone thay vì username
      passwordField: 'password',
    });
  }

  async validate(request: Request, phone: string, password: string): Promise<any> {
    // Passport không hỗ trợ request-scoped injection, dùng ContextIdFactory
    const contextId = ContextIdFactory.getByRequest(request);
    const authService = await this.moduleRef.resolve(AuthService, contextId);

    const { data: user } = await authService.getUserByPhone(phone);
    if (!user) {
      throw new UnauthorizedException('Số điện thoại hoặc mật khẩu không đúng');
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Số điện thoại hoặc mật khẩu không đúng');
    }

    const { password: _, refresh_token, ...result } = user;
    return result;
  }
}
