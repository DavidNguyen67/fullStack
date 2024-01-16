import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import * as routes from './../../../utils/routes';
import { LoginInterface } from 'src/utils/interfaces';
import { GlobalRes } from 'src/utils/interfaces/response.interface';
import { Public } from 'src/utils/decorators';
import { AdminGuard } from 'src/utils/guard/Admin.guard';

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
  async loginController(@Body() dataLogin: LoginInterface): Promise<GlobalRes> {
    try {
      const { username, password } = dataLogin;
      return {
        statusCode: HttpStatus.OK,
        data: await this.authService.loginService(username, password),
        error: null,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
