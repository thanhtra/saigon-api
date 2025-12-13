import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth.service';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private moduleRef: ModuleRef) {
    super({
      // Asks parent to send the "request" as the first param for function validate()
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    username: string,
    password: string,
  ): Promise<any> {
    // Since Passport doesn't support request-scoped injection, we use the Context to locate the AuthService
    const contextId = ContextIdFactory.getByRequest(request);
    const authService = await this.moduleRef.resolve(AuthService, contextId);

    const user = await authService.getUserByPhone(username);

    if (!user) {
      throw new UnauthorizedException();
    }

    // Checking password
    if (await bcrypt.compare(password, user.password)) {
      const { password, refresh_token, ...result } = user;
      return result;
    }

    return null;
  }
}
