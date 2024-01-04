import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { isEmpty } from 'src/utils/function';

@Injectable()
export class IsHasDataInQueryOrBodyPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    try {
      if (!value || isEmpty(value)) {
        throw new HttpException(
          'Missing or invalid parameters from IsHasDataInQueryOrBodyPipe',
          HttpStatus.BAD_REQUEST,
        );
      }

      return value;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
