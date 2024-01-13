import {
  Injectable,
  PipeTransform,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Specialty } from '@prisma/client';

@Injectable()
export class IsHasFieldRequiredSpecialtyPipe implements PipeTransform {
  transform(value: any): any {
    try {
      const specialties = Array.isArray(value) ? value : [value];
      const isValid = specialties.every((item: Specialty) => {
        return this.hasRequiredFields(item);
      });

      if (!isValid) {
        const missingFields = 'name, description, contentMarkdown';
        const errorMessage = `Missing required params: ${missingFields}`;
        throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
      }
      return specialties.length === 1 ? specialties[0] : specialties;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private hasRequiredFields(specialty: Specialty): boolean {
    return (
      !!specialty.name &&
      (!!specialty.contentMarkdown_EN || !!specialty.contentMarkdown_VI) &&
      (!!specialty.contentMarkdown_VI || !!specialty.contentMarkdown_EN)
    );
  }
}
