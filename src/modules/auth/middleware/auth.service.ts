import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { exclude } from 'src/utils/excludeFields';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async loginService(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (user && password === user.password) {
      return exclude(user, ['password', 'createAt', 'updateAt']) || user;
    }

    throw new UnauthorizedException('Wrong password or email');
  }
}
