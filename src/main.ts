import { NestFactory } from '@nestjs/core';
import { AppModule } from './components/app/app.module';
import { env } from 'process';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(env.PORT || 3001);
}
bootstrap();
