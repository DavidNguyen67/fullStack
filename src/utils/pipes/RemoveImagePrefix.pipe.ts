import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class RemoveBase64PrefixPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata): any {
    try {
      const data = value.map((val) => {
        if (val.image) {
          const regex =
            /^data:image\/(jpeg|jpg|gif|png|svg+xml|svg|xml);base64,/;
          val.image = val.image?.replace(regex, '');
        }
        return val;
      });

      return data;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}