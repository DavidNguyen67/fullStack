import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InfoController } from './middleware/controllers/info.controller';
import { InfoService } from './middleware/services/info.service';
// import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  providers: [PrismaService, InfoService],
  controllers: [InfoController],
})
export class InfoModule {}
