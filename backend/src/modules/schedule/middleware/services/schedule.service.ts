import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as _ from 'lodash';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async isAvailableSchedule(item: any, payload: any[]): Promise<any> {
    try {
      const schedule = await this.prisma.schedule.findMany({
        where: {
          AND: [
            {
              doctorId: item.doctorId,
              date: new Date(item.date),
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

  async createSchedule(payload: any) {
    try {
      const deleteResult = await this.prisma.schedule.deleteMany({
        where: {
          doctorId: payload.doctorId,
          date: new Date(payload.date),
        },
      });

      if (deleteResult) {
        const resultArray = payload.timeType.map((timeType: string) => ({
          date: new Date(payload.date),
          doctorId: payload.doctorId,
          timeType: timeType,
          maxNum: payload.maxNum,
        }));

        if (resultArray.length > 0) {
          const records = await this.prisma.schedule.createMany({
            data: resultArray,
            skipDuplicates: true,
          });

          if (records) {
            return records;
          } else {
            throw new HttpException(
              'No records were created',
              HttpStatus.BAD_REQUEST,
            );
          }
        }
      }

      throw new HttpException('Delete got error', HttpStatus.BAD_REQUEST);
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
