import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as routes from '../../../utils/routes';
@Controller(routes.baseRoute)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }
  @Get(routes.staffFetchAll)
  getData() {
    return this.appService.checkData();
  }
}
