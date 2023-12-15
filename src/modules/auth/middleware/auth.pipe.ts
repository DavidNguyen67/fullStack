import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginInterface } from 'src/utils/interfaces';

@Injectable()
export class AuthPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: LoginInterface, metadata: ArgumentMetadata) {
    try {
      const { username, password } = value;
      if (username && password) return value;
    } catch (error) {
      throw new UnauthorizedException('Missing username or password');
    }
  }
}
