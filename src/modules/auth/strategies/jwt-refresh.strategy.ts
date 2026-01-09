import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';


@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => req?.cookies?.refreshToken,
            ]),
            secretOrKey: configService.get<string>(
                'auth.jwtRefreshTokenSecret',
            ),
            ignoreExpiration: false,
            passReqToCallback: true,
        });
    }


    validate(req: Request, payload: any) {
        return {
            sub: payload.sub,
            username: payload.username,
            pv: payload.pv,
        };
    }
}