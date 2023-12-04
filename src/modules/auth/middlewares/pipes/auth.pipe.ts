import { Injectable, PipeTransform } from '@nestjs/common';
import { isString } from 'class-validator';

@Injectable()
export class AuthPipe implements PipeTransform {
  transform(value: object) {
    // console.log(value);
    const isAllValueString = Object.keys(value).every((key) =>
      isString(value[key]),
    );
    return isAllValueString && value;
  }
}
