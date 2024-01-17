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
  Req,
  UploadedFile,
  UseGuards,
  // UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import * as routes from '../../../../utils/routes';
import { UsersService } from '../services/users.service';
import { DeleteUserInterface, FetchUserInterface } from 'src/utils/interfaces';
import { GlobalRes } from 'src/utils/interfaces/response.interface';
import { CreateUsersDto, UpdateUsersDto } from 'src/utils/dto/User.dto';
import { processUserData } from 'src/utils/function';
import { FetchUsersInterceptor } from '../interceptor/fetchUser.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
// import { FormDataRequest, MemoryStoredFile } from 'nestjs-form-data';
import { pipes } from '../pipes';
import { HandleRawDataCreate } from 'src/modules/specialty/middleware/pipes/handleRawDataCreate.pipe';
import * as roleGuards from '../../../../utils/guard/index.guard';
import { Public } from 'src/utils/decorators';

@Controller(`${routes.versionApi}/${routes.crudUserPath}`)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(routes.readRoute)
  @UseInterceptors(FetchUsersInterceptor)
  @UseGuards(roleGuards.AdminGuard)
  @UsePipes(
    pipes.IsHasDataInQueryOrBodyPipe,
    pipes.convertAnyStringArrToNumArrPipe,
  )
  async fetchUsers(@Query() query: FetchUserInterface): Promise<GlobalRes> {
    try {
      const id = query?.id;
      let data = null;

      if (id && id.length > 0) {
        if (Array.isArray(id))
          data = await this.usersService.fetchUser(id.map(Number));
        if (id === 'all') data = await this.usersService.fetchUsers();
        return {
          statusCode: HttpStatus.OK,
          data,
        };
      }
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Missing or invalid query parameters',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(routes.createRoute)
  @UseGuards(roleGuards.AdminGuard)
  @UsePipes(
    pipes.IsHasDataInQueryOrBodyPipe,
    pipes.ExcludeIdFieldPipe,
    pipes.FileSizeAndImageValidationPipe,
    pipes.RemoveBase64PrefixPipe,
    HandleRawDataCreate,
  )
  async createUsers(
    @Body(new ValidationPipe({ transform: true }))
    body: CreateUsersDto,
  ): Promise<GlobalRes> {
    try {
      const data: any = body.data || body;
      return {
        statusCode: HttpStatus.OK,
        data: await this.usersService.createUsers(data),
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(routes.deleteRoute)
  @UseGuards(roleGuards.AdminGuard)
  @UsePipes(
    pipes.IsHasDataInQueryOrBodyPipe,
    pipes.convertAnyStringArrToNumArrPipe,
  )
  async deleteUsers(@Query() query: DeleteUserInterface): Promise<GlobalRes> {
    try {
      const ids: any = query?.id;

      if (ids && ids.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          data: await this.usersService.deleteUsers(ids.map(Number)),
        };
      }
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Missing or invalid body parameters',
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(routes.updateRoute)
  @UseGuards(roleGuards.AdminGuard)
  @UsePipes(
    pipes.IsHasDataInQueryOrBodyPipe,
    pipes.FileSizeAndImageValidationPipe,
    pipes.RemoveBase64PrefixPipe,
    pipes.convertAnyStringArrToNumArrPipe,
  )
  async updateUsers(
    @Body(new ValidationPipe({ transform: true })) body: UpdateUsersDto | any,
  ): Promise<GlobalRes> {
    try {
      const payload = processUserData(body);
      if (payload.length > 0) {
        let totalSuccessRecord = 0;
        for (const item of payload) {
          const response = await this.usersService.updateUsers(item);

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

  @Post('upload')
  @Public()
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(pipes.FileSizeAndImageValidationPipe, pipes.RemoveBase64PrefixPipe)
  testFileUpload(@UploadedFile() file: Express.Multer.File) {
    try {
      console.log(file);
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
