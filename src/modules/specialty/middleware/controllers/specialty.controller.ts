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
import { SpecialtyService } from '../services/specialty.service';
import { pipes } from '../../../users/middlewares/pipes';
import { IsHasFieldRequiredSpecialtyPipe } from '../pipes/IsHasFieldRequiredSpecialty.pipe';
import { GlobalRes } from 'src/utils/interfaces/response.interface';
import { getMaxElement } from 'src/utils/function';
import * as guards from '../../../../utils/guard/index.guard';

@Controller(`${routes.versionApi}/${routes.specialtyPath}`)
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) {}

  @Post(routes.createRoute)
  @UseGuards(guards.AdminAndDoctorGuard)
  @UsePipes(
    pipes.IsHasDataInQueryOrBodyPipe,
    pipes.ExcludeIdFieldPipe,
    IsHasFieldRequiredSpecialtyPipe,
    pipes.FileSizeAndImageValidationPipe,
    pipes.RemoveBase64PrefixPipe,
  )
  async createSpecialty(@Body() body: any): Promise<GlobalRes> {
    try {
      const payload = body;
      if (payload)
        return {
          statusCode: HttpStatus.OK,
          data: await this.specialtyService.createSpecialty(payload),
        };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(routes.readRoute)
  // @UsePipes()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async readSpecialties(@Query() query: any) {
    try {
      const { page } = query;
      if (page)
        return {
          statusCode: HttpStatus.OK,
          data: await this.specialtyService.readSpecialties(page),
        };
      return {
        statusCode: HttpStatus.OK,
        data: await this.specialtyService.readSpecialties(),
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(routes.readDetailRoute)
  @UsePipes(pipes.IsHasDataInQueryOrBodyPipe)
  async readDetailSpecialtyById(@Query() query: any) {
    try {
      // eslint-disable-next-line prefer-const
      let { id, province } = query;
      id = Array.isArray(id) ? getMaxElement(id) : +id;
      if (id) {
        if (!province)
          return {
            statusCode: HttpStatus.OK,
            data: await this.specialtyService.readDetailSpecialtyById(id),
          };
        return {
          statusCode: HttpStatus.OK,
          data: await this.specialtyService.readDetailSpecialtyById(
            id,
            province,
          ),
        };
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(routes.deleteRoute)
  @UseGuards(guards.AdminGuard)
  @UsePipes(pipes.IsHasDataInQueryOrBodyPipe)
  async deleteSpecialty(@Query() query: any) {
    try {
      const { id } = query;
      if (id)
        return {
          statusCode: HttpStatus.OK,
          data: await this.specialtyService.deleteSpecialty(+id),
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
  async updateSpecialty(@Body() body: any) {
    try {
      return {
        statusCode: HttpStatus.OK,
        data: await this.specialtyService.updateSpecialty(body),
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
