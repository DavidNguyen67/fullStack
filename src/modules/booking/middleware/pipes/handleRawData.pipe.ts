import {
  Injectable,
  PipeTransform,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Booking, User } from '@prisma/client';
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
          date: item.date,
        };
      });
      const appInfo = payload.map((item) => {
        return {
          lang: item.lang,
          dataTime: item.dataTime,
          doctorData: item.doctorData,
        };
      });

      const isValidUserTbl = dataForUserTbl.every((item: User) =>
        this.hasRequiredUserFields(item),
      );
      const isValidBookingTbl = dataForBookingTbl.every((item: Booking | any) =>
        this.hasRequiredBookingFields(item),
      );

      if (!isValidUserTbl) {
        const missingFields = 'email, firstName, lastName';
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

  private hasRequiredUserFields(user: User): boolean {
    return !!user.email && !!user.firstName && !!user.lastName;
  }
  private hasRequiredBookingFields(booking: Booking): boolean {
    return !!booking.date && !!booking.doctorId && !!booking.timeType;
  }
}
