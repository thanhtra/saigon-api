import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import Helmet from "helmet";
import * as bodyParser from 'body-parser';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ErrorInterceptor } from './common/interceptors/errorInterceptor.interceptor';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/respone.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error'],
  });

  // Security
  app.use(Helmet({ crossOriginResourcePolicy: false, }));
  app.enableCors();

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Disabling ETags to avoid caching issues
  app.getHttpAdapter().getInstance().set('etag', false);

  // Loading conf
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');

  // Swagger API docs
  const config = new DocumentBuilder()
    .setTitle(
      configService.get<string>('projectName') +
      ' - ' +
      configService.get<string>('nodeEnv'),
    )
    .setDescription('')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // app.useGlobalInterceptors(new ErrorInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Forces DTO to decorate each property with a validation decorator
      forbidNonWhitelisted: true, // prevents any non-declared DTO property
    }),
  );

  await app.listen(configService.get<number>('port'));
}
bootstrap();
