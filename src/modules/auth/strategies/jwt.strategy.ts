import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, Injectable, HttpStatus, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { AuthService } from '../auth.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private moduleRef: ModuleRef,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwtAccessTokenSecret'),

      // Asks parent to send the "request" as the first param for function validate()
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any) {
    try {
      // Since Passport doesn't support request-scoped injection, we use the Context to locate the AuthService
      const contextId = ContextIdFactory.getByRequest(request);
      const authService = await this.moduleRef.resolve(AuthService, contextId);

      // Loading from the DB the user ID specified in the JWT. The user will be attached to req.user by Passport.
      const user = await authService.getUserByPhone(payload.username);
      return user;

    } catch (error) {
      throw new HttpException(
        'Invalid user in JWT token',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
