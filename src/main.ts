import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes';
import { CORS_OPTIONS } from 'mainconfig';
import { SensitiveDataInterceptor } from './interceptors/sensitive-data.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(CORS_OPTIONS);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new SensitiveDataInterceptor());
  await app.listen(3000);
}
bootstrap();
