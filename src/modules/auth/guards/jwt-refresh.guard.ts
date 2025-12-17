import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
    handleRequest(err, user, info, context) {
        const req = context.switchToHttp().getRequest();

        if (err || info) {
            throw err || new UnauthorizedException(info?.message);
        }

        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token missing');
        }

        req.refreshToken = refreshToken;
        return user;
    }
}
