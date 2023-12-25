import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import * as routes from './../../../utils/routes';
import { LoginInterface } from 'src/utils/interfaces';
import { AuthPipe } from './auth.pipe';
import { GlobalRes } from 'src/utils/response.interface';

@Controller(`${routes.versionApi}/${routes.authPath}`)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get()
  getHello() {
    return 'hello1';
  }

  @Post(routes.loginRoute)
  @UsePipes(new AuthPipe())
  async loginController(
    @Body(AuthPipe) dataLogin: LoginInterface,
  ): Promise<GlobalRes> {
    const { username, password } = dataLogin;
    return {
      statusCode: HttpStatus.OK,
      data: await this.authService.loginService(username, password),
      error: null,
    };
  }
}
