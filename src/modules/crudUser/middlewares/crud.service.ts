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
import * as bcrypt from 'bcrypt';
const saltOrRounds = 10;

@Injectable()
export class CrudService {
  constructor(private prisma: PrismaService) {}

  async fetchUsers() {
    try {
      const users = await this.prisma.user.findMany({});
      if (users.length < 0) throw new NotFoundException('Not found user(s)');

      // return users.map(
      //   (user) => exclude(user, ['password', 'createAt', 'updateAt']) || user,
      // );
      return users;
    } catch (error) {
      console.log(error);
      throw error;
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
        throw new NotFoundException('User(s) not found');
      }
      return users.map(
        (user) => exclude(user, ['password', 'createAt', 'updateAt']) || user,
      );
    } catch (error) {
      console.log(error);
      throw error;
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
      throw error;
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
          ? (validUsers = [
              ...validUsers,
              {
                ...user,
                password: await bcrypt.hash(user.password, saltOrRounds),
              },
            ])
          : (invalidUsers = [...validUsers, { ...user }]);
      }

      if (validUsers.length > 0) {
        const createdUsers = await this.prisma.user.createMany({
          data: validUsers,
        });
        return createdUsers;
      }

      if (invalidUsers.length > 0)
        throw new ConflictException('Duplicate user(s) data');
      throw new InternalServerErrorException('Error creating user(s)');
    } catch (error) {
      console.log(error);
      throw error;
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
        throw new NotFoundException('User(s) not found');

      return user.count;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateUsers(userId: number[], payload: UpdateUserDto) {
    const hash = await bcrypt.hash(payload.password, saltOrRounds);
    payload = { ...payload, updateAt: new Date(), password: hash };
    try {
      if (!payload.email || !(await this.isExistEmail(payload.email))) {
        const user = await this.prisma.user.updateMany({
          data: payload,
          where: {
            id: {
              in: userId,
            },
          },
        });
        if (user && user.count > 0) return user.count;
        throw new NotFoundException('User(s) not found');
      } else throw new ConflictException('Duplicate user(s) data');
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
