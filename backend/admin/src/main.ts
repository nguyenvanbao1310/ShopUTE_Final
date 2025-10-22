import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser'; 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Enable CORS for frontend origin
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3001',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 8081);
}
bootstrap();
