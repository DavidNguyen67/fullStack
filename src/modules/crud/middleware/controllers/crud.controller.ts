import { Body, Controller, Delete, Get, Query, UsePipes } from '@nestjs/common';
import { CrudService } from '../services/crud.service';
import { CrudPipe } from '../pipe/crud.pipe';

@Controller('/api/v1/')
export class CrudController {
  constructor(private crudService: CrudService) {}

  @Get('read')
  @UsePipes(CrudPipe)
  async readUsers(@Query() reqQuery: { page: number; take: number }) {
    const { page, take } = reqQuery;
    const skip = (page - 1) * take;
    return await this.crudService.fetchUser(take, skip, page);
  }
  @Delete('delete')
  async deleteUsers(@Body() reqBody: any) {
    console.log(reqBody);

    return await this.crudService.deleteUsersService(reqBody);
  }
}
