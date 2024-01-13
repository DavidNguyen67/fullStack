import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import * as routes from '../../../../utils/routes';
import { DoctorsService } from '../services/doctors.service';
import { FetchDoctorInterface } from 'src/utils/interfaces';
import { GlobalRes } from 'src/utils/interfaces/response.interface';
import { FetchUsersInterceptor } from '../interceptor/fetchUser.interceptor';
import { getMaxElement } from 'src/utils/function';
import { pipes } from '../pipes';

@Controller(`${routes.versionApi}/${routes.crudDoctorPath}`)
export class DoctorController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get(routes.readRoute)
  @UseInterceptors(FetchUsersInterceptor)
  @UsePipes(
    pipes.IsHasDataInQueryOrBodyPipe,
    pipes.convertAnyStringArrToNumArrPipe,
  )
  async fetchDoctors(@Query() query: FetchDoctorInterface): Promise<GlobalRes> {
    try {
      const id = query?.id;

      let data: any;
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
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(routes.readTopRoute)
  @UseInterceptors(FetchUsersInterceptor)
  // @UsePipes()
  async fetchTopDoctors(): Promise<GlobalRes> {
    try {
      const data = await this.doctorsService.getTopDoctorHome();

      return {
        statusCode: HttpStatus.OK,
        data: data,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(routes.readDetailRoute)
  @UsePipes(
    pipes.IsHasDataInQueryOrBodyPipe,
    pipes.convertAnyStringArrToNumArrPipe,
    pipes.IsIdHasNumberInStringPipe,
  )
  async fetchDoctorDetail(
    @Query() query: FetchDoctorInterface,
  ): Promise<GlobalRes> {
    try {
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
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(routes.readCommonRoute)
  @UsePipes(
    pipes.IsHasDataInQueryOrBodyPipe,
    pipes.convertAnyStringArrToNumArrPipe,
    pipes.IsIdHasNumberInStringPipe,
  )
  async fetchDoctorCommonInfo(
    @Query() query: FetchDoctorInterface,
  ): Promise<GlobalRes> {
    try {
      const id = query?.id;

      let data: any;

      if (id && id.length > 0) {
        if (Array.isArray(id))
          data = await this.doctorsService.getDoctorCommonInfo(
            getMaxElement(id),
          );

        return {
          statusCode: HttpStatus.OK,
          data,
        };
      }
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Missing or invalid query parameters',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
