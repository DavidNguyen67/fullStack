import { Module } from '@nestjs/common';
import { SpecialtyController } from './middleware/controllers/specialty.controller';
import { SpecialtyService } from './middleware/services/specialty.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SpecialtyController],
  providers: [SpecialtyService, PrismaService],
})
export class SpecialtyModule {}
