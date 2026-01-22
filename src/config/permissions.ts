import * as _ from 'lodash';
import { UserRole } from 'src/common/helpers/enum';

export const ALL_ROLES: UserRole[] = [UserRole.Admin, UserRole.Sale, UserRole.Owner, UserRole.Broker, UserRole.Tenant];
export const ADMIN_SALE_OWNER_BROKER: UserRole[] = [UserRole.Admin, UserRole.Sale, UserRole.Owner, UserRole.Broker];
export const ADMIN_SALE_OWNER: UserRole[] = [UserRole.Admin, UserRole.Sale, UserRole.Owner];
export const ADMIN_SALE: UserRole[] = [UserRole.Admin, UserRole.Sale];
export const ADMIN: UserRole[] = [UserRole.Admin];

export const PERMISSIONS = {
  users: {
    all_role: { key: 'users:all_role', roles: ALL_ROLES },
    read_many: { key: 'users:read_many', roles: ADMIN },
    read_one: { key: 'users:read_one', roles: ADMIN },
    create: { key: 'users:create', roles: ADMIN },
    update: { key: 'users:update', roles: ADMIN },
    delete: { key: 'users:delete', roles: ADMIN },
    logout: { key: 'users:logout', roles: ALL_ROLES },
  },
  collaborators: {
    read_contact: { key: 'collaborators:read_contact', roles: ADMIN },
    read_many: { key: 'collaborators:read_many', roles: ADMIN },
    read_one: { key: 'collaborators:read_one', roles: ADMIN },
    create: { key: 'collaborators:create', roles: ADMIN },
    update: { key: 'collaborators:update', roles: ADMIN },
    delete: { key: 'collaborators:delete', roles: ADMIN },
    logout: { key: 'collaborators:logout', roles: ADMIN },
  },
  bookings: {
    read: { key: 'bookings:read', roles: ADMIN },
    create: { key: 'bookings:create', roles: ADMIN },
    update: { key: 'bookings:update', roles: ADMIN },
    delete: { key: 'bookings:delete', roles: ADMIN },
  },
  rentals: {
    my_boarding_houses: { key: 'rentals:my_boarding_houses', roles: ADMIN_SALE_OWNER_BROKER },
    create_boarding_houses: { key: 'rentals:create_boarding_houses', roles: ADMIN_SALE_OWNER_BROKER },
    create_unit_rental: { key: 'rentals:create_unit_rental', roles: ADMIN_SALE_OWNER_BROKER },
    read_many: { key: 'rentals:read_many', roles: ADMIN },
    read_one: { key: 'rentals:read_one', roles: ADMIN },
    read_admin: { key: 'rentals:read_admin', roles: ADMIN },
    create: { key: 'rentals:create', roles: ADMIN },
    update: { key: 'rentals:update', roles: ADMIN },
    delete: { key: 'rentals:delete', roles: ADMIN },
    force_delete: { key: 'rentals:force_delete', roles: ADMIN },
  },

  rooms: {
    customer_create: { key: 'rooms:customer_create', roles: ADMIN_SALE_OWNER_BROKER },
    customer_update: { key: 'rooms:customer_update', roles: ADMIN_SALE_OWNER_BROKER },
    my_rooms: { key: 'rooms:my_rooms', roles: ADMIN_SALE_OWNER_BROKER },

    read_one: { key: 'rooms:read_one', roles: ADMIN },
    read_many: { key: 'rooms:read_many', roles: ADMIN },
    read: { key: 'rooms:read', roles: ADMIN },
    create: { key: 'rooms:create', roles: ADMIN },
    update: { key: 'rooms:update', roles: ADMIN },
    delete: { key: 'rooms:delete', roles: ADMIN },
  },

  commissions: {
    read_one: { key: 'commissions:read_one', roles: ADMIN },
    read_many: { key: 'commissions:read_many', roles: ADMIN },
    read: { key: 'commissions:read', roles: ADMIN },
    create: { key: 'commissions:create', roles: ADMIN },
    update: { key: 'commissions:update', roles: ADMIN },
    delete: { key: 'commissions:delete', roles: ADMIN },
  },

  tenants: {
    read_one: { key: 'tenants:read_one', roles: ADMIN },
    read_many: { key: 'tenants:read_many', roles: ADMIN },
    read: { key: 'tenants:read', roles: ADMIN },
    create: { key: 'tenants:create', roles: ADMIN },
    update: { key: 'tenants:update', roles: ADMIN },
    delete: { key: 'tenants:delete', roles: ADMIN },
  },

  contracts: {
    read_one: { key: 'contracts:read_one', roles: ADMIN },
    read_many: { key: 'contracts:read_many', roles: ADMIN },
    read: { key: 'contracts:read', roles: ADMIN },
    create: { key: 'contracts:create', roles: ADMIN },
    update: { key: 'contracts:update', roles: ADMIN },
    delete: { key: 'contracts:delete', roles: ADMIN },
  },

  uploads: {
    read: { key: 'uploads:read', roles: ADMIN },
    read_many: { key: 'uploads:read_many', roles: ADMIN },
    upload: { key: 'uploads:upload', roles: ADMIN },
    create: { key: 'uploads:create', roles: ADMIN },
    update: { key: 'uploads:update', roles: ADMIN },
    delete: { key: 'uploads:delete', roles: ADMIN },
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
