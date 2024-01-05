import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
  UploadedFile,
  // UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import * as routes from '../../../../utils/routes';
import { UsersService } from '../services/users.service';
import { DeleteUserInterface, FetchUserInterface } from 'src/utils/interfaces';
import { GlobalRes } from 'src/utils/response.interface';
import { convertAnyStringArrToNumArrPipe } from '../pipes/convertAnyStringArrToNumArr.pipe';
import { CreateUsersDto, UpdateUsersDto } from 'src/utils/dto/User.dto';
import { IsHasDataInQueryOrBodyPipe } from '../pipes/IsHasDataInQueryOrBody.pipe';
import { processUserData } from 'src/utils/function';
import { ExcludeIdFieldPipe } from '../pipes/creating.pipe';
import { FetchUsersInterceptor } from '../interceptor/fetchUser.interceptor';
import { RemoveBase64PrefixPipe } from '../pipes/removeImagePrefix.pipe';
import { FileSizeAndImageValidationPipe } from '../pipes/FileSizeAndImage.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
// import { FormDataRequest, MemoryStoredFile } from 'nestjs-form-data';

@Controller(`${routes.versionApi}/${routes.crudUserPath}`)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(routes.readRoute)
  @UseInterceptors(FetchUsersInterceptor)
  // ! Guard in here is not used correctly as itself
  @UsePipes(IsHasDataInQueryOrBodyPipe, convertAnyStringArrToNumArrPipe)
  async fetchUsers(@Query() query: FetchUserInterface): Promise<GlobalRes> {
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
  }

  @Post(routes.createRoute)
  @UsePipes(
    ExcludeIdFieldPipe,
    FileSizeAndImageValidationPipe,
    RemoveBase64PrefixPipe,
  )
  async createUsers(
    @Body(new ValidationPipe({ transform: true }))
    body: CreateUsersDto,
  ): Promise<GlobalRes> {
    const data: any = body.data || body;
    return {
      statusCode: HttpStatus.OK,
      data: await this.usersService.createUsers(data),
    };
  }

  @Delete(routes.deleteRoute)
  @UsePipes(IsHasDataInQueryOrBodyPipe, convertAnyStringArrToNumArrPipe)
  async deleteUsers(@Query() query: DeleteUserInterface): Promise<GlobalRes> {
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
  }

  @Put(routes.updateRoute)
  @UsePipes(
    IsHasDataInQueryOrBodyPipe,
    FileSizeAndImageValidationPipe,
    RemoveBase64PrefixPipe,
    convertAnyStringArrToNumArrPipe,
  )
  async updateUsers(
    @Body(new ValidationPipe({ transform: true })) body: UpdateUsersDto | any,
  ) {
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
    // if (ids.length === payload.length) {
    //   let totalSuccessRecord = 0;
    //   for (let i = 0; i < payload.length; i++) {
    //     const response = await this.usersService.updateUsers(
    //       [ids[i]],
    //       payload[i],
    //     );
    //     response && (totalSuccessRecord += response);
    //   }
    //   if (totalSuccessRecord)
    //     return {
    //       statusCode: HttpStatus.OK,
    //       data: totalSuccessRecord,
    //     };
    // }
    // if (payload.length === 1 && ids.length > 0) {
    //   if (payload[0].email) {
    //     return {
    //       statusCode: HttpStatus.CONFLICT,
    //       message: 'Email attribute cannot be updateMany',
    //     };
    //   }
    //   const response = await this.usersService.updateUsers(ids, payload[0]);
    //   return {
    //     statusCode: HttpStatus.OK,
    //     data: response,
    //   };
    // }
    // return {
    //   statusCode: HttpStatus.BAD_REQUEST,
    //   message: 'Invalid data received',
    // };
  }

  // @Post(routes.createRoute)
  // @FormDataRequest({ storage: MemoryStoredFile })
  // @UsePipes(excludeIdFieldPipe)
  // async createUsers(@Body() data) {
  //   console.log('====================================');
  //   console.log(data);
  //   console.log('====================================');
  // return {
  //   statusCode: HttpStatus.OK,
  //   data: await this.usersService.createUsers(data),
  // };
  // @UsePipes(excludeIdFieldPipe)
  // async createUsers(@UploadedFile() file: Express.Multer.File) {
  //   console.log('====================================');
  //   console.log(file);
  //   console.log('====================================');
  // }
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(FileSizeAndImageValidationPipe, RemoveBase64PrefixPipe)
  testFileUpload(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }
}
