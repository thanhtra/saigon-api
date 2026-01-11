import * as _ from 'lodash';
import { UserRole } from 'src/common/helpers/enum';

const ALL_ROLE = [UserRole.Admin, UserRole.Broker, UserRole.Owner, UserRole.Sale, UserRole.Tenant];

export const ALL_ROLES: UserRole[] = [
  UserRole.Admin,
  UserRole.Broker,
  UserRole.Owner,
  UserRole.Sale,
  UserRole.Tenant,
];
export const ADMIN_ROLES: UserRole[] = [UserRole.Admin];

export const PERMISSIONS = {
  users: {
    all_role: { key: 'users:all_role', roles: ALL_ROLES },
    read_many: { key: 'users:read_many', roles: ADMIN_ROLES },
    read_one: { key: 'users:read_one', roles: ADMIN_ROLES },
    create: { key: 'users:create', roles: ADMIN_ROLES },
    update: { key: 'users:update', roles: ADMIN_ROLES },
    delete: { key: 'users:delete', roles: ADMIN_ROLES },
    logout: { key: 'users:logout', roles: ALL_ROLES },
  },
  collaborators: {
    read_many: { key: 'collaborators:read_many', roles: ADMIN_ROLES },
    read_one: { key: 'collaborators:read_one', roles: ADMIN_ROLES },
    create: { key: 'collaborators:create', roles: ADMIN_ROLES },
    update: { key: 'collaborators:update', roles: ADMIN_ROLES },
    delete: { key: 'collaborators:delete', roles: ADMIN_ROLES },
    logout: { key: 'collaborators:logout', roles: ADMIN_ROLES },
  },
  bookings: {
    read: { key: 'bookings:read', roles: ADMIN_ROLES },
    create: { key: 'bookings:create', roles: ADMIN_ROLES },
    update: { key: 'bookings:update', roles: ADMIN_ROLES },
    delete: { key: 'bookings:delete', roles: ADMIN_ROLES },
  },
  rentals: {
    read_many: { key: 'rentals:read_many', roles: ADMIN_ROLES },
    read_one: { key: 'rentals:read_one', roles: ADMIN_ROLES },
    read_admin: { key: 'rentals:read_admin', roles: ADMIN_ROLES },
    create: { key: 'rentals:create', roles: ADMIN_ROLES },
    update: { key: 'rentals:update', roles: ADMIN_ROLES },
    delete: { key: 'rentals:delete', roles: ADMIN_ROLES },
    force_delete: { key: 'rentals:force_delete', roles: ADMIN_ROLES },
  },

  rooms: {
    read_one: { key: 'rooms:read_one', roles: ADMIN_ROLES },
    read_many: { key: 'rooms:read_many', roles: ADMIN_ROLES },
    read: { key: 'rooms:read', roles: ADMIN_ROLES },
    create: { key: 'rooms:create', roles: ADMIN_ROLES },
    update: { key: 'rooms:update', roles: ADMIN_ROLES },
    delete: { key: 'rooms:delete', roles: ADMIN_ROLES },
  },

  commissions: {
    read_one: { key: 'commissions:read_one', roles: ADMIN_ROLES },
    read_many: { key: 'commissions:read_many', roles: ADMIN_ROLES },
    read: { key: 'commissions:read', roles: ADMIN_ROLES },
    create: { key: 'commissions:create', roles: ADMIN_ROLES },
    update: { key: 'commissions:update', roles: ADMIN_ROLES },
    delete: { key: 'commissions:delete', roles: ADMIN_ROLES },
  },

  tenants: {
    read_one: { key: 'tenants:read_one', roles: ADMIN_ROLES },
    read_many: { key: 'tenants:read_many', roles: ADMIN_ROLES },
    read: { key: 'tenants:read', roles: ADMIN_ROLES },
    create: { key: 'tenants:create', roles: ADMIN_ROLES },
    update: { key: 'tenants:update', roles: ADMIN_ROLES },
    delete: { key: 'tenants:delete', roles: ADMIN_ROLES },
  },

  contracts: {
    read_one: { key: 'contracts:read_one', roles: ADMIN_ROLES },
    read_many: { key: 'contracts:read_many', roles: ADMIN_ROLES },
    read: { key: 'contracts:read', roles: ADMIN_ROLES },
    create: { key: 'contracts:create', roles: ADMIN_ROLES },
    update: { key: 'contracts:update', roles: ADMIN_ROLES },
    delete: { key: 'contracts:delete', roles: ADMIN_ROLES },
  },

  uploads: {
    read: { key: 'uploads:read', roles: ADMIN_ROLES },
    read_many: { key: 'uploads:read_many', roles: ADMIN_ROLES },
    upload: { key: 'uploads:upload', roles: ADMIN_ROLES },
    create: { key: 'uploads:create', roles: ADMIN_ROLES },
    update: { key: 'uploads:update', roles: ADMIN_ROLES },
    delete: { key: 'uploads:delete', roles: ADMIN_ROLES },
  },
};

export const PERMISSIONS_FLAT_LIST = () => {
  const list = {};

  _.map(PERMISSIONS, (rules, categoryName) => {
    _.map(rules, (rule, permissionName) => {
      list[`${categoryName.toUpperCase()}_${permissionName.toUpperCase()}`] =
        rule.key;
    });
  });

  return list;
};
