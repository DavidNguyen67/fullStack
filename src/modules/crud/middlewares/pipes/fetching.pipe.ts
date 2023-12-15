import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class fetchingPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    try {
      const { id } = value;

      if (typeof id === 'string') {
        if (id.toLocaleLowerCase().trim() === 'all') {
          return { ...value, id: 'all' };
        }
        if (id) {
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
    } catch (error) {
      throw new BadRequestException('Missing parameter');
    }
  }
}
