import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import * as path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

const config: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASS || 'postgres',
    database: process.env.DATABASE_NAME || 'mydb',

    // Entities
    entities: [path.join(__dirname, '..', 'modules', '**', '*.entity.{ts,js}')],

    // Migrations
    migrations: [path.join(__dirname, '..', 'migrations', '*.{ts,js}')],

    // Synchronize: chỉ bật dev
    synchronize: !isProduction,

    // Logging: chỉ dev
    logging: !isProduction,

    // Snake case strategy
    namingStrategy: new SnakeNamingStrategy(),

    // Optional: connection pool
    extra: {
        max: Number(process.env.DATABASE_MAX_POOL) || 10,
        min: Number(process.env.DATABASE_MIN_POOL) || 1,
    },
};

export default config;
