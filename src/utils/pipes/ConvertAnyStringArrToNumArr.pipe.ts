import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  PipeTransform,
} from '@nestjs/common';
import { getMaxElement } from 'src/utils/function';

@Injectable()
export class convertAnyStringArrToNumArrPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata): any {
    try {
      if (Array.isArray(value)) {
        const result = value.filter((val) => val.id || val.limit);
        if (result.length > 0) return result;
      }
      const { id, limit } = value;
      if (id) {
        if (typeof id === 'string') {
          if (id.toLocaleLowerCase().trim() === 'all') {
            return { ...value, id: 'all' };
          }

          const uniqueValues = [
            ...new Set(
              id
                .replaceAll(/[^-\.\d]|[-.](?!\d)|(?<=\d)(?=-)/g, '_')
                .split('_')
                .filter((result) => result),
            ),
          ];
          return { ...value, id: uniqueValues };
        }
      }
      if (limit) {
        if (typeof limit === 'string') {
          const uniqueValues = [
            ...new Set(
              limit
                .replaceAll(/[^-\.\d]|[-.](?!\d)|(?<=\d)(?=-)/g, '_')
                .split('_')
                .filter((result) => result),
            ),
          ];
          let limitRecord: number = +uniqueValues[0];
          if (uniqueValues.length > 1) {
            limitRecord = getMaxElement(uniqueValues);
          }
          return {
            ...value,
            limit: limitRecord,
          };
        }
      }

      throw new BadRequestException(
        'Missing parameter from convertAnyStringArrToNumArrPipe',
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
