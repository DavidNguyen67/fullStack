import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import * as routes from '../../../../utils/routes';
import { PatientsService } from '../services/patient.service';
import { pipes } from '../pipes';
import { IsHasFieldRequiredSchedulePipe } from '../pipes/IsHasFieldRequiredSchedule.pipe';

@Controller(`${routes.versionApi}/${routes.patientPath}`)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post(routes.createRoute)
  @UsePipes(pipes.IsHasDataInQueryOrBodyPipe, IsHasFieldRequiredSchedulePipe)
  async PatientBookAppointments(@Body() body: any) {
    try {
      // const
      return {
        statusCode: HttpStatus.OK,
        data: await this.patientsService.PatientBookAppointments(2),
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
