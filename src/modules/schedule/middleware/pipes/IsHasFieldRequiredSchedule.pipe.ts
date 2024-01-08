import {
  Injectable,
  PipeTransform,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Schedule } from '@prisma/client';
import { env } from 'process';

@Injectable()
export class IsHasFieldRequiredSchedulePipe implements PipeTransform {
  transform(value: any): any {
    try {
      const schedules = Array.isArray(value) ? value : [value];

      const isValid = schedules.every((item: Schedule) => {
        item.maxNum = item.maxNum ? item.maxNum : +env.MAX_NUMBER_SCHEDULES;
        return this.hasRequiredFields(item);
      });

      if (!isValid) {
        const missingFields = 'date, timeType, doctorId';
        const errorMessage = `Missing required params: ${missingFields}`;
        throw new BadRequestException(errorMessage);
      }

      return schedules;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  private hasRequiredFields(schedule: Schedule): boolean {
    return !!schedule.date && !!schedule.timeType && !!schedule.doctorId;
  }
}
