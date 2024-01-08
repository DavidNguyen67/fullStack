import {
  Injectable,
  PipeTransform,
  InternalServerErrorException,
} from '@nestjs/common';
import { Schedule } from '@prisma/client';
import { error } from 'console';
import { BookScheduleDto } from 'src/utils/dto/schedule.dto';

@Injectable()
export class HandleRawDataPipe implements PipeTransform {
  transform(value: any): any {
    try {
      let result: Schedule[] = [];
      const schedules: BookScheduleDto[] = Array.isArray(value)
        ? value
        : [value];
      schedules.forEach((item: any) => {
        if (item.timeType.length > 1) {
          item.timeType.forEach((time: any) => {
            result = [...result, { ...item, timeType: time }];
          });
          return;
        }
        if (item.timeType.length === 1) {
          result = [...result, { ...item, timeType: item.timeType[0] }];
          return;
        }
      });

      if (result.length > 0) return result;
      throw new error('Conversion failed');
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
