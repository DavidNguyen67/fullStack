import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { baseRouteBackEnd, fetchRoute } from '../../../../../routes';

@Controller(baseRouteBackEnd)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get(fetchRoute)
  getData() {
    return this.appService.checkData();
  }
}
