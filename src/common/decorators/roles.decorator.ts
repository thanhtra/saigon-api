import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../helpers/enum';


export const Roles = (roles: UserRole | UserRole[]) =>
  SetMetadata('roles', typeof roles === 'string' ? [roles] : roles);
