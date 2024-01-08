import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class IsHasDoctorIdPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata): any {
    try {
      if (Array.isArray(value)) {
        const result = value.filter((val) => val.doctorId);
        if (result.length > 0) return result;
      }
      const { doctorId } = value;
      if (doctorId) {
        return Array.isArray(value) ? value : [value];
      }

      throw new BadRequestException('Missing parameter from IsHasDoctorIdPipe');
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
