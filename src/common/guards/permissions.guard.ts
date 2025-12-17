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
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { getPermissionsFromRoles } from '../helpers/utils';

@Injectable()
export class PermissionsGuard
  extends AuthGuard('jwt')
  implements CanActivate {

  private logger = new Logger('PERMISSION GUARD');

  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    // 1️⃣ Check public route
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      return true;
    }

    // 2️⃣ Authenticate JWT (QUAN TRỌNG)
    const can = await super.canActivate(context);
    if (!can) {
      throw new UnauthorizedException('Unauthenticated');
    }

    const request = context.switchToHttp().getRequest();
    const user = request?.user;

    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }

    // 3️⃣ Get permissions of route
    const routePermissions =
      this.reflector.get<string[]>('permissions', context.getHandler());

    if (!routePermissions || routePermissions.length === 0) {
      return true;
    }

    // 4️⃣ Get permissions from role
    const userPermissions = getPermissionsFromRoles(user.role);

    const hasPermission = routePermissions.every(p =>
      userPermissions.includes(p),
    );

    if (!hasPermission) {
      this.logger.error(
        `User ${user.id} doesn't have permission: ${routePermissions}`,
      );
      throw new ForbiddenException(
        'Not enough permissions to perform the operation',
      );
    }

    return true;
  }
}
