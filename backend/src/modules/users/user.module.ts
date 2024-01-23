import { Module } from '@nestjs/common';
import { UsersService } from './middlewares/services/users.service';
import { UsersController } from './middlewares/controllers/users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
// import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { DoctorsService } from './middlewares/services/doctors.service';
import { DoctorController } from './middlewares/controllers/doctors.controller';

@Module({
  // imports: [NestjsFormDataModule.config({ storage: MemoryStoredFile })],
  providers: [UsersService, PrismaService, DoctorsService],
  controllers: [UsersController, DoctorController],
})
export class UsersModule {}
