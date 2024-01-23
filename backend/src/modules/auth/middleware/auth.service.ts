import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { exclude } from 'src/utils/function';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async loginService(username: string, password: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email: username },
      });

      if (
        user &&
        ((await bcrypt.compare(password, user.password)) ||
          password === user.password)
      ) {
        const data =
          exclude(user, ['password', 'createAt', 'updateAt', 'image']) || user;

        return {
          ...data,
          access_token: await this.jwtService.signAsync({
            id: data.id,
            roleId: data.roleId,
          }),
        };
      } else throw new UnauthorizedException('Wrong password or username');
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
