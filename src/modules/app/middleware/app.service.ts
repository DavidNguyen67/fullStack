import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  getHello(): string {
    return 'Hello World!';
  }
  async checkData() {
    return await this.prisma.staff.findMany({
      where: {
        employees: {
          some: {},
        },
      },
      include: {
        manager: {},
      },
    });
  }
}
