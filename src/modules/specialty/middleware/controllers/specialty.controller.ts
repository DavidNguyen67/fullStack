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
import { SpecialtyService } from '../services/specialty.service';
import { pipes } from '../../../users/middlewares/pipes';
import { IsHasFieldRequiredSpecialtyPipe } from '../pipes/IsHasFieldRequiredSpecialty.pipe';
import { GlobalRes } from 'src/utils/interfaces/response.interface';
import { getMaxElement } from 'src/utils/function';

@Controller(`${routes.versionApi}/${routes.specialtyPath}`)
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) {}

  @Post(routes.createRoute)
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
  async readSpecialties() {
    try {
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
  async readSpecialty(@Query() query: any) {
    try {
      // eslint-disable-next-line prefer-const
      let { id, province } = query;
      id = Array.isArray(id) ? getMaxElement(id) : +id;
      if (id) {
        if (!province)
          return {
            statusCode: HttpStatus.OK,
            data: await this.specialtyService.readSpecialty(id),
          };
        return {
          statusCode: HttpStatus.OK,
          data: await this.specialtyService.readSpecialty(id, province),
        };
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
