import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AllCodeService } from './middlewares/allCode.service';
import { AllCodeController } from './middlewares/allCode.controller';

@Module({
  providers: [AllCodeService, PrismaService],
  controllers: [AllCodeController],
})
export class allCodeModule {}
