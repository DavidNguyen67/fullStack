import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { env } from 'process';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    bodyParser: true,
  });
  app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }));
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(env.PORT || 3000);
}
bootstrap();
