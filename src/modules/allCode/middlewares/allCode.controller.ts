import { Controller, Get, HttpStatus, Query, UsePipes } from '@nestjs/common';
import * as routes from '../../../utils/routes';
import { AllCodeService } from './allCode.service';
import { FetchAllCodeInterface } from 'src/utils/interfaces';
import { GlobalRes } from 'src/utils/interfaces/response.interface';
import { IsHasDataInQueryOrBodyPipe } from './pipes/IsHasDataInQueryOrBody.pipe';

@Controller(`${routes.versionApi}/${routes.allCodePath}`)
export class AllCodeController {
  constructor(private readonly allCodeService: AllCodeService) {}

  @Get(routes.readRoute)
  @UsePipes(IsHasDataInQueryOrBodyPipe)
  async getAllCode(@Query() query: FetchAllCodeInterface): Promise<GlobalRes> {
    const type = query.type;
    let data = null;
    type.toLowerCase() === 'all' || !type
      ? (data = await this.allCodeService.getAllCode())
      : (data = await this.allCodeService.getAllCode(type.toUpperCase()));

    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }
}
