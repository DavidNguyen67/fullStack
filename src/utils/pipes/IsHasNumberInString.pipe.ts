import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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
      throw new BadRequestException(
        'Missing number parameter from IsHasNumberInStringPipe',
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
