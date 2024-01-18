import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { env } from 'process';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateClinicDTO } from 'src/utils/dto/clinic.dto';
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

  async readClinics(page?: number) {
    try {
      const pageSize = +env.MAX_RECORD_LENGTH;

      const skip = page ? (page - 1) * pageSize : 0;

      const clinics = await this.prisma.clinic.findMany({
        take: pageSize,
        skip,
      });

      const totalClinics = await this.prisma.clinic.count();

      const result = {
        totalCount: totalClinics,
        clinics: clinics.map(
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

  async readClinic(id?: number) {
    try {
      const clinics = await this.prisma.clinic.findFirst({
        where: {
          id: id,
        },
      });

      return clinics;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteClinic(clinicId: number) {
    try {
      const clinics = await this.prisma.clinic.delete({
        where: {
          id: clinicId,
        },
      });

      if (clinics) return clinics;
      throw new HttpException('Could not find', HttpStatus.NOT_FOUND);
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

  async updateClinic(payload: UpdateClinicDTO) {
    try {
      const { clinicId, ...data } = payload;

      const clinic = await this.prisma.clinic.update({
        where: {
          id: +clinicId,
        },
        data,
      });
      if (clinic) return clinic;
      throw new HttpException('Unable to update', HttpStatus.BAD_REQUEST);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
