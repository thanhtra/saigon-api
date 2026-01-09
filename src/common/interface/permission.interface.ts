import { UserRole } from 'src/common/helpers/enum';

export interface PermissionInterface {
    key: string;
    roles: UserRole[];
}
