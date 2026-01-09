import {
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt',
) {
  constructor(
    configService: ConfigService,
    private readonly moduleRef: ModuleRef,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.accessToken,
      ]),
      secretOrKey: configService.get<string>(
        'auth.jwtAccessTokenSecret',
      ),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const contextId = ContextIdFactory.getByRequest(req);
    const authService = await this.moduleRef.resolve(
      AuthService,
      contextId,
    );

    const user = await authService.getUserById(payload.sub);

    if (
      !user ||
      !user.active ||
      user.password_version !== payload.pv
    ) {
      throw new UnauthorizedException('Invalid access token');
    }

    return user;
  }
}