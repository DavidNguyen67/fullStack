import {
  Injectable,
  PipeTransform,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

interface BookingFetchPatientPayload {
  doctorId: number | string;
  date: Date | number | string;
}

@Injectable()
export class IsHasDoctorIdDateQueryPipe implements PipeTransform {
  transform(value: any): any {
    try {
      if (!this.hasFieldsRequired(value)) {
        const missingFields = 'doctorId, date';
        const errorMessage = `Missing required params: ${missingFields}`;
        throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
      }
      return value;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private hasFieldsRequired(payload: BookingFetchPatientPayload): boolean {
    return !!payload.doctorId || !!payload.date;
  }
}
