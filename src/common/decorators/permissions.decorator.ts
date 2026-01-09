// import { SetMetadata } from '@nestjs/common';
// import { PermissionInterface } from '../../config/permission.interface';

// export const Permissions = (...permissions: PermissionInterface[]) =>
//   SetMetadata(
//     'permissions',
//     permissions.map((item) => item.key),
//   );


import { SetMetadata } from '@nestjs/common';
import { PermissionInterface } from '../interface/permission.interface';

type PermissionType = string | PermissionInterface;

export const Permissions = (...permissions: PermissionType[]) =>
  SetMetadata(
    'permissions',
    permissions.map(p => (typeof p === 'string' ? p : p.key)),
  );
