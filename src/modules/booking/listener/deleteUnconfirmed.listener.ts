import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DeleteUnconfirmedEvent } from '../events/deleteUnconfirmed.event';
import { PrismaService } from 'src/prisma/prisma.service';
import { STATUS_NEW } from '../../../utils/constants/statusId';

@Injectable()
export class DeleteUnconfirmedListener {
  constructor(private prisma: PrismaService) {}

  @OnEvent('delete', { async: true })
  async handleDeleteUnconfirmedEvent(event: DeleteUnconfirmedEvent) {
    try {
      const booking = await this.prisma.booking.delete({
        where: {
          DateAppointment: event.dateAppointment,
          doctorId: event.doctorId,
          patientId: event.patientId,
          timeType: event.timeType,
          statusId: STATUS_NEW,
        },
      });

      if (booking) {
        console.log('delete', event);

        return booking;
      }
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
