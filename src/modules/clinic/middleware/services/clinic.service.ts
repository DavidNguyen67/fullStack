import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { env } from 'process';
import { PrismaService } from 'src/prisma/prisma.service';
import { exclude } from 'src/utils/function';

@Injectable()
export class ClinicService {
  constructor(private prisma: PrismaService) {}

  async createClinic(payload: any[]) {
    try {
      const clinic = await this.prisma.clinic.createMany({
        data: payload,
      });
      const { count } = clinic;
      if (count < 1) {
        throw new HttpException(
          'No clinics were created. Check your input data.',
          HttpStatus.BAD_REQUEST,
        );
      }
      return clinic;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async readClinics() {
    try {
      const clinics = await this.prisma.clinic.findMany({
        take: +env.MAX_RECORD_LENGTH,
      });
      const { length } = clinics;
      if (length < 1) {
        throw new HttpException('No clinics were found', HttpStatus.NOT_FOUND);
      }
      return clinics.map(
        (clinic) =>
          exclude(clinic, ['password', 'createAt', 'updateAt']) || clinic,
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async readDetailClinicById(id: number) {
    try {
      const clinics = await this.prisma.clinic.findFirst({
        where: {
          id,
        },
        include: {
          doctorClinic: {
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
      if (!clinics) {
        throw new HttpException('No clinics was found', HttpStatus.NOT_FOUND);
      }
      return clinics;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
