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

  async readSpecialties(page?: number) {
    try {
      const pageSize = +env.MAX_RECORD_LENGTH;

      const skip = page ? (page - 1) * pageSize : 0;

      const specialties = skip
        ? await this.prisma.specialty.findMany({
            take: pageSize,
            skip,
          })
        : await this.prisma.specialty.findMany({
            take: pageSize,
          });

      const totalSpecialties = await this.prisma.specialty.count();

      const result = {
        totalCount: totalSpecialties,
        specialties: specialties.map(
          (clinic) =>
            exclude(clinic, ['password', 'createAt', 'updateAt']) || clinic,
        ),
      };

      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async readDetailSpecialtyById(id: number, provinceId?: string) {
    try {
      if (provinceId) {
        const specialty = await this.prisma.specialty.findFirst({
          where: {
            id,
          },
          include: {
            doctorSpecialty: {
              where: {
                provinceId,
              },
              select: {
                doctorInfo: {
                  include: {
                    positionData: {
                      select: {
                        valueEn: true,
                        valueVi: true,
                      },
                    },
                  },
                },
                priceInfo: {
                  select: {
                    valueEn: true,
                    valueVi: true,
                  },
                },
              },
            },
          },
        });
        if (!specialty) {
          throw new HttpException(
            'No specialty was found',
            HttpStatus.NOT_FOUND,
          );
        }
        return exclude(specialty, ['image']);
      }
      if (!provinceId) {
        const specialty = await this.prisma.specialty.findFirst({
          where: {
            id,
          },
          include: {
            doctorSpecialty: {
              select: {
                doctorInfo: {
                  include: {
                    positionData: {
                      select: {
                        valueEn: true,
                        valueVi: true,
                        keyMap: true,
                      },
                    },
                  },
                },
                priceInfo: {
                  select: {
                    valueEn: true,
                    valueVi: true,
                    keyMap: true,
                  },
                },
              },
              take: 10,
            },
          },
        });
        if (!specialty) {
          throw new HttpException(
            'No specialty was found',
            HttpStatus.NOT_FOUND,
          );
        }
        return exclude(specialty, ['image']);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteSpecialty(specialtyId: number) {
    try {
      const specialty = await this.prisma.specialty.delete({
        where: {
          id: specialtyId,
        },
      });

      if (specialty) return specialty;
      throw new HttpException('Could not find', HttpStatus.NOT_FOUND);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateSpecialty(payload: any) {
    try {
      const { specialtyId, ...data } = payload;

      const specialty = await this.prisma.specialty.update({
        where: {
          id: +specialtyId,
        },
        data,
      });
      if (specialty) return specialty;
      throw new HttpException('Unable to update', HttpStatus.BAD_REQUEST);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
