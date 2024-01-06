import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Put,
  Query,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import * as routes from '../../../../utils/routes';
import { DoctorsService } from '../services/doctors.service';
import { FetchDoctorInterface } from 'src/utils/interfaces';
import { IsHasDataInQueryOrBodyPipe } from '../pipes/IsHasDataInQueryOrBody.pipe';
import { convertAnyStringArrToNumArrPipe } from '../pipes/convertAnyStringArrToNumArr.pipe';
import { GlobalRes } from 'src/utils/response.interface';
import { FetchUsersInterceptor } from '../interceptor/fetchUser.interceptor';
import { UpdateDoctorsDto } from 'src/utils/dto/User.dto';
import { getMaxElement, processUserData } from 'src/utils/function';
import { isHasDoctorIdPipe } from '../pipes/isHasDoctorId.pipe';
import { IsIdHasNumberInStringPipe } from '../pipes/isHasNumberInString.pipe';

@Controller(`${routes.versionApi}/${routes.crudDoctorPath}`)
export class DoctorController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get(routes.readRoute)
  @UseInterceptors(FetchUsersInterceptor)
  @UsePipes(IsHasDataInQueryOrBodyPipe, convertAnyStringArrToNumArrPipe)
  async fetchDoctors(@Query() query: FetchDoctorInterface): Promise<GlobalRes> {
    const limit = query.limit;
    const id = query?.id;

    let data: any;

    if (limit) {
      data = await this.doctorsService.getTopDoctorHome(+limit || 10);
      return {
        statusCode: HttpStatus.OK,
        data,
      };
    }
    if (id && id.length > 0) {
      if (Array.isArray(id))
        data = await this.doctorsService.getDoctors(id.map(Number));
      if (id === 'all') data = await this.doctorsService.getAllDoctors();
      return {
        statusCode: HttpStatus.OK,
        data,
      };
    }
    return {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Missing or invalid query parameters',
    };
  }

  @Put(routes.updateRoute)
  @UsePipes(IsHasDataInQueryOrBodyPipe, isHasDoctorIdPipe)
  async updateUsers(
    @Body(new ValidationPipe({ transform: true })) body: UpdateDoctorsDto | any,
  ) {
    const payload = processUserData(body);
    if (payload.length > 0) {
      let totalSuccessRecord = 0;
      for (const item of payload) {
        const response = await this.doctorsService.updateDoctors(item);

        response && (totalSuccessRecord += 1);
      }
      if (totalSuccessRecord)
        return {
          statusCode: HttpStatus.OK,
          data: totalSuccessRecord,
        };
    }
    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid data received',
    };
  }

  @Get(routes.readDetailRoute)
  @UsePipes(
    IsHasDataInQueryOrBodyPipe,
    convertAnyStringArrToNumArrPipe,
    IsIdHasNumberInStringPipe,
  )
  async fetchDoctorDetail(
    @Query() query: FetchDoctorInterface,
  ): Promise<GlobalRes> {
    const id = query?.id;

    let data: any;

    if (id && id.length > 0) {
      if (Array.isArray(id))
        data = await this.doctorsService.getDoctorDetail(getMaxElement(id));

      return {
        statusCode: HttpStatus.OK,
        data,
      };
    }
    return {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Missing or invalid query parameters',
    };
  }
}
