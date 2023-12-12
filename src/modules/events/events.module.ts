import { Module } from '@nestjs/common';
import { EventsService } from './middleware/events.service';
import { EventsController } from './middleware/events.controller';

@Module({
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
