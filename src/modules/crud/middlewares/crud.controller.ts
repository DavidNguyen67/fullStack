import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import * as routes from './../../../utils/routes';
import { CrudService } from './crud.service';
import { FetchUserInterface } from 'src/utils/interfaces';
import { GlobalRes } from 'src/utils/response.interface';
import { fetchingPipe } from './pipes/fetching.pipe';
import { fetchingGuard } from './guards/fetching.guard';
import { creatingGuard } from './guards/creating.guard';
import { CreateUserDtos } from 'src/utils/dto/User.dto';
// import { CreatingPipe } from './pipes/creating.pipe';

@Controller(routes.baseRoute)
export class CrudController {
  constructor(private readonly crudService: CrudService) {}

  @Get(routes.getAllUsers)
  // ! Guard in here is not used correctly as itself
  @UseGuards(fetchingGuard)
  async fetchUsers(
    @Query(fetchingPipe) req: FetchUserInterface,
  ): Promise<GlobalRes> {
    const { id } = req;
    let data = null;
    if (Array.isArray(id))
      data = await this.crudService.fetchUser(id.map(Number));
    if (id === 'all') data = await this.crudService.fetchUsers();
    return {
      statusCode: HttpStatus.OK,
      data,
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
}
