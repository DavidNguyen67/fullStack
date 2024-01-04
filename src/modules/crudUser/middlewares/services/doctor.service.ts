import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { exclude } from 'src/utils/function';
import * as role from './../../../../utils/constants';

@Injectable()
export class DoctorService {
  constructor(private prisma: PrismaService) {}

  async getTopDoctorHome(limit: number) {
    try {
      const doctors = await this.prisma.user.findMany({
        include: {
          genderData: {
            select: {
              valueEn: true,
              valueVi: true,
            },
          },
          positionData: {
            select: {
              valueEn: true,
              valueVi: true,
            },
          },
          roleData: {
            select: {
              valueEn: true,
              valueVi: true,
            },
          },
        },
        take: limit,
        where: {
          roleId: role.ROLE_DOCTOR_CODE,
        },
        orderBy: {
          createAt: 'asc',
        },
      });

      if (!doctors || doctors.length === 0) {
        throw new NotFoundException('User(s) not found');
      }
      return doctors.map(
        (doctor) =>
          exclude(doctor, ['password', 'createAt', 'updateAt']) || doctor,
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
