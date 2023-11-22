import { Controller, Get, Post, UsePipes } from '@nestjs/common';
import { CrudPipe } from '../pipe/crud.pipe';
import { CrudService } from '../services/crud.service';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
@Controller('/api/v1/')
export class CrudController {
  constructor(private crudService: CrudService) {}

  @Get()
  async create() {
    console.log('this is controller');
    return await prisma.user.findMany({});
  }

  @Post()
  @UsePipes(new CrudPipe())
  async login() {
    console.log('this is controller');
    return await prisma.user.findMany({});
  }
}
