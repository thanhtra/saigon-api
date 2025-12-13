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
import { DiscoveriesModule } from './modules/discoveries/discoveries.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { LandsModule } from './modules/lands/lands.module';
import { ImagesModule } from './modules/images/images.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { CollaboratorsModule } from './modules/collaborator/collaborators.module';

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
      }
      // exclude: ['/api*'],
    }),
    // ThrottlerModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     ttl: configService.get<number>('throttleTtl'),
    //     limit: configService.get<number>('throttleLimit'),
    //   }),
    // }),
    AuthModule,
    CategoriesModule,
    DiscoveriesModule,
    LandsModule,
    ImagesModule,
    ProductsModule,
    OrdersModule,
    AddressesModule,
    CollaboratorsModule
  ],
  controllers: [AppController],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
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
