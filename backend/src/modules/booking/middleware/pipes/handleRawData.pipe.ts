import {
  Injectable,
  PipeTransform,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@Injectable()
export class HandleRawDataPipe implements PipeTransform {
  transform(value: any): any {
    try {
      const payload = Array.isArray(value) ? value : [value];

      const dataForUserTbl = payload.map((item) => {
        const [firstName, ...lastName] = item.namePatient?.split(' ');
        return {
          email: item.email,
          password: uuid(),
          address: item.address,
          firstName,
          lastName:
            lastName.length > 0 && lastName[0] ? lastName.join(' ') : 'None',
          updateAt: new Date(),
        };
      });
      const dataForBookingTbl = payload.map((item) => {
        return {
          doctorId: item.doctorId,
          timeType: item.timeType,
          DOB: item.date,
          note: item.note,
          DateAppointment: item.DateAppointment,
        };
      });
      const appInfo = payload.map((item) => {
        return {
          lang: item.lang,
          dataTime: item.dataTime,
          doctorData: item.doctorData,
        };
      });

      const isValidUserTbl = dataForUserTbl.every((item: any) =>
        this.hasRequiredUserFields(item),
      );
      const isValidBookingTbl = dataForBookingTbl.every((item: any) =>
        this.hasRequiredBookingFields(item),
      );

      if (!isValidUserTbl) {
        const missingFields = 'email, firstName, lastName, address';
        const errorMessage = `Missing required params: ${missingFields}`;
        throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
      }

      if (!isValidBookingTbl) {
        const missingFields = 'date, doctorId, timeType';
        const errorMessage = `Missing required params: ${missingFields}`;
        throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
      }

      return {
        patient: dataForUserTbl[0],
        booking: dataForBookingTbl[0],
        appInfo: appInfo[0],
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private hasRequiredUserFields(user: any): boolean {
    return (
      !!user.email && !!user.firstName && !!user.lastName && !!user.address
    );
  }
  private hasRequiredBookingFields(booking: any): boolean {
    return (
      !!booking.DOB &&
      !!booking.doctorId &&
      !!booking.timeType &&
      !!booking.DateAppointment
    );
  }
}
