import {
  Injectable,
  InternalServerErrorException,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class CrudPipe implements PipeTransform {
  transform(value?: { page: number | string; take: number | string }) {
    try {
      if (typeof value?.page === 'string') {
        const parsedPage = parseInt(value.page, 10);
        if (!isNaN(parsedPage)) {
          value.page = parsedPage;
        } else {
          throw new InternalServerErrorException('Invalid page value');
        }
      }

      if (typeof value?.take === 'string') {
        const parsedTake = parseInt(value.take, 10);
        if (!isNaN(parsedTake)) {
          value.take = parsedTake;
        } else {
          throw new InternalServerErrorException('Invalid take value');
        }
      }

      return value;
    } catch (error) {
      throw new InternalServerErrorException('InternalServerErrorException');
    }
  }
}
