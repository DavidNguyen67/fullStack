import {
  Injectable,
  PipeTransform,
  InternalServerErrorException,
} from '@nestjs/common';
import { error } from 'console';

@Injectable()
export class TimeStampToDatePipe implements PipeTransform {
  transform(value: any): any {
    try {
      const schedules = Array.isArray(value) ? value : [value];
      schedules.forEach((item) => {
        const timestampString = item.date;
        const timestamp = parseInt(timestampString); // Convert string to number
        const date = new Date(timestamp);
        item.date && (item.date = date);
      });

      if (schedules.length > 0) return schedules;
      throw new error('Conversion failed');
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
