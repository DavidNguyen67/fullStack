import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MarkdownsService } from './middleware/services/markdown.service';
import { MarkDownController } from './middleware/controllers/markdown.controller';
// import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  // imports: [NestjsFormDataModule.config({ storage: MemoryStoredFile })],
  providers: [MarkdownsService, PrismaService],
  controllers: [MarkDownController],
})
export class MarkDownModule {}
