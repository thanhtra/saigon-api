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
import { UserRole } from '../helpers/enum';
// import { isOperationAllowed } from '../utils/roles-permission.util';

@Injectable()
export class RolesGuard implements CanActivate {
  private logger = new Logger('ROLES GUARD');
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

    //những role mà user cần có để vào được api
    const routeRoles = this.reflector.get<UserRole[]>(
      'roles',
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    const hasPermission = () =>
      routeRoles.every((routeRole) => user.roles.includes(routeRole));

    if (routeRoles && hasPermission()) {
      return true;
    }

    this.logger.error(`User doesn't have the required role(s): ${routeRoles}`);

    throw new ForbiddenException('No authority to perform the operation');
  }
}
