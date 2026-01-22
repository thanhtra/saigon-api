import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import configuration from 'src/config/configuration';

// Modules
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { DatabaseModule } from './common/database/database.module';
import { UPLOAD_DIR } from './common/helpers/constants';
import { AppLoggerMiddleware } from './common/middlewares/appLogger.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { BookingsModule } from './modules/bookings/bookings.module';
import { CollaboratorsModule } from './modules/collaborators/collaborators.module';
import { CommissionsModule } from './modules/commissions/commissions.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { RentalsModule } from './modules/rentals/rentals.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { UsersModule } from './modules/users/users.module';


@Module({
  imports: [
    /* ================= CONFIG ================= */
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
      expandVariables: true,
      load: [configuration],
    }),

    /* ================= DATABASE ================= */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProd = config.get<boolean>('isProduction');

        return {
          type: 'postgres',
          timezone: 'Asia/Ho_Chi_Minh',
          host: config.get<string>('database.host'),
          port: config.get<number>('database.port'),
          username: config.get<string>('database.username'),
          password: config.get<string>('database.password'),
          database: config.get<string>('database.name'),

          autoLoadEntities: true,
          synchronize: false,
          migrationsRun: true,

          migrations: ['dist/migrations/*.js'],


          logging: !isProd,
          namingStrategy: new SnakeNamingStrategy(),

          extra: {
            max: config.get<number>('database.maxPool'),
            min: config.get<number>('database.minPool'),
          },

          ssl: config.get<boolean>('database.ssl')
            ? { rejectUnauthorized: false }
            : false,
        };
      },
    }),

    ServeStaticModule.forRoot({
      rootPath: UPLOAD_DIR,
      serveRoot: '/uploads',

      exclude: ['/api*'],

      serveStaticOptions: {
        index: false,
        redirect: false,

        maxAge: '30d',
        etag: true,
        lastModified: true,

        setHeaders: (res, path) => {
          res.setHeader('X-Content-Type-Options', 'nosniff');
          res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
          res.setHeader('Cache-Control', 'public, max-age=2592000');
        },
      },
    }),

    /* ================= THROTTLE ================= */
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get<number>('throttle.ttl'),
        limit: config.get<number>('throttle.limit'),
      }),
    }),

    /* ================= BUSINESS MODULES ================= */
    DatabaseModule,
    AuthModule,
    UsersModule,
    UploadsModule,
    TenantsModule,
    RoomsModule,
    RentalsModule,
    ContractsModule,
    CommissionsModule,
    CollaboratorsModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    }
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}