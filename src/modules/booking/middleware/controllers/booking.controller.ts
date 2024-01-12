import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import * as routes from '../../../../utils/routes';
import { BookingService } from '../services/booking.service';
import { pipes } from '../pipes';
import { HandleRawDataPipe } from '../pipes/handleRawData.pipe';

@Controller(`${routes.versionApi}/${routes.bookingPath}`)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post(routes.createRoute)
  @UsePipes(pipes.IsHasDataInQueryOrBodyPipe, HandleRawDataPipe)
  async PatientBookAppointments(@Body() body: any) {
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
}
