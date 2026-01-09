import { applyDecorators, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Permissions } from './permissions.decorator';
import { PermissionInterface } from '../interface/permission.interface';

type PermissionInput = string | PermissionInterface | (string | PermissionInterface)[];

/**
 * @Auth decorator
 * - Nếu không truyền permission: chỉ kiểm tra JWT + guard
 * - Nếu truyền permission: kiểm tra JWT + guard + permission
 */
export function Auth(permission?: PermissionInput) {
    // Chuẩn hóa thành mảng
    const perms: (string | PermissionInterface)[] = [];
    if (permission) {
        if (Array.isArray(permission)) {
            perms.push(...permission);
        } else {
            perms.push(permission);
        }
    }

    // Tạo mảng decorator, luôn có UseGuards(PermissionsGuard)
    const decorators = [UseGuards(PermissionsGuard)];

    // Nếu có permission thì thêm Permissions(...)
    if (perms.length > 0) {
        decorators.push(Permissions(...perms));
    }

    return applyDecorators(...decorators);
}


// @Auth()        // kiểm tra JWT
// @Auth('users:create') // kiểm tra JWT + permission
// @Public()      // bỏ qua JWT + permission
