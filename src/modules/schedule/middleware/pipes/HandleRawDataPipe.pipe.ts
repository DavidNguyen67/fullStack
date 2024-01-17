import {
  Injectable,
  PipeTransform,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class HandleRawDataPipe implements PipeTransform {
  transform(value: any): any {
    try {
      let schedules: any = Array.isArray(value) ? value : [value];
      [schedules] = schedules;

      if (schedules) return schedules;

      throw new BadRequestException('Conversion failed');
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
