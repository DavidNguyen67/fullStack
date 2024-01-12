import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async PatientBookAppointments({ patient, booking }) {
    try {
      const payloadUser = { ...patient };
      payloadUser.id && delete payloadUser.id;
      const userInfo = await this.prisma.user.upsert({
        where: {
          email: payloadUser.email,
        },
        update: {},
        create: {
          ...payloadUser,
        },
      });

      const payloadBooking = {
        ...booking,
        patientId: userInfo.id,
        updateAt: new Date(),
      };
      if (userInfo) {
        const appointments = await this.prisma.booking.upsert({
          where: {
            patientId: userInfo.id,
          },
          update: payloadBooking,
          create: payloadBooking,
        });
        if (!appointments) {
          throw new HttpException(
            'No schedules were created. Check your input data. allow to book but got error',
            HttpStatus.BAD_REQUEST,
          );
        }
        return appointments;
      }
      throw new HttpException(
        'No schedules were created. Not allow to book.',
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
