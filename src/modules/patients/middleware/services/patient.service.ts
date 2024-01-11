import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async PatientBookAppointments(payload) {
    try {
      payload = { ...payload, updateAt: new Date() };
      payload.id && delete payload.id;
      const patient = await this.prisma.user.upsert({
        where: {
          email: payload.email,
        },
        update: {},
        create: payload,
      });
      if (patient) {
        const appointments = await this.prisma.booking.createMany({
          data: payload,
          skipDuplicates: true,
        });
        if (appointments.count < 1) {
          throw new HttpException(
            'No schedules were created. Check your input data.',
            HttpStatus.BAD_REQUEST,
          );
        }
        return appointments;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
