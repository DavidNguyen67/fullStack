import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PatientsController } from './middleware/controllers/patient.controller';
import { PatientsService } from './middleware/services/patient.service';

@Module({
  providers: [PrismaService, PatientsService],
  controllers: [PatientsController],
})
export class PatientsModule {}
