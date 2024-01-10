import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from 'src/utils/dto/User.dto';
import { exclude } from 'src/utils/function';
import * as bcrypt from 'bcrypt';
const saltOrRounds = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async fetchUsers() {
    try {
      const users = await this.prisma.user.findMany({
        orderBy: {
          id: 'asc',
        },
      });
      if (users.length < 1)
        throw new HttpException('User(s) not found', HttpStatus.NOT_FOUND);

      return users.map(
        (user) => exclude(user, ['password', 'createAt', 'updateAt']) || user,
      );
      // return users;
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
        orderBy: {
          id: 'asc',
        },
      });
      if (!users || users.length === 0) {
        throw new HttpException('User(s) not found', HttpStatus.NOT_FOUND);
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
        const password =
          user.password && (await bcrypt.hash(user.password, saltOrRounds));

        !isEmailExists
          ? (validUsers = [
              ...validUsers,
              {
                ...user,
                password,
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
        throw new HttpException('Invalid Doctor(s) data', HttpStatus.CONFLICT);
      throw new HttpException(
        'Error creating user(s)',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
        throw new HttpException('User(s) not found', HttpStatus.NOT_FOUND);

      return user.count;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateUsers(payload: UpdateUserDto | any) {
    try {
      const id = payload.id;
      const isExist = !!(await this.fetchUser([id]));
      if (!isExist)
        throw new HttpException('User(s) not found', HttpStatus.NOT_FOUND);
      let hash = null;
      if (payload.password)
        hash = await bcrypt.hash(payload.password, saltOrRounds);

      payload = hash
        ? { ...payload, updateAt: new Date(), password: hash }
        : { ...payload, updateAt: new Date() };

      if (!payload.email || !(await this.isExistEmail(payload.email))) {
        payload.id && delete payload.id;
        const user = await this.prisma.user.update({
          data: payload,
          where: {
            id: id,
          },
        });

        if (user) return user;
      } else
        throw new HttpException(
          'Duplicate Doctor(s) data',
          HttpStatus.CONFLICT,
        );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
