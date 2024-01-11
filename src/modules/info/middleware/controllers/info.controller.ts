import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Put,
  UsePipes,
} from '@nestjs/common';
import * as routes from '../../../../utils/routes';
import { InfoService } from '../services/info.service';
import { pipes } from '../pipes';
import { GlobalRes } from 'src/utils/interfaces/response.interface';
import { HandleRawDataPipe } from '../pipes/handleRawData.pipe';
import { IsHasFieldRequiredDoctorInfoPipe } from '../pipes/IsHasFieldRequiredSchedule.pipe';
import * as _ from 'lodash';
import { infoDto } from 'src/utils/dto/info.dto';

@Controller(`${routes.versionApi}/${routes.doctorInfo}`)
export class InfoController {
  constructor(private readonly infoService: InfoService) {}

  @Put(routes.updateRoute)
  @UsePipes(
    pipes.IsHasDataInQueryOrBodyPipe,
    IsHasFieldRequiredDoctorInfoPipe,
    HandleRawDataPipe,
  )
  async createOrUpdateDoctorInfo(@Body() body: any): Promise<GlobalRes> {
    try {
      const payload: infoDto['doctor'] = body;
      if (!_.isObject(payload)) {
        throw new HttpException('Invalid Data', HttpStatus.BAD_REQUEST);
      }
      return {
        statusCode: HttpStatus.OK,
        data: await this.infoService.createOrUpdateDoctorInfo(payload),
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
