import { Module } from '@nestjs/common';
import { AuthService } from './middlewares/services/auth.service';
import { AuthController } from './middlewares/controllers/auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
