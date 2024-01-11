import {
  Injectable,
  PipeTransform,
  InternalServerErrorException,
} from '@nestjs/common';
import { error } from 'console';
import * as _ from 'lodash';
@Injectable()
export class HandleRawDataPipe implements PipeTransform {
  transform(value: any): any {
    try {
      let payload = Array.isArray(value) ? value : [value];
      payload = payload[payload.length - 1];
      if (_.isObject(payload)) return payload;
      throw new error('Conversion failed');
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
