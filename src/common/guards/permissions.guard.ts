import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { getPermissionsFromRoles } from '../helpers/utils';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private logger = new Logger('PERMISSION GUARD');
  constructor(private reflector: Reflector) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const routePermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    const userPermissions = getPermissionsFromRoles(user.role);

    if (!routePermissions) {
      return true;
    }

    const hasPermission = () =>
      routePermissions.every((routePermission) =>
        userPermissions.includes(routePermission),
      );

    if (hasPermission()) {
      return true;
    }

    this.logger.error(`User doesn't have permission: ${routePermissions}`);

    throw new ForbiddenException(
      'Not enough permissions to perform the operation',
    );
  }
}
