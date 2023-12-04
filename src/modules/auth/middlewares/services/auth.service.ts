import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { IAuth } from '../../interfaces/authinterface';

@Injectable()
export class AuthService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
  async checkUser(payload: IAuth): Promise<boolean> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email: payload.email },
        select: {
          password: true,
        },
      });
      const { password } = user;
      console.log(payload);

      return payload.password === password;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
