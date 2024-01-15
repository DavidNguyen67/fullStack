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
  @UsePipes(pipes.IsHasDataInQueryOrBodyPipe)
  async readAppointMentByDateAndDoctorId(@Query() query: any) {
    try {
      // eslint-disable-next-line prefer-const
      let { id, date } = query;
      console.log(id, date);
      id = Array.isArray(id) ? getMaxElement(id) : +id;
      date = Array.isArray(date) ? getMaxElement(date) : +date;

      if (id && date) {
        return {
          statusCode: HttpStatus.OK,
          data: await this.bookingService.readAppointMentByDateAndDoctorId(
            id,
            date,
          ),
        };
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
