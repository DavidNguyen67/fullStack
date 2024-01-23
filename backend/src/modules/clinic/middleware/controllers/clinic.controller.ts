import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
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
import { UpdateClinicDTO } from 'src/utils/dto/clinic.dto';

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
  async readSpecialties(@Query() query: any) {
    try {
      const { page } = query;
      if (page)
        return {
          statusCode: HttpStatus.OK,
          data: await this.clinicService.readClinics(page),
        };
      else
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

  @Delete(routes.deleteRoute)
  @UseGuards(guards.AdminGuard)
  @UsePipes(pipes.IsHasDataInQueryOrBodyPipe)
  async deleteClinic(@Query() query: any) {
    try {
      const { id } = query;
      if (id)
        return {
          statusCode: HttpStatus.OK,
          data: await this.clinicService.deleteClinic(+id),
        };
      throw new HttpException('Missing id in query', HttpStatus.BAD_REQUEST);
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(routes.updateRoute)
  @UseGuards(guards.AdminGuard)
  @UsePipes(pipes.IsHasDataInQueryOrBodyPipe)
  async updateClinic(@Body() body: UpdateClinicDTO) {
    try {
      return {
        statusCode: HttpStatus.OK,
        data: await this.clinicService.updateClinic(body),
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
