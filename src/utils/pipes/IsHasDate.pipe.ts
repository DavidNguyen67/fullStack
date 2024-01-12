import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class IsHasDatePipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata): any {
    try {
      if (Array.isArray(value)) {
        const result = value.filter((val) => val.date);
        if (result.length > 0) return result;
      }
      const { date } = value;
      if (date) {
        return Array.isArray(value) ? value : [value];
      }
      throw new HttpException(
        'Missing parameter from IsHasDatePipe',
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
