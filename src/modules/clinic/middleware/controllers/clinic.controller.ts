import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import * as routes from '../../../../utils/routes';
import { ClinicService } from '../services/clinic.service';
import { pipes } from 'src/modules/users/middlewares/pipes';
import { GlobalRes } from 'src/utils/interfaces/response.interface';
import { IsHasFieldRequiredClinicPipe } from '../pipes/IsHasFieldRequiredSpecialty.pipe';
import { getMaxElement } from 'src/utils/function';
import { Public } from 'src/utils/decorators';
import * as guards from '../../../../utils/guard/index.guard';

@Controller(`${routes.versionApi}/${routes.clinicPath}`)
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @Post(routes.createRoute)
  @UseGuards(guards.AdminGuard)
  @UsePipes(
    pipes.IsHasDataInQueryOrBodyPipe,
    pipes.ExcludeIdFieldPipe,
    IsHasFieldRequiredClinicPipe,
    pipes.FileSizeAndImageValidationPipe,
    pipes.RemoveBase64PrefixPipe,
  )
  async createSpecialty(@Body() body: any): Promise<GlobalRes> {
    try {
      const payload = body;
      if (payload)
        return {
          statusCode: HttpStatus.OK,
          data: await this.clinicService.createClinic(payload),
        };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(routes.readRoute)
  @Public()
  // @UsePipes()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async readSpecialties() {
    try {
      return {
        statusCode: HttpStatus.OK,
        data: await this.clinicService.readClinics(),
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(routes.readDetailRoute)
  @Public()
  async readDetailSpecialtyById(@Query() query: any) {
    try {
      // eslint-disable-next-line prefer-const
      let { id } = query;
      id = Array.isArray(id) ? getMaxElement(id) : +id;
      if (!id) {
        return {
          statusCode: HttpStatus.OK,
          data: await this.clinicService.readClinics(),
        };
      }
      return {
        statusCode: HttpStatus.OK,
        data: await this.clinicService.readDetailClinicById(id),
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
