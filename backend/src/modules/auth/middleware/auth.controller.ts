import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Res,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import * as routes from './../../../utils/routes';
import { LoginInterface } from 'src/utils/interfaces';
import { GlobalRes } from 'src/utils/interfaces/response.interface';
import { Public } from 'src/utils/decorators';
import { AdminGuard } from 'src/utils/guard/Admin.guard';
import { Response } from 'express';
import { env } from 'process';

const maxAgeInMilliseconds = 24 * 60 * 60 * 1000 * 3;
@Controller(`${routes.versionApi}/${routes.authPath}`)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get()
  getHello() {
    return 'hello1';
  }

  @Public()
  @Post(routes.loginRoute)
  @UsePipes(AdminGuard)
  async loginController(
    @Body() dataLogin: LoginInterface,
    @Res({ passthrough: true }) response: Response,
  ): Promise<GlobalRes> {
    try {
      const { username, password } = dataLogin;
      const { access_token, ...data } = await this.authService.loginService(
        username,
        password,
      );
      response.cookie(env.KEY_COOKIE, access_token, {
        httpOnly: true,
        maxAge: maxAgeInMilliseconds,
      });
      return {
        statusCode: HttpStatus.OK,
        data,
        error: null,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
