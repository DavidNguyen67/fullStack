import { Module } from '@nestjs/common';
import { AppController } from './middleware/controllers/app.controller';
import { AppService } from './middleware/services/app.service';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot({
  envFilePath: './.env',
});
@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
