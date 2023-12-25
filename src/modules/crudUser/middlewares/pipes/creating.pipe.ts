import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { exclude } from 'src/utils/function';

@Injectable()
export class excludeIdFieldPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata): any {
    const data = value.map((val) => exclude(val, ['id']));

    return data;
  }
}
