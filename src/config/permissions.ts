import * as _ from 'lodash';
import { UserRoles } from './userRoles';

export const PERMISSIONS = {
  categories: {
    read: {
      key: 'categories:read',
      roles: [
        UserRoles.Admin
      ],
    },
    create: {
      key: 'categories:create',
      roles: [
        UserRoles.Admin
      ],
    },
    update: {
      key: 'categories:update',
      roles: [
        UserRoles.Admin
      ],
    },
    delete: {
      key: 'categories:delete',
      roles: [
        UserRoles.Admin
      ],
    },
    enums: {
      key: 'categories:enums',
      roles: [
        UserRoles.Admin
      ],
    },
  },
  discoveries: {
    read: {
      key: 'discoveries:read',
      roles: [
        UserRoles.Admin,
        UserRoles.User,
      ],
    },
    create: {
      key: 'discoveries:create',
      roles: [UserRoles.Admin],
    },
    update: {
      key: 'discoveries:update',
      roles: [
        UserRoles.Admin,
      ],
    },
    delete: {
      key: 'discoveries:delete',
      roles: [UserRoles.Admin],
    },
    enums: {
      key: 'discoveries:enums',
      roles: [
        UserRoles.Admin,
      ],
    },
  },
  lands: {
    read: {
      key: 'lands:read',
      roles: [
        UserRoles.Admin,
        UserRoles.User,
      ],
    },
    read_admin: {
      key: 'lands:read_admin',
      roles: [
        UserRoles.Admin
      ],
    },
    create: {
      key: 'lands:create',
      roles: [
        UserRoles.Admin,
      ],
    },
    update: {
      key: 'lands:update',
      roles: [
        UserRoles.Admin,
      ],
    },
    delete: {
      key: 'lands:delete',
      roles: [UserRoles.Admin],
    },
    enums: {
      key: 'lands:enums',
      roles: [UserRoles.Admin],
    },
    customer_create: {
      key: 'lands:customer_create',
      roles: [
        UserRoles.Admin,
        UserRoles.User
      ],
    },
    remove_my_post: {
      key: 'lands:remove_my_post',
      roles: [
        UserRoles.Admin,
        UserRoles.User
      ],
    },
  },
  orders: {
    read: {
      key: 'orders:read',
      roles: [
        UserRoles.Admin,
        UserRoles.User,
      ],
    },
    create: {
      key: 'orders:create',
      roles: [
        UserRoles.Admin,
        UserRoles.User
      ],
    },
    update: {
      key: 'orders:update',
      roles: [
        UserRoles.Admin,
        UserRoles.User,
      ],
    },
    delete: {
      key: 'orders:delete',
      roles: [UserRoles.Admin],
    },
    enums: {
      key: 'orders:enums',
      roles: [UserRoles.Admin],
    },
  },
  products: {
    read: {
      key: 'products:read',
      roles: [
        UserRoles.Admin
      ],
    },
    create: {
      key: 'products:create',
      roles: [
        UserRoles.Admin,
      ],
    },
    update: {
      key: 'products:update',
      roles: [
        UserRoles.Admin,
      ],
    },
    delete: {
      key: 'products:delete',
      roles: [UserRoles.Admin],
    },
    enums: {
      key: 'products:enums',
      roles: [UserRoles.Admin],
    },
    get_my_post: {
      key: 'products:get_my_post',
      roles: [UserRoles.Admin, UserRoles.User],
    },
    customer_create: {
      key: 'products:customer_create',
      roles: [
        UserRoles.Admin,
        UserRoles.User
      ],
    },
    remove_my_post: {
      key: 'products:remove_my_post',
      roles: [
        UserRoles.Admin,
        UserRoles.User
      ],
    },
  },
  users: {
    read_many: {
      key: 'users:read_many',
      roles: [UserRoles.Admin],
    },
    read_one: {
      key: 'users:read_one',
      roles: [UserRoles.Admin, UserRoles.User],
    },
    enums: {
      key: 'users:enums',
      roles: [UserRoles.Admin],
    },
    create: {
      key: 'users:create',
      roles: [UserRoles.Admin],
    },
    update: {
      key: 'users:update',
      roles: [UserRoles.Admin, UserRoles.User],
    },
    delete: {
      key: 'users:delete',
      roles: [UserRoles.Admin],
    },
    logout: {
      key: 'users:logout',
      roles: [UserRoles.Admin, UserRoles.User],
    }
  },
  images: {
    uploads: {
      key: 'users:uploads',
      roles: [UserRoles.Admin, UserRoles.User],
    },
    create: {
      key: 'users:create',
      roles: [UserRoles.Admin],
    },
    delete: {
      key: 'users:delete',
      roles: [UserRoles.Admin, UserRoles.User],
    },
  },
  addresses: {
    read: {
      key: 'addresses:read',
      roles: [
        UserRoles.Admin,
        UserRoles.User,
      ],
    },
    create: {
      key: 'addresses:create',
      roles: [
        UserRoles.Admin,
        UserRoles.User,
      ],
    },
    update: {
      key: 'addresses:update',
      roles: [
        UserRoles.Admin,
        UserRoles.User,
      ],
    },
    delete: {
      key: 'addresses:delete',
      roles: [
        UserRoles.Admin,
        UserRoles.User,
      ],
    },
  },
  collaborators: {
    read_many: {
      key: 'collaborators:read_many',
      roles: [UserRoles.Admin],
    },
    read_one: {
      key: 'collaborators:read_one',
      roles: [UserRoles.Admin],
    },
    enums: {
      key: 'collaborators:enums',
      roles: [UserRoles.Admin],
    },
    create: {
      key: 'collaborators:create',
      roles: [UserRoles.Admin],
    },
    update: {
      key: 'collaborators:update',
      roles: [UserRoles.Admin],
    },
    delete: {
      key: 'collaborators:delete',
      roles: [UserRoles.Admin],
    },
    logout: {
      key: 'collaborators:logout',
      roles: [UserRoles.Admin],
    }
  }
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
