import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { isEmpty } from 'src/utils/function';

@Injectable()
export class IsHasDataInQueryOrBodyPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    try {
      if (!value || isEmpty(value)) {
        return new BadRequestException(
          'Missing or invalid parameters from IsHasDataInQueryOrBodyPipe',
        );
      }

      return value;
    } catch (error) {
      console.log(error);
    }
  }
}
