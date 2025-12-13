import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../../config/userRoles';

export const Roles = (roles: UserRoles | UserRoles[]) =>
  SetMetadata('roles', typeof roles === 'string' ? [roles] : roles);
