import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import Helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/respone.interceptor';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';

async function bootstrap() {
  try {

    console.log('========== A ==========');

    const app = await NestFactory.create<NestExpressApplication>(
      AppModule,
      {
        logger:
          process.env.NODE_ENV === 'production'
            ? ['error', 'warn', 'log']
            : ['debug', 'log', 'warn', 'error'],
      },
    );

    console.log('========== B ==========');

    const configService = app.get(ConfigService);

    console.log('========== C ==========');

    // ✅ BẮT BUỘC khi chạy sau Nginx / HTTPS
    app.set('trust proxy', 1);

    app.use(
      Helmet({
        crossOriginResourcePolicy: false,
      }),
    );

    app.use(cookieParser());

    app.enableCors({
      origin: [
        configService.get<string>('frontend.adminUrl'),
        configService.get<string>('frontend.customerUrl'),
      ].filter(Boolean),
      credentials: true,
    });

    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));

    app.setGlobalPrefix('api');

    app.useGlobalInterceptors(
      new TransformInterceptor(),
      new ClassSerializerInterceptor(app.get(Reflector)),
    );

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    console.log('========== D ==========');

    if (configService.get('nodeEnv') !== 'production') {
      const swaggerConfig = new DocumentBuilder()
        .setTitle(configService.get('projectName'))
        .setVersion('1.0')
        .addBearerAuth()
        .build();

      const document = SwaggerModule.createDocument(app, swaggerConfig);
      SwaggerModule.setup('docs', app, document);
    }

    console.log('========== E ==========');

    const port = configService.get<number>('port');

    console.log('PORT =', port);

    await app.listen(port, '0.0.0.0');

    console.log('========== G ==========');

    console.log(`🚀 API running on port ${port}`);
  } catch (e) {
    console.error('BOOTSTRAP ERROR');
    console.error(e);
  }
}

bootstrap();
