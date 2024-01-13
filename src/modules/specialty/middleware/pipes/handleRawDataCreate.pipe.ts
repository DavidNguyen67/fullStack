import {
  Injectable,
  PipeTransform,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class HandleRawDataCreate implements PipeTransform {
  transform(value: any): any {
    try {
      const doctors = Array.isArray(value) ? value : [value];

      const newDoctors = doctors.map((doctor) => {
        return {
          email: doctor.email,
          address: doctor.address,
          firstName: doctor.firstName,
          gender: doctor.genderData?.keyMap,
          image: doctor.image,
          lastName: doctor.lastName,
          phoneNumber: doctor.phoneNumber,
          password: doctor.password,
          positionId: doctor.positionData?.keyMap,
          roleId: doctor.roleData?.keyMap,
        };
      });
      if (newDoctors.length > 0) return newDoctors;
      throw new HttpException('Convert failed', HttpStatus.BAD_REQUEST);
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
