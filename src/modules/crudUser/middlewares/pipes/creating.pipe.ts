import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { excludeAndNullVal } from 'src/utils/function';

@Injectable()
export class excludeIdFieldPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata): any {
    try {
      console.log('====================================');
      console.log(value.payload);
      console.log('====================================');
      if (!Array.isArray(value)) value = [value];
      const data = value.map((val) => excludeAndNullVal(val, ['id']));
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
