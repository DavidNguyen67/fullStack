import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Schedule } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async isAvailableSchedule(doctorId: number, date: Date): Promise<boolean> {
    try {
      const schedule = await this.prisma.schedule.findMany({
        where: {
          doctorId,
        },
      });
      if (schedule.length < 0) return true;
      schedule.forEach((item: Schedule) => {
        console.log('====================================');
        console.log(
          item.date === date,
          `item.date: ${item.date}, date: ${date}`,
        );
        console.log('====================================');
      });
      return false;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createScheDule(payload: Schedule[]) {
    try {
      for (const item of payload) {
        await this.isAvailableSchedule(item.doctorId, item.date);
      }
      const schedule = await this.prisma.schedule.createMany({
        data: payload,
        skipDuplicates: true,
      });
      const { count } = schedule;
      if (count < 1) {
        throw new HttpException(
          'No schedules were created. Check your input data.',
          HttpStatus.BAD_REQUEST,
        );
      }
      return schedule;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
