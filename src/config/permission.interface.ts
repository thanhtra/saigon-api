import { UserRoles } from './userRoles';

export interface PermissionInterface {
  key: string;
  roles: UserRoles[];
}
