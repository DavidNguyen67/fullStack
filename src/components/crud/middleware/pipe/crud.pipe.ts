import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CrudPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log('This is pipe');
    return value;
  }
}
