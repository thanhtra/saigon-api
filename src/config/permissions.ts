import * as _ from 'lodash';
import { UserRole } from 'src/common/helpers/enum';


export const PERMISSIONS = {
  users: {
    read_many: {
      key: 'users:read_many',
      roles: [UserRole.Admin]
    },
    read_one: {
      key: 'users:read_one',
      roles: [UserRole.Admin]
    },
    create: {
      key: 'users:create',
      roles: [UserRole.Admin]
    },
    update: {
      key: 'users:update',
      roles: [UserRole.Admin]
    },
    delete: {
      key: 'users:delete',
      roles: [UserRole.Admin]
    },
    logout: {
      key: 'users:logout',
      roles: [UserRole.Admin]
    }
  },
  collaborators: {
    read_many: {
      key: 'collaborators:read_many',
      roles: [UserRole.Admin]
    },
    read_one: {
      key: 'collaborators:read_one',
      roles: [UserRole.Admin]
    },
    create: {
      key: 'collaborators:create',
      roles: [UserRole.Admin]
    },
    update: {
      key: 'collaborators:update',
      roles: [UserRole.Admin]
    },
    delete: {
      key: 'collaborators:delete',
      roles: [UserRole.Admin]
    },
    logout: {
      key: 'collaborators:logout',
      roles: [UserRole.Admin]
    }
  },
  bookings: {
    read: {
      key: 'bookings:read',
      roles: [UserRole.Admin]
    },
    create: {
      key: 'bookings:create',
      roles: [UserRole.Admin]
    },
    update: {
      key: 'bookings:update',
      roles: [UserRole.Admin]
    },
    delete: {
      key: 'bookings:delete',
      roles: [UserRole.Admin]
    },
  },
  rentals: {
    read_many: {
      key: 'rentals:read_many',
      roles: [UserRole.Admin]
    },
    read_one: {
      key: 'rentals:read_one',
      roles: [UserRole.Admin]
    },
    read: {
      key: 'rentals:read',
      roles: [UserRole.Admin]
    },
    read_admin: {
      key: 'rentals:read_admin',
      roles: [UserRole.Admin]
    },
    create: {
      key: 'rentals:create',
      roles: [UserRole.Admin]
    },
    update: {
      key: 'rentals:update',
      roles: [UserRole.Admin]
    },
    delete: {
      key: 'rentals:delete',
      roles: [UserRole.Admin]
    },
  },
  rooms: {
    read_one: {
      key: 'rooms:read_one',
      roles: [UserRole.Admin]
    },
    read_many: {
      key: 'rooms:read_many',
      roles: [UserRole.Admin]
    },
    read: {
      key: 'rooms:read',
      roles: [UserRole.Admin]
    },
    create: {
      key: 'rooms:create',
      roles: [UserRole.Admin]
    },
    update: {
      key: 'rooms:update',
      roles: [UserRole.Admin]
    },
    delete: {
      key: 'rooms:delete',
      roles: [UserRole.Admin]
    },
  },
  commissions: {
    read_one: {
      key: 'commissions:read_one',
      roles: [UserRole.Admin]
    },
    read_many: {
      key: 'commissions:read_many',
      roles: [UserRole.Admin]
    },
    read: {
      key: 'commissions:read',
      roles: [UserRole.Admin]
    },
    create: {
      key: 'commissions:create',
      roles: [UserRole.Admin]
    },
    update: {
      key: 'commissions:update',
      roles: [UserRole.Admin]
    },
    delete: {
      key: 'commissions:delete',
      roles: [UserRole.Admin]
    },
  },
  tenants: {
    read: {
      key: 'tenants:read',
      roles: [UserRole.Admin]
    },
    read_many: {
      key: 'tenants:read_many',
      roles: [UserRole.Admin]
    },
    read_one: {
      key: 'tenants:read_one',
      roles: [UserRole.Admin]
    },
    create: {
      key: 'tenants:create',
      roles: [UserRole.Admin]
    },
    update: {
      key: 'tenants:update',
      roles: [UserRole.Admin]
    },
    delete: {
      key: 'tenants:delete',
      roles: [UserRole.Admin]
    },
  },
  contracts: {
    read: {
      key: 'contracts:read',
      roles: [UserRole.Admin]
    },
    read_many: {
      key: 'contracts:read_many',
      roles: [UserRole.Admin]
    },
    read_one: {
      key: 'contracts:read_one',
      roles: [UserRole.Admin]
    },
    create: {
      key: 'contracts:create',
      roles: [UserRole.Admin]
    },
    update: {
      key: 'contracts:update',
      roles: [UserRole.Admin]
    },
    delete: {
      key: 'contracts:delete',
      roles: [UserRole.Admin]
    },
  },
  uploads: {
    update: {
      key: 'uploads:update',
      roles: [UserRole.Admin]
    },
    read: {
      key: 'uploads:read',
      roles: [UserRole.Admin]
    },
    uploads: {
      key: 'uploads:uploads',
      roles: [UserRole.Admin]
    },
    create: {
      key: 'uploads:create',
      roles: [UserRole.Admin]
    },
    delete: {
      key: 'uploads:delete',
      roles: [UserRole.Admin]
    },
  },
  categories: {
    read: {
      key: 'categories:read',
      roles: [UserRole.Admin]
    },
    create: {
      key: 'categories:create',
      roles: [UserRole.Admin]
    },
    update: {
      key: 'categories:update',
      roles: [UserRole.Admin]
    },
    delete: {
      key: 'categories:delete',
      roles: [UserRole.Admin]
    },
  },
  discoveries: {
    read: {
      key: 'discoveries:read',
      roles: [UserRole.Admin]
    },
    create: {
      key: 'discoveries:create',
      roles: [UserRole.Admin]
    },
    update: {
      key: 'discoveries:update',
      roles: [UserRole.Admin]
    },
    delete: {
      key: 'discoveries:delete',
      roles: [UserRole.Admin]
    },
  },
  lands: {
    read: {
      key: 'lands:read',
      roles: [UserRole.Admin]
    },
    read_admin: {
      key: 'lands:read_admin',
      roles: [UserRole.Admin]
    },
    create: {
      key: 'lands:create',
      roles: [UserRole.Admin]
    },
    update: {
      key: 'lands:update',
      roles: [UserRole.Admin]
    },
    delete: {
      key: 'lands:delete',
      roles: [UserRole.Admin]
    },
    customer_create: {
      key: 'lands:customer_create',
      roles: [UserRole.Admin]
    },
    remove_my_post: {
      key: 'lands:remove_my_post',
      roles: [UserRole.Admin]
    },
  },
  orders: {
    read: {
      key: 'orders:read',
      roles: [UserRole.Admin]
    },
    create: {
      key: 'orders:create',
      roles: [UserRole.Admin]
    },
    update: {
      key: 'orders:update',
      roles: [UserRole.Admin]
    },
    delete: {
      key: 'orders:delete',
      roles: [UserRole.Admin]
    },
  },
  products: {
    read: {
      key: 'products:read',
      roles: [UserRole.Admin]
    },
    create: {
      key: 'products:create',
      roles: [UserRole.Admin]
    },
    update: {
      key: 'products:update',
      roles: [UserRole.Admin]
    },
    delete: {
      key: 'products:delete',
      roles: [UserRole.Admin]
    },
    get_my_post: {
      key: 'products:get_my_post',
      roles: [UserRole.Admin]
    },
    customer_create: {
      key: 'products:customer_create',
      roles: [UserRole.Admin]
    },
    remove_my_post: {
      key: 'products:remove_my_post',
      roles: [UserRole.Admin]
    },
  },
  addresses: {
    read: {
      key: 'addresses:read',
      roles: [UserRole.Admin]
    },
    create: {
      key: 'addresses:create',
      roles: [UserRole.Admin]
    },
    update: {
      key: 'addresses:update',
      roles: [UserRole.Admin]
    },
    delete: {
      key: 'addresses:delete',
      roles: [UserRole.Admin]
    },
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
