import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import databaseConfig from 'src/config/database.config';
import { AuthModule } from '../auth/auth.module';
import { CrudModule } from '../crudUser/crud.module';
import { allCodeModule } from '../allCode/allCode.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TimeoutInterceptor } from 'src/utils/interceptor/timeout.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration, databaseConfig],
    }),
    AuthModule,
    CrudModule,
    allCodeModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
  ],
})
export class AppModule {}