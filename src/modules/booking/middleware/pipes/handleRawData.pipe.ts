import {
  Injectable,
  PipeTransform,
  BadRequestException,
  InternalServerErrorException,
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
          lastName: lastName.length > 0 ? lastName.join(' ') : 'None',
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

      const isValidUserTbl = dataForUserTbl.every((item: User) => {
        return this.hasRequiredUserFields(item);
      });
      const isValidBookingTbl = dataForBookingTbl.every(
        (item: Booking | any) => {
          return this.hasRequiredBookingFields(item);
        },
      );

      if (!isValidUserTbl) {
        const missingFields = 'email, firstName, lastName';
        const errorMessage = `Missing required params: ${missingFields}`;
        throw new BadRequestException(errorMessage);
      }

      if (!isValidBookingTbl) {
        const missingFields = 'date, doctorId, timeType';
        const errorMessage = `Missing required params: ${missingFields}`;
        throw new BadRequestException(errorMessage);
      }

      return { patient: dataForUserTbl[0], booking: dataForBookingTbl[0] };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  private hasRequiredUserFields(user: User): boolean {
    return !!user.email && !!user.firstName && !!user.lastName;
  }
  private hasRequiredBookingFields(booking: Booking): boolean {
    return !!booking.date && !!booking.doctorId && !!booking.timeType;
  }
}
