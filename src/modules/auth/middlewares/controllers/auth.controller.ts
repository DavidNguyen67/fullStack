import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthPipe } from '../pipes/auth.pipe';
import { Response } from 'express';

@Controller('api/v1')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UsePipes(AuthPipe)
  async checkUser(@Body('data') reqBody: any, @Res() res: Response) {
    if (await this.authService.checkUser(reqBody)) {
      // return response.status(200).json({ msg: 'ok' });
      res.status(HttpStatus.OK).json([]);
    }
  }
}
