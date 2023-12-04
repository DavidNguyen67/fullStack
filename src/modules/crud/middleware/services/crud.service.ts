import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import exclude from 'src/utils/excludeFields/exclude';
// interface FetchUserResponse {
//   data: User[];
//   totalPage: number;
// }
// const base64_encode = (files: Array<Express.Multer.File>) =>
// files.map((file: Express.Multer.File) => file.buffer.toString('base64'));
//  file.buffer.toString('base64');

@Injectable()
export class CrudService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async fetchUsers(take: number, skip: number, page: number) {
    try {
      const [users, totalUsersCount] = await Promise.all([
        this.prisma.user.findMany({
          skip,
          take,
        }),
        this.prisma.user.count(),
      ]);

      const totalPage = Math.ceil(totalUsersCount / take);
      const modifiedUsers = users.map((user) => exclude(user, ['password']));

      return {
        data: modifiedUsers,
        totalPage,
        take,
        skip,
        page,
      };
    } catch (error) {
      return { error: 'Failed to fetch users' };
    }
  }

  async fetchUser(id: number) {
    try {
      const user = await this.prisma.user.findFirst({ where: { id: id } });
      const modifiedUser = exclude(user, ['password']);
      return { user: modifiedUser };
    } catch (error) {
      return { error: 'Failed to fetch users' };
    }
  }

  async deleteUsersService(
    userIds: number[],
  ): Promise<{ success: boolean } | { error: string }> {
    try {
      await this.prisma.user.deleteMany({
        where: {
          id: { in: userIds },
        },
      });
      return { success: true };
    } catch (error) {
      return { error: 'Failed to delete users' };
    }
  }

  async createUser(user: User) {
    const data = user;
    await this.prisma.user.create({
      data,
    });
    console.log(user);
  }

  async uploadFile(files: Array<Express.Multer.File>) {
    // const base64Data = base64_encode(files);
    // const bufferData = base64Data.map((data) => Buffer.from(data, 'base64')); // Convert base64 string to Buffer
    // const bufferData = files.map((file) => file.buffer);
    return await this.prisma.testFileUpload.createMany({
      data: files.map((file) => ({ avatar: file.buffer })),
    });
  }
  async downloadFile() {
    const response = await this.prisma.testFileUpload.findMany({
      select: { avatar: true },
    });
    return response;
  }
}
