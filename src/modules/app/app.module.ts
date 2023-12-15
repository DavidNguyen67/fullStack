import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import databaseConfig from 'src/config/database.config';
import { AuthModule } from '../auth/auth.module';
import { CrudModule } from '../crud/crud.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration, databaseConfig],
    }),
    AuthModule,
    CrudModule,
  ],
})
export class AppModule {}
