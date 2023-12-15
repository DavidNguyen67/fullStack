import { Module } from '@nestjs/common';
import { AuthController } from './middleware/auth.controller';
import { AuthService } from './middleware/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [AuthService, PrismaService],
  controllers: [AuthController],
})
export class AuthModule {}
