import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from 'src/common/interface/common';
import { UsersRepository } from 'src/modules/users/users.repository';


@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {
    constructor(
        configService: ConfigService,
        private readonly usersRepository: UsersRepository,
    ) {
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


    async validate(
        req: Request,
        payload: TokenPayload,
    ) {
        const user = await this.usersRepository.findOneUser(
            payload.sub,
        );

        if (!user) {
            throw new UnauthorizedException(
                'User not found',
            );
        }

        if (user.password_version !== payload.pv) {
            throw new UnauthorizedException(
                'Refresh token revoked',
            );
        }

        return {
            sub: user.id,
            username: user.phone,
            pv: user.password_version
        };
    }
}