import { All, Controller, Res } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @All('*')
  notFound(@Res() res: Response): object {
    return res.status(404).json({
      msg: 'Not found any routes here, the default route is /api/v1/',
    });
  }
}
