import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import * as routes from './../../../utils/routes';
import { CrudService } from './crud.service';
import { DeleteUserInterface, FetchUserInterface } from 'src/utils/interfaces';
import { GlobalRes } from 'src/utils/response.interface';
import { convertAnyStringArrToNumArrPipe } from './pipes/convertAnyStringArrToNumArr.pipe';
import { CreateUserDtos, UpdateUserDtos } from 'src/utils/dto/User.dto';
import { IsHasDataInQueryOrBodyPipe } from './pipes/IsHasDataInQueryOrBody.pipe';
import { processUserData } from 'src/utils/function';
import { excludeIdFieldPipe } from './pipes/creating.pipe';

@Controller(routes.baseRoute)
export class CrudController {
  constructor(private readonly crudService: CrudService) {}

  @Get(routes.getAllUsers)
  // ! Guard in here is not used correctly as itself
  @UsePipes(IsHasDataInQueryOrBodyPipe, convertAnyStringArrToNumArrPipe)
  async fetchUsers(@Query() query: FetchUserInterface): Promise<GlobalRes> {
    const id = query?.id;
    let data = null;

    if (id && id.length > 0) {
      if (Array.isArray(id))
        data = await this.crudService.fetchUser(id.map(Number));
      if (id === 'all') data = await this.crudService.fetchUsers();
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

  @Post(routes.createUsers)
  @UsePipes(excludeIdFieldPipe)
  async createUsers(
    @Body(new ValidationPipe({ transform: true }))
    body: CreateUserDtos,
  ): Promise<GlobalRes> {
    const { data }: any = body;
    return {
      statusCode: HttpStatus.OK,
      data: await this.crudService.createUsers(data || body),
    };
  }

  @Delete(routes.deleteUsers)
  @UsePipes(IsHasDataInQueryOrBodyPipe, convertAnyStringArrToNumArrPipe)
  async deleteUsers(@Query() query: DeleteUserInterface): Promise<GlobalRes> {
    const ids: any = query?.id;

    if (ids && ids.length > 0) {
      return {
        statusCode: HttpStatus.OK,
        data: await this.crudService.deleteUsers(ids.map(Number)),
      };
    }
    return {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Missing or invalid body parameters',
    };
  }

  @Put(routes.updateUsers)
  @UsePipes(IsHasDataInQueryOrBodyPipe, convertAnyStringArrToNumArrPipe)
  async updateUsers(
    @Body(new ValidationPipe({ transform: true })) body: UpdateUserDtos | any,
  ): Promise<GlobalRes> {
    const { ids, payload } = processUserData(body);

    if (ids.length === payload.length) {
      let totalSuccessRecord = 0;
      for (let i = 0; i < payload.length; i++) {
        const response = await this.crudService.updateUsers(
          [ids[i]],
          payload[i],
        );
        response && (totalSuccessRecord += response);
      }
      if (totalSuccessRecord)
        return {
          statusCode: HttpStatus.OK,
          data: totalSuccessRecord,
        };
    }
    if (payload.length === 1 && ids.length > 0) {
      if (payload[0].email) {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: 'Email attribute cannot be updateMany',
        };
      }
      const response = await this.crudService.updateUsers(ids, payload[0]);
      return {
        statusCode: HttpStatus.OK,
        data: response,
      };
    }
    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Invalid data received',
    };
    // this.crudService.updateUsers(body);
  }
}
