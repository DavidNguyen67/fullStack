import {
  Injectable,
  PipeTransform,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { env } from 'process';

@Injectable()
export class IsHasFieldRequiredSchedulePipe implements PipeTransform {
  transform(value: any): any {
    try {
      const schedules = Array.isArray(value) ? value : [value];

      const isValid = schedules.every((item: any) => {
        item.maxNum = item.maxNum ? item.maxNum : +env.MAX_NUMBER_SCHEDULES;
        return this.hasRequiredFields(item);
      });

      if (!isValid) {
        const missingFields = 'date, timeType, doctorId';
        const errorMessage = `Missing required params: ${missingFields}`;
        throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
      }

      return schedules;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private hasRequiredFields(schedule: any): boolean {
    return !!schedule.date && !!schedule.timeType && !!schedule.doctorId;
  }
}
