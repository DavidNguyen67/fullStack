import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { excludeAndNullVal } from 'src/utils/function';

@Injectable()
export class ExcludeIdFieldPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata): any {
    try {
      value = Array.isArray(value.payload) ? value.payload : value;
      if (!Array.isArray(value)) value = [value];

      const data = value.map((val) => {
        if (typeof val === 'string') {
          const parsedData = JSON.parse(val);
          return excludeAndNullVal(parsedData, ['id']);
        } else {
          return excludeAndNullVal(val, ['id']);
        }
      });
      if (data.length > 0) return data;
      throw new BadRequestException('Validate failed');
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
