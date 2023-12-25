import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from 'src/utils/dto/User.dto';
import { exclude } from 'src/utils/function';

@Injectable()
export class AllCodeService {
  constructor(private prisma: PrismaService) {}

  async fetchUsers() {
    try {
      const users = await this.prisma.user.findMany({});
      if (users.length < 0) throw new NotFoundException('Not found users');

      // return users.map(
      //   (user) => exclude(user, ['password', 'createAt', 'updateAt']) || user,
      // );
      return users;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async fetchUser(id: number[]) {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          id: {
            in: id,
          },
        },
      });
      if (!users || users.length === 0) {
        throw new NotFoundException('User not found');
      }
      return users.map(
        (user) => exclude(user, ['password', 'createAt', 'updateAt']) || user,
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async isExistEmail(email: string): Promise<boolean> {
    try {
      const users = await this.prisma.user.findFirst({
        where: {
          email: {
            equals: email,
          },
        },
      });
      return !!users;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async createUsers(users: User | User[]): Promise<any> {
    try {
      if (!Array.isArray(users)) users = [users];

      let validUsers: User[] = [];
      let invalidUsers: User[] = [];

      for (const user of users) {
        const isEmailExists = await this.isExistEmail(user.email);

        !isEmailExists
          ? (validUsers = [...validUsers, { ...user }])
          : (invalidUsers = [...validUsers, { ...user }]);
      }

      if (validUsers.length > 0) {
        const createdUsers = await this.prisma.user.createMany({
          data: validUsers,
        });
        return createdUsers;
      }

      if (invalidUsers.length > 0) throw new ConflictException();
      throw new InternalServerErrorException('Error creating user(s)');
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async deleteUsers(userId: number[]) {
    try {
      const user = await this.prisma.user.deleteMany({
        where: {
          id: {
            in: userId,
          },
        },
      });
      if (!user || user.count === 0)
        throw new NotFoundException('User not found');

      return user.count;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async updateUsers(userId: number[], payload: UpdateUserDto) {
    payload = { ...payload, updateAt: new Date() };
    if (!payload.email || !(await this.isExistEmail(payload.email))) {
      try {
        const user = await this.prisma.user.updateMany({
          data: payload,
          where: {
            id: {
              in: userId,
            },
          },
        });
        if (user && user.count > 0) return user.count;
        throw new NotFoundException('User not found');
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException(error);
      }
    } else throw new ConflictException();
  }

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
      if (allCode.length < 0) throw new NotFoundException('Not found all code');
      return allCode;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
