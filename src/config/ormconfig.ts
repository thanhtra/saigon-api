const SnakeNamingStrategy =
    require('typeorm-naming-strategies').SnakeNamingStrategy;

import { User } from '../modules/users/entities/user.entity';
import { Category } from '../modules/categories/entities/category.entity';
import { DataSourceOptions } from 'typeorm';
import { Land } from 'src/modules/lands/entities/land.entity';
import { Image } from 'src/modules/images/entities/image.entity';
import { Discovery } from 'src/modules/discoveries/entities/discovery.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Address } from 'src/modules/addresses/entities/address.entity';
import { Collaborator } from 'src/modules/collaborator/entities/collaborator.entity';


const config: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE_NAME,
    entities: [Category, User, Land, Image, Discovery, Product, Order, Address, Collaborator],
    // entities: ["dist/**/**.entity{.ts,.js}"],
    synchronize: true,
    namingStrategy: new SnakeNamingStrategy(),
}


export default config;