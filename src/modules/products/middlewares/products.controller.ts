import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  baseRoute,
  productsCreate,
  productsFetchAll,
  productsFetchOne,
} from 'src/utils/routes';
import { ProductsService } from './products.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { globalRes } from 'src/utils/response.interface';

@Controller(baseRoute)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post(productsCreate)
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<globalRes> {
    try {
      const dataImgBuffers = files.map((file) => file.buffer);
      return {
        data: await this.productsService.storeImages(dataImgBuffers),
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      console.log(error);

      return {
        error: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  @Get(productsFetchAll)
  async getFiles(): Promise<globalRes> {
    try {
      return {
        data: await this.productsService.streamingImages(),
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      console.log(error);

      return {
        error: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  @Get(productsFetchOne)
  async getFile(@Body('id') product_id: number): Promise<globalRes> {
    try {
      return {
        data: await this.productsService.streamingImage(product_id),
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      console.log(error);

      return {
        error: error,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
