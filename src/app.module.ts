import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { AppLoggerMiddleware } from './common/middlewares/appLogger.middleware';
import ormconfig from './config/ormconfig';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

//Module
import { AuthModule } from './modules/auth/auth.module';
import { CollaboratorsModule } from './modules/collaborators/collaborators.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { RentalsModule } from './modules/rentals/rentals.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { CommissionsModule } from './modules/commissions/commissions.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      // envFilePath: ['.env.staging'], // Use this field to override the default .env
      load: [configuration],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        redirect: false,
        index: false
      },
      exclude: ['/api*'],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get<number>('throttleTtl', 60),
        limit: configService.get<number>('throttleLimit', 50),
      }),
    }),

    AuthModule,
    UploadsModule,
    TenantsModule,
    RoomsModule,
    RentalsModule,
    ContractsModule,
    CommissionsModule,
    CollaboratorsModule
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
