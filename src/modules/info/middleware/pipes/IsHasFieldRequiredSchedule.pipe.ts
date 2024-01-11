import {
  Injectable,
  PipeTransform,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Doctor_info } from '@prisma/client';

@Injectable()
export class IsHasFieldRequiredDoctorInfoPipe implements PipeTransform {
  transform(value: any): any {
    try {
      const doctorInfos = Array.isArray(value) ? value : [value];

      const isValid = doctorInfos.every((item: Doctor_info) => {
        return this.hasRequiredFields(item);
      });

      if (!isValid) {
        const missingFields = 'priceId, provinceId, doctorId, paymentId';
        const errorMessage = `Missing required params: ${missingFields}`;
        throw new BadRequestException(errorMessage);
      }

      return doctorInfos;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  private hasRequiredFields(schedule: Doctor_info): boolean {
    return (
      !!schedule.priceId &&
      !!schedule.provinceId &&
      !!schedule.doctorId &&
      !!schedule.paymentId
    );
  }
}
