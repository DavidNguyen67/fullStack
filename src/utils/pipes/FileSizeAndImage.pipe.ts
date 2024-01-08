import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { MAX_FILE_SIZE } from 'src/utils/constants';
import { calculateSizeBytes } from 'src/utils/function';

@Injectable()
export class FileSizeAndImageValidationPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    try {
      value = Array.isArray(value) ? value : [value];
      let totalSize: number = 0;
      const isValid: boolean = value.every((item) => {
        if (item.image || item.size) {
          let isValidSize: boolean;
          let isValidMimeType: boolean;

          if (!item.size) {
            totalSize += calculateSizeBytes(item.image.length);
            isValidSize = totalSize < MAX_FILE_SIZE;
            isValidMimeType = item.image
              .match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0]
              .includes('image');
          } else {
            totalSize += item.size;
            isValidSize = totalSize < MAX_FILE_SIZE;
            isValidMimeType = item.mimetype.includes('image');
          }

          return isValidSize && isValidMimeType;
        }
        return true;
      });

      if (!isValid) {
        throw new BadRequestException('Invalid file type or size');
      }

      return value;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
