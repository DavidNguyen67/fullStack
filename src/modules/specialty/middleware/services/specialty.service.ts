import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { env } from 'process';
import { PrismaService } from 'src/prisma/prisma.service';
import { exclude } from 'src/utils/function';

@Injectable()
export class SpecialtyService {
  constructor(private prisma: PrismaService) {}

  async createSpecialty(payload: any[]) {
    try {
      const specialty = await this.prisma.specialty.createMany({
        data: payload,
      });
      const { count } = specialty;
      if (count < 1) {
        throw new HttpException(
          'No specialties were created. Check your input data.',
          HttpStatus.BAD_REQUEST,
        );
      }
      return specialty;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async readSpecialties() {
    try {
      const specialties = await this.prisma.specialty.findMany({
        take: +env.MAX_RECORD_LENGTH,
      });
      const { length } = specialties;
      if (length < 1) {
        throw new HttpException(
          'No specialties were found',
          HttpStatus.NOT_FOUND,
        );
      }
      return specialties.map(
        (specialty) =>
          exclude(specialty, ['password', 'createAt', 'updateAt']) || specialty,
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
