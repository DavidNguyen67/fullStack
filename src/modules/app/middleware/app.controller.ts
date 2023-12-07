import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import * as routes from './../../../nameRoutes';

@Controller(routes.baseRoute)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get(routes.staffFetchAll)
  getData() {
    return this.appService.checkData();
  }
}
