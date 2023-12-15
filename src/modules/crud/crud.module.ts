import { Module } from '@nestjs/common';
import { CrudService } from './middlewares/crud.service';
import { CrudController } from './middlewares/crud.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [CrudService, PrismaService],
  controllers: [CrudController],
})
export class CrudModule {}
