import {
  Injectable,
  PipeTransform,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

interface TokenPayload {
  token: string;
}

@Injectable()
export class IsHasTokenInQueryPipe implements PipeTransform {
  transform(value: any): any {
    try {
      if (!this.hasTokenRequired(value)) {
        const missingFields = 'token';
        const errorMessage = `Missing required params: ${missingFields}`;
        throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
      }
      return value.token;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private hasTokenRequired(payload: TokenPayload): boolean {
    return !!payload.token;
  }
}
