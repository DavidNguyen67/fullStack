import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import * as routes from './../../../../utils/routes';
import { ScheduleService } from '../services/schedule.service';
import { pipes } from '../pipes';
import { GlobalRes } from 'src/utils/interfaces/response.interface';
import { Schedule } from '@prisma/client';
import { IsHasFieldRequiredSchedulePipe } from '../pipes/IsHasFieldRequiredSchedule.pipe';
import { HandleRawDataPipe } from '../pipes/HandleRawDataPipe.pipe';
import { BookSchedulesDto } from 'src/utils/dto/schedule.dto';

@Controller(`${routes.versionApi}/${routes.schedulePath}`)
export class ScheDuleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post(routes.createRoute)
  @UsePipes(
    pipes.IsHasDataInQueryOrBodyPipe,
    pipes.ExcludeIdFieldPipe,
    pipes.IsHasDoctorIdPipe,
    IsHasFieldRequiredSchedulePipe,
    HandleRawDataPipe,
  )
  async createSchedule(
    @Body(new ValidationPipe({ transform: true })) body: BookSchedulesDto[],
  ): Promise<GlobalRes> {
    try {
      const payload: Schedule[] = body.map((item: any) => !!item && item);
      return {
        statusCode: HttpStatus.OK,
        data: await this.scheduleService.createScheDule(payload),
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
