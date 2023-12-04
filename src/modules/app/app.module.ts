import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './middleware/controllers/app.controller';
import { AppService } from './middleware/services/app.service';
import { ConfigModule } from '@nestjs/config';
import { CrudModule } from '../crud/crud.module';
import { APP_PIPE } from '@nestjs/core';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './.env',
    }),
    CrudModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    AppService,
  ],
})
export class AppModule {}
