import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

@Injectable()
export class isHasIdInQueryOrBodyGuard implements CanActivate {
  canActivate(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const rawData = !isEmpty(request.query) || !isEmpty(request.body);
    return rawData;
  }
}
