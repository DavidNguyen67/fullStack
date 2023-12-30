import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FetchUsersResponseInterface } from 'src/utils/interfaces';
import { GlobalRes } from 'src/utils/response.interface';

@Injectable()
export class FetchUsersInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    try {
      return next.handle().pipe(
        map((responseBody: GlobalRes) => {
          // Check if any user object in the response contains a 'password' field

          const hasPassword = responseBody.data?.some(
            (user: FetchUsersResponseInterface) => user.password,
          );

          // If any user has a password field, throw an error
          if (hasPassword)
            console.log(
              'Response contains sensitive information',
              'FetchUsersInterceptor',
            );

          // Filter out the 'password' field from each user object
          const data = responseBody.data?.map(
            (user: FetchUsersResponseInterface) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { password, ...userWithoutPassword } = user;

              return userWithoutPassword;
            },
          );
          return { ...responseBody, data };
        }),
        catchError((err) => {
          console.log(err);
          return throwError(() => err);
        }),
      );
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
