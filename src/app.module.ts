import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import configuration from './config/configuration';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { CollaboratorsModule } from './modules/collaborators/collaborators.module';
import { CommissionsModule } from './modules/commissions/commissions.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { RentalsModule } from './modules/rentals/rentals.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { UsersModule } from './modules/users/users.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

const UPLOAD_DIR = join(process.cwd(), 'uploads');

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
          host: config.get<string>('database.host'),
          port: config.get<number>('database.port'),
          username: config.get<string>('database.username'),
          password: config.get<string>('database.password'),
          database: config.get<string>('database.name'),

          autoLoadEntities: true,
          synchronize: !isProd,
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
        ttl: config.get<number>('throttle.ttl', 60),
        limit: config.get<number>('throttle.limit', 10),
      }),
    }),

    /* ================= BUSINESS MODULES ================= */
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
})
export class AppModule { }



// import { Module, MiddlewareConsumer } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import configuration from './config/configuration';
// import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
// import { APP_GUARD } from '@nestjs/core';
// import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
// import { AppLoggerMiddleware } from './common/middlewares/appLogger.middleware';
// import ormconfig from './config/ormconfig';

// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';

// //Module
// import { AuthModule } from './modules/auth/auth.module';
// import { CollaboratorsModule } from './modules/collaborators/collaborators.module';
// import { UploadsModule } from './modules/uploads/uploads.module';
// import { TenantsModule } from './modules/tenants/tenants.module';
// import { RoomsModule } from './modules/rooms/rooms.module';
// import { RentalsModule } from './modules/rentals/rentals.module';
// import { ContractsModule } from './modules/contracts/contracts.module';
// import { CommissionsModule } from './modules/commissions/commissions.module';

// @Module({
//   imports: [
//     TypeOrmModule.forRoot(ormconfig),
//     ConfigModule.forRoot({
//       isGlobal: true,
//       cache: true,
//       expandVariables: true,
//       // envFilePath: ['.env.staging'], // Use this field to override the default .env
//       load: [configuration],
//     }),
//     ServeStaticModule.forRoot({
//       rootPath: join(__dirname, '..', 'uploads'),
//       serveRoot: '/uploads',
//       serveStaticOptions: {
//         redirect: false,
//         index: false
//       },
//       exclude: ['/api*'],
//     }),
//     ThrottlerModule.forRootAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) => ({
//         ttl: configService.get<number>('throttleTtl', 60),
//         limit: configService.get<number>('throttleLimit', 50),
//       }),
//     }),

//     AuthModule,
//     UploadsModule,
//     TenantsModule,
//     RoomsModule,
//     RentalsModule,
//     ContractsModule,
//     CommissionsModule,
//     CollaboratorsModule
//   ],
//   controllers: [AppController],
//   providers: [
//     {
//       provide: APP_GUARD,
//       useClass: ThrottlerGuard,
//     },
//     {
//       provide: APP_GUARD,
//       useClass: JwtAuthGuard,
//     }
//   ],


// })

// export class AppModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(AppLoggerMiddleware).forRoutes('*');
//   }
// }
