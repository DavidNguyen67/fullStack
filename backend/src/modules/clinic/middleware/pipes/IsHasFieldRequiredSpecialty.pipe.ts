import {
  Injectable,
  PipeTransform,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class IsHasFieldRequiredClinicPipe implements PipeTransform {
  transform(value: any): any {
    try {
      const clinics = Array.isArray(value) ? value : [value];
      const isValid = clinics.every((item: any) => {
        return this.hasRequiredFields(item);
      });

      if (!isValid) {
        const missingFields = 'name, description, contentMarkdown, address';
        const errorMessage = `Missing required params: ${missingFields}`;
        throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
      }
      return clinics.length === 1 ? clinics[0] : clinics;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private hasRequiredFields(clinic: any): boolean {
    return (
      !!clinic.name &&
      !!clinic.address &&
      (!!clinic.contentMarkdown_EN || !!clinic.contentMarkdown_VI) &&
      (!!clinic.descriptionHTML_EN || !!clinic.descriptionHTML_VI)
    );
  }
}
