import { Controller, Get, HttpStatus, Query, UsePipes } from '@nestjs/common';
import * as routes from './../../../../utils/routes';
import { DoctorService } from '../services/doctor.service';
import { FetchDoctorInterface } from 'src/utils/interfaces';
import { IsHasDataInQueryOrBodyPipe } from '../pipes/IsHasDataInQueryOrBody.pipe';
import { convertAnyStringArrToNumArrPipe } from '../pipes/convertAnyStringArrToNumArr.pipe';
import { GlobalRes } from 'src/utils/response.interface';

@Controller(`${routes.versionApi}/${routes.crudDoctorPath}`)
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get(routes.readRoute)
  @UsePipes(IsHasDataInQueryOrBodyPipe, convertAnyStringArrToNumArrPipe)
  async fetchDoctors(@Query() query: FetchDoctorInterface): Promise<GlobalRes> {
    const limit = query.limit;
    const data = await this.doctorService.getTopDoctorHome(+limit || 10);

    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }
}
