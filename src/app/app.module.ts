import { Module } from '@nestjs/common';
import { AppController } from './middleware/controllers/app.controller';
import { AppService } from './middleware/services/app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
