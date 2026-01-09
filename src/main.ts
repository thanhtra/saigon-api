import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import Helmet from 'helmet';
import * as bodyParser from 'body-parser';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/respone.interceptor';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });

  const configService = app.get(ConfigService);

  /**
   * ---------------- SECURITY ----------------
   */
  app.use(
    Helmet({
      crossOriginResourcePolicy: false,
    }),
  );

  app.use(cookieParser());

  /**
   * ---------------- CORS (🔥 QUAN TRỌNG) ----------------
   */
  app.enableCors({
    origin: [
      configService.get<string>('frontend.adminUrl'),
      configService.get<string>('frontend.customerUrl'),
    ],
    credentials: true,
  });

  /**
   * ---------------- BODY ----------------
   */
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  /**
   * ---------------- GLOBAL ----------------
   */
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

  /**
   * ---------------- SWAGGER ----------------
   */
  const swaggerConfig = new DocumentBuilder()
    .setTitle(
      `${configService.get('projectName')} - ${configService.get('nodeEnv')}`,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  /**
   * ---------------- START ----------------
   */
  const port = configService.get<number>('port');
  await app.listen(port);

  console.log(`🚀 API running on port ${port}`);
}

bootstrap();
