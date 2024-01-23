import { Module } from '@nestjs/common';
import { ClinicService } from './middleware/services/clinic.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClinicController } from './middleware/controllers/clinic.controller';

@Module({
  controllers: [ClinicController],
  providers: [ClinicService, PrismaService],
})
export class ClinicModule {}
