import { Controller, Get, Post, UseGuards, UsePipes } from '@nestjs/common';
import { CrudPipe } from '../pipe/crud.pipe';
import { CrudService } from '../services/crud.service';
import { PrismaClient } from '@prisma/client';
import { CrudGuard } from '../guards/crud.guard';
import { Request } from 'express';
import { ReqDec } from '../../../../utils/custom/ReqDec';

const prisma = new PrismaClient();
@Controller('/api/v1/')
export class CrudController {
  constructor(private crudService: CrudService) {}

  @Get()
  @UsePipes(new CrudPipe())
  @UseGuards(new CrudGuard())
  async create() {
    console.log('this is controller');
    function exclude(user, keys) {
      return Object.fromEntries(
        Object.entries(user).filter(([key]) => !keys.includes(key)),
      );
    }
    const user = await prisma.user.findFirst();
    return exclude(user, ['password']);
  }

  @Post()
  @UsePipes(new CrudPipe())
  @UseGuards(new CrudGuard())
  async login(@ReqDec() req: Request) {
    console.log('this is controller');
    return await prisma.user.findMany({});
  }
}
