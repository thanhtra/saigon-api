import { SetMetadata } from '@nestjs/common';
import { PermissionInterface } from '../../config/permission.interface';

export const Permissions = (...permissions: PermissionInterface[]) =>
  SetMetadata(
    'permissions',
    permissions.map((item) => item.key),
  );
