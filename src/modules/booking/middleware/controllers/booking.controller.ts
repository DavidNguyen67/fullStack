import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import * as routes from '../../../../utils/routes';
import { BookingService } from '../services/booking.service';
import { pipes } from '../pipes';
import { HandleRawDataPipe } from '../pipes/handleRawData.pipe';
import { GlobalRes } from 'src/utils/interfaces/response.interface';
import { IsHasTokenInQueryPipe } from '../pipes/isHasTokenInQuery.pipe';
import { getMaxElement } from 'src/utils/function';
import { IsHasDoctorIdDateQueryPipe } from '../pipes/isHasDoctorIdDateQuey.pipe';
import { FormDataRequest } from 'nestjs-form-data';
import { FormDataSendRemedyDTO } from 'src/utils/dto/formData.dto';

@Controller(`${routes.versionApi}/${routes.bookingPath}`)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post(routes.createRoute)
  @UsePipes(pipes.IsHasDataInQueryOrBodyPipe, HandleRawDataPipe)
  async PatientBookAppointments(@Body() body: any): Promise<GlobalRes> {
    try {
      return {
        statusCode: HttpStatus.OK,
        data: await this.bookingService.PatientBookAppointments(body),
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(routes.verifyPath)
  @UsePipes(pipes.IsHasDataInQueryOrBodyPipe, IsHasTokenInQueryPipe)
  async verifyBookingAppointment(@Query() quey: string): Promise<GlobalRes> {
    try {
      return {
        statusCode: 200,
        data: await this.bookingService.verifyToken(quey),
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(routes.readRoute)
  @UsePipes(pipes.IsHasDataInQueryOrBodyPipe, IsHasDoctorIdDateQueryPipe)
  async readAppointMentByDateAndDoctorId(@Query() query: any) {
    try {
      // eslint-disable-next-line prefer-const
      let { doctorId, date } = query;
      doctorId = Array.isArray(doctorId) ? getMaxElement(doctorId) : +doctorId;
      date = Array.isArray(date) ? getMaxElement(date) : +date;

      if (doctorId && date) {
        return {
          statusCode: HttpStatus.OK,
          data: await this.bookingService.readAppointMentByDateAndDoctorId(
            doctorId,
            date,
          ),
        };
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('upload')
  @FormDataRequest()
  async uploadFile(@Body() body: FormDataSendRemedyDTO) {
    try {
      const isSuccess = await this.bookingService.handleSendRemedy(body);
      return isSuccess
        ? {
            statusCode: HttpStatus.OK,
            data: isSuccess,
          }
        : {
            statusCode: HttpStatus.BAD_REQUEST,
            data: isSuccess,
          };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
