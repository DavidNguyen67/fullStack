import { Module } from '@nestjs/common';
import { CrudController } from './middleware/controllers/crud.controller';
import { CrudService } from './middleware/services/crud.service';

@Module({
  controllers: [CrudController],
  providers: [CrudService],
})
export class CrudModule {}
