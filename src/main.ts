import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { env } from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(env.PORT || 3001);
}
bootstrap();
