import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.useStaticAssets(join(__dirname, '..', 'uploads', 'products'), {
    prefix: '/uploads/products/',
  });
  // Enable CORS for frontend origin
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3001',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 8081);
}
bootstrap();
