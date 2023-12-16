import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import * as routes from './../../../utils/routes';
import { CrudService } from './crud.service';
import { DeleteUserInterface, FetchUserInterface } from 'src/utils/interfaces';
import { GlobalRes } from 'src/utils/response.interface';
import { convertAnyStringArrToNumArrPipe } from './pipes/convertAnyStringArrToNumArr.pipe';
import { isHasIdInQueryOrBodyGuard } from './guards/isHasIdInBody.guard';
import { creatingGuard } from './guards/creating.guard';
import { CreateUserDtos } from 'src/utils/dto/User.dto';
// import { CreatingPipe } from './pipes/creating.pipe';

@Controller(routes.baseRoute)
export class CrudController {
  constructor(private readonly crudService: CrudService) {}

  @Get(routes.getAllUsers)
  // ! Guard in here is not used correctly as itself
  @UseGuards(isHasIdInQueryOrBodyGuard)
  async fetchUsers(
    @Query(convertAnyStringArrToNumArrPipe) query: FetchUserInterface,
  ): Promise<GlobalRes> {
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
  @UseGuards(creatingGuard)
  async createUsers(
    @Body(new ValidationPipe({ transform: true }))
    body: CreateUserDtos,
  ) {
    const { data }: any = body;
    return {
      statusCode: HttpStatus.OK,
      data: await this.crudService.createUsers(data || body),
    };
  }

  @Delete(routes.deleteUsers)
  @UseGuards(isHasIdInQueryOrBodyGuard)
  async deleteUsers(
    @Body(convertAnyStringArrToNumArrPipe) req: DeleteUserInterface,
  ) {
    const ids: any = req?.id;
    if (ids && ids.length > 0) {
      return {
        statusCode: HttpStatus.OK,
        data: await this.crudService.deleteUsers(ids.map(Number)),
      };
    }
    return {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Missing or invalid query parameters',
    };
  }
}
