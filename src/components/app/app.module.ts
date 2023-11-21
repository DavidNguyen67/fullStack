import { Module } from '@nestjs/common';
import { AppController } from './middleware/controllers/app.controller';
import { AppService } from './middleware/services/app.service';
import { ConfigModule } from '@nestjs/config';
import { CrudModule } from '../crud/crud.module';

ConfigModule.forRoot({
  envFilePath: './.env',
});
@Module({
  imports: [ConfigModule.forRoot(), CrudModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
