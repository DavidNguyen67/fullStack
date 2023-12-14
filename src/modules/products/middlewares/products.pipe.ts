import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ProductsPipe implements PipeTransform {
  transform(value: any) {
    console.log(value);
    return value;
  }
}
