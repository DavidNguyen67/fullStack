import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { env } from 'process';
import { ValidationPipe } from '@nestjs/common';
import * as routes from './utils/routes';
import { TimeoutInterceptor } from './utils/interceptor/timeout.interceptor';
import { urlencoded, json } from 'express';

async function bootstrap() {
  try {
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
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
    app.useGlobalInterceptors(new TimeoutInterceptor());
    app.setGlobalPrefix(routes.GlobalPrefix);
    await app.listen(env.PORT || 3000);
  } catch (error) {
    console.log(error);
  }
}
bootstrap();
