import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { exclude } from 'src/utils/function';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async loginService(username: string, password: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email: username },
      });

      if (user && (await bcrypt.compare(password, user.password))) {
        return exclude(user, ['password', 'createAt', 'updateAt']) || user;
      } else throw new UnauthorizedException('Wrong password or username');
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
