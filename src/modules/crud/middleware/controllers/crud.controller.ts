import { Controller, Get, Post, Query } from '@nestjs/common';
import { CrudService } from '../services/crud.service';
import { PrismaClient } from '@prisma/client';
import exclude from 'src/utils/excludeFields/exclude';

const prisma = new PrismaClient();
@Controller('/api/v1/')
export class CrudController {
  constructor(private crudService: CrudService) {}

  @Get('read')
  async create(@Query('take') take: string) {
    const totalPage = Math.ceil(
      (await prisma.user.count()) / parseInt(take, 10),
    );

    const users = await prisma.user.findMany({
      skip: parseInt(take) * 2,
      take: parseInt(take),
    });
    return {
      data: users.map((user) => exclude(user, ['password'])),
      totalPage,
    };
  }

  @Post()
  async login() {
    console.log('this is controller');
    return await prisma.user.findMany({});
  }
}
