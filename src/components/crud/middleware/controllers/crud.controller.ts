import { Controller, Get, UseGuards, UsePipes } from '@nestjs/common';
import { CrudPipe } from '../pipe/crud.pipe';
import { Request } from 'express';
import { ReqDec } from '../../custom/ReqDec';
import { CrudGuard } from '../guards/crud.guard';
import { CrudService } from '../services/crud.service';

@Controller('/api/v1/')
export class CrudController {
  constructor(private crudService: CrudService) {}

  @Get()
  @UsePipes(new CrudPipe())
  @UseGuards(new CrudGuard())
  async create(@ReqDec() req: Request) {
    // this.crudService.createUser()
    return console.log('this is controller');
  }
}
