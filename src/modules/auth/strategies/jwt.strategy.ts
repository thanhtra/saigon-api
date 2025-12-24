import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly moduleRef: ModuleRef,
  ) {
    super({
      // ✅ ĐỌC ACCESS TOKEN TỪ COOKIE
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.accessToken;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        'auth.jwtAccessTokenSecret',
      ),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    try {
      // ⚠️ Request-scoped resolve
      const contextId = ContextIdFactory.getByRequest(req);
      const authService = await this.moduleRef.resolve(
        AuthService,
        contextId,
      );

      // payload.username được set khi sign token
      const user = await authService.getUserByPhone(
        payload.username,
      );

      if (!user) {
        throw new UnauthorizedException();
      }

      // 👉 gắn vào req.user
      return user;
    } catch (error) {
      throw new HttpException(
        'Invalid access token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
