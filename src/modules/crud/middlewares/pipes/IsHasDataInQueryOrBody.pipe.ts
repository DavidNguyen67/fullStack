import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { isEmpty } from 'src/utils/function';

@Injectable()
export class IsHasDataInQueryOrBodyPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    try {
      const { type } = metadata;

      if (type === 'query') {
        if (!isEmpty(value)) {
          return value;
        }
      }

      if (type === 'body') {
        if (!isEmpty(value)) {
          return value;
        }
      }

      throw new BadRequestException(
        'Missing or invalid parameters from IsHasDataInQueryOrBodyPipe',
      );
    } catch (error) {
      console.log(error);
    }
  }
}
