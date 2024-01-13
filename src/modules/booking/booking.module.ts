import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingController } from './middleware/controllers/booking.controller';
import { BookingService } from './middleware/services/booking.service';

@Module({
  providers: [PrismaService, BookingService],
  controllers: [BookingController],
})
export class BookingModule {}