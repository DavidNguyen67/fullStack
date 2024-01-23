import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { hasNumber } from 'src/utils/function';

@Injectable()
export class IsIdHasNumberInStringPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata): any {
    try {
      const { id } = value;
      if (id.some((item: string) => hasNumber(item))) return value;
      throw new HttpException(
        'Missing number parameter from IsHasNumberInStringPipe',
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
