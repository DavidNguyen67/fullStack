import {
  Injectable,
  PipeTransform,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class IsHasFieldRequiredDoctorInfoPipe implements PipeTransform {
  transform(value: any): any {
    try {
      const doctorInfos = Array.isArray(value) ? value : [value];

      const isValid = doctorInfos.every((item: any) => {
        return this.hasRequiredFields(item);
      });

      if (!isValid) {
        const missingFields = 'priceId, provinceId, doctorId, paymentId';
        const errorMessage = `Missing required params: ${missingFields}`;
        throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
      }

      return doctorInfos;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private hasRequiredFields(schedule: any): boolean {
    return (
      !!schedule.priceId &&
      !!schedule.provinceId &&
      !!schedule.doctorId &&
      !!schedule.paymentId
    );
  }
}
