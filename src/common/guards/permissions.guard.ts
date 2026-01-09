import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { getPermissionsFromRoles } from '../helpers/utils';

@Injectable()
export class PermissionsGuard extends AuthGuard('jwt') implements CanActivate {
  private logger = new Logger(PermissionsGuard.name);

  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1️⃣ Kiểm tra public route
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) return true;

    // 2️⃣ Kiểm tra JWT
    const can = await super.canActivate(context);
    if (!can) throw new UnauthorizedException('Unauthenticated');

    const request = context.switchToHttp().getRequest();
    const user = request?.user;
    if (!user) throw new UnauthorizedException('User not found in request');

    // 3️⃣ Lấy permissions từ route
    const routePermissions: string[] =
      this.reflector.get<string[]>('permissions', context.getHandler()) || [];

    // Nếu route không yêu cầu permission → pass
    if (!routePermissions.length) return true;

    // 4️⃣ Lấy permissions của user theo role
    const userPermissions = getPermissionsFromRoles(user.role);

    // 5️⃣ Kiểm tra quyền
    const hasPermission = routePermissions.every(p => userPermissions.includes(p));
    if (!hasPermission) {
      this.logger.warn(`User ${user.id} does not have required permissions: ${routePermissions.join(', ')}`);
      throw new ForbiddenException('Not enough permissions to perform this operation');
    }

    return true;
  }
}
