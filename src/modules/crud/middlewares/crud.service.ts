import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { exclude } from 'src/utils/excludeFields';

@Injectable()
export class CrudService {
  constructor(private prisma: PrismaService) {}

  async fetchUsers() {
    try {
      const users = await this.prisma.user.findMany({});
      return users.map(
        (user) => exclude(user, ['password', 'createAt', 'updateAt']) || user,
      );
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Error fetching users');
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
      throw new NotFoundException('Error fetching user');
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
      throw new InternalServerErrorException('Error checking email existence');
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

      if (invalidUsers.length > 0) {
        throw new HttpException(
          'Conflict: Some data already exists',
          HttpStatus.CONFLICT,
        );
      }
      throw new InternalServerErrorException('Error creating user(s)');
    } catch (error) {
      return error;
    }
  }
}
