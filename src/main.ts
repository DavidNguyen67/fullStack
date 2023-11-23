import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { env } from 'process';
// import { CrudGuard } from './components/crud/middleware/guards/crud.guard';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  (await app).useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  // app.useGlobalGuards(new CrudGuard());
  await app.listen(env.PORT || 3001);
}
bootstrap();
