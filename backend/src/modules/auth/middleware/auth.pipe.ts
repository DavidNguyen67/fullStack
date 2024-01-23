import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { LoginInterface } from 'src/utils/interfaces';

@Injectable()
export class AuthPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: LoginInterface, metadata: ArgumentMetadata) {
    try {
      const { username, password } = value;
      if (username && password) return value;
      throw new HttpException(
        'Missing username or password',
        HttpStatus.UNAUTHORIZED,
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
