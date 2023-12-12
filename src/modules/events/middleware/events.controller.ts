import {
  Controller,
  Get,
  HttpStatus,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as routes from '../../../utils/routes';
import { EventsService } from './events.service';
import { globalRes } from 'src/utils/response.interface';

@Controller(routes.baseRoute)
export class EventsController {
  constructor(private eventsService: EventsService) {}
  @Post(routes.EventsCreate)
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<globalRes> {
    // console.log(dataImgBuffers);
    try {
      const dataImgBuffers = files.map((file) => file.buffer);
      return {
        data: await this.eventsService.storeImages(dataImgBuffers),
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      return {
        error: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
  @Get(routes.EventsFetchAll)
  async getFile(): Promise<globalRes> {
    try {
      return {
        data: await this.eventsService.streamingImages(),
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        error: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
