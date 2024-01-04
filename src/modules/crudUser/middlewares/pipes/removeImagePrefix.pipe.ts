import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class RemoveBase64PrefixPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata): any {
    try {
      const data = value.map((val) => {
        if (val.image) {
          const regex = /^data:image\/(jpeg|jpg|gif|png);base64,/;
          val.image = val.image?.replace(regex, '');
        }
        return val;
      });

      return data;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Failed to remove base64 prefix',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
