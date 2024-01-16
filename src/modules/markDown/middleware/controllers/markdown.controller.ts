import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import * as routes from '../../../../utils/routes';
import { UpdateDoctorsDto } from 'src/utils/dto/User.dto';
import { processUserData } from 'src/utils/function';
import { MarkdownsService } from '../services/markdown.service';
import { pipes } from '../pipes';
import { GlobalRes } from 'src/utils/interfaces/response.interface';
import * as roleGuards from '../../../../utils/guard/index.guard';
@Controller(`${routes.versionApi}/${routes.markdownPath}`)
export class MarkDownController {
  constructor(private readonly markdownsService: MarkdownsService) {}

  @Put(routes.updateRoute)
  @UseGuards(roleGuards.AdminGuard)
  @UsePipes(pipes.IsHasDataInQueryOrBodyPipe, pipes.IsHasDoctorIdPipe)
  async updateUsers(
    @Body(new ValidationPipe({ transform: true })) body: UpdateDoctorsDto | any,
  ): Promise<GlobalRes> {
    try {
      const payload = processUserData(body);
      if (payload.length > 0) {
        let totalSuccessRecord = 0;
        for (const item of payload) {
          const response = await this.markdownsService.updateMarkDown(item);

          response && (totalSuccessRecord += 1);
        }
        if (totalSuccessRecord)
          return {
            statusCode: HttpStatus.OK,
            data: totalSuccessRecord,
          };
      }
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Invalid data received',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
