import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScheduleService } from './middleware/services/schedule.service';
import { ScheDuleController } from './middleware/controllers/schedule.controller';

@Module({
  providers: [ScheduleService, PrismaService],
  controllers: [ScheDuleController],
})
export class ScheduleModule {}
