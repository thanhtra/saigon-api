import 'reflect-metadata';
import { DataSource } from 'typeorm';
import configuration from './src/config/configuration';

const config = configuration();

export default new DataSource({
    type: 'postgres',
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.name,

    entities: ['src/**/*.entity.ts'],
    migrations: ['src/migrations/*.ts'],
});
