import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AllCodeService {
  constructor(private prisma: PrismaService) {}

  async getAllCode(type?: string) {
    try {
      const allCode = type
        ? await this.prisma.allCode.findMany({
            take: 25,
            where: {
              type,
            },
          })
        : await this.prisma.allCode.findMany({
            take: 25,
          });
      if (allCode.length < 1) throw new NotFoundException('Not found all code');
      return allCode;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
