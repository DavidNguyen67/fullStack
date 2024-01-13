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
  async readSpecialties(@Query() query: any) {
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
}
