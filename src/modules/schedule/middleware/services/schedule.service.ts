import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Schedule } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as _ from 'lodash';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async isAvailableSchedule(item: Schedule, payload: Schedule[]): Promise<any> {
    try {
      const schedule = await this.prisma.schedule.findMany({
        where: {
          AND: [
            {
              doctorId: item.doctorId,
              date: item.date,
            },
          ],
        },
        select: {
          date: true,
          doctorId: true,
          timeType: true,
          maxNum: true,
        },
      });

      if (schedule.length < 1) return payload;

      schedule.forEach((item) => {
        item['timeStamp'] = item.date.getTime();
        delete item.date;
      });

      const copyPayload = _.cloneDeep(payload); // Use _.cloneDeep() for deep cloning
      copyPayload.forEach((item: any) => {
        item['timeStamp'] = Date.parse(item.date);
        item.date && delete item.date;
      });
      const dif = _.differenceWith(copyPayload, schedule, _.isEqual);

      if (dif.length > 0) return dif;
      return [];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async createSchedule(payload: Schedule[]) {
    try {
      let data = [];
      let isValid = false;
      const date = payload[0].date;

      for (const item of payload) {
        const result = await this.isAvailableSchedule(item, payload);
        if (result.length > 0) {
          data = result;
        }
      }
      if (!isValid && data.length > 0) {
        isValid = true;
      }
      if (isValid) {
        data.forEach((item) => {
          item.timeStamp && delete item.timeStamp;
          item.date = date;
        });
        const schedule = await this.prisma.schedule.createMany({
          data: data,
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
      }
      throw new HttpException('Duplicate schedules', HttpStatus.CONFLICT);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getSchedule(doctorId: number, date: any) {
    try {
      const schedules = await this.prisma.schedule.findMany({
        where: {
          doctorId,
          date,
        },
        include: {
          time: {
            select: {
              valueEn: true,
              valueVi: true,
            },
          },
        },
      });
      if (schedules.length > 1) {
        return schedules.map((item) => {
          const result: any = _.cloneDeep(item);
          result.createAt && delete result.createAt;
          result.updateAt && delete result.updateAt;
          result.date &&
            (result.date = Math.floor(new Date(item.date).getTime() / 1000));
          return result;
        });
      }
      return schedules;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
