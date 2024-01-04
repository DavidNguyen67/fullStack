import { Module } from '@nestjs/common';
import { CrudService } from './middlewares/services/crud.service';
import { CrudController } from './middlewares/controllers/crud.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { DoctorService } from './middlewares/services/doctor.service';
import { DoctorController } from './middlewares/controllers/doctor.controller';

@Module({
  // imports: [NestjsFormDataModule.config({ storage: MemoryStoredFile })],
  providers: [CrudService, PrismaService, DoctorService],
  controllers: [CrudController, DoctorController],
})
export class CrudModule {}
