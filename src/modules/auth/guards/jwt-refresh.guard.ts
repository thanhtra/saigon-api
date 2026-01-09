import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
    handleRequest(
        err: any,
        user: any,
        info: any,
        context: ExecutionContext,
    ) {
        const req = context.switchToHttp().getRequest();

        if (err || info) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token missing');
        }

        req.refreshToken = refreshToken;
        return user;
    }
}
