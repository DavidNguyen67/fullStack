import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { exclude } from 'src/utils/function';
import * as role from '../../../../utils/constants';
import { UpdateDoctorsDto } from 'src/utils/dto/User.dto';
import * as bcrypt from 'bcrypt';
const saltOrRounds = 10;

@Injectable()
export class DoctorsService {
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
        throw new HttpException(
          'Doctor(s) not found or invalid Role',
          HttpStatus.NOT_FOUND,
        );
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

  async getDoctors(id: number[]) {
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
        where: {
          id: {
            in: id,
          },
          roleId: role.ROLE_DOCTOR_CODE,
        },
        orderBy: {
          id: 'asc',
        },
      });
      if (!doctors || doctors.length === 0) {
        throw new HttpException(
          'Doctor(s) not found or invalid Role',
          HttpStatus.NOT_FOUND,
        );
      }
      return doctors.map(
        (doctor) =>
          exclude(doctor, ['password', 'createAt', 'updateAt', 'image']) ||
          doctor,
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAllDoctors() {
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
        where: {
          roleId: role.ROLE_DOCTOR_CODE,
        },
        orderBy: {
          id: 'asc',
        },
      });
      if (!doctors || doctors.length === 0) {
        throw new HttpException(
          'Doctor(s) not found or invalid Role',
          HttpStatus.NOT_FOUND,
        );
      }
      return doctors.map(
        (doctor) =>
          exclude(doctor, ['password', 'createAt', 'updateAt', 'image']) ||
          doctor,
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

  async updateDoctors(payload: UpdateDoctorsDto | any) {
    try {
      const id = payload.id;
      const isExist = !!(await this.getDoctors([id]));
      if (!isExist)
        throw new HttpException(
          'Doctor(s) not found or invalid Role',
          HttpStatus.NOT_FOUND,
        );

      let hash = null;
      if (payload.password)
        hash = await bcrypt.hash(payload.password, saltOrRounds);

      payload = hash
        ? { ...payload, updateAt: new Date(), password: hash }
        : { ...payload, updateAt: new Date() };

      if (!payload.email || !(await this.isExistEmail(payload.email))) {
        payload.id && delete payload.id;
        const user = await this.prisma.markdown.upsert({
          where: {
            id: id,
          },
          update: payload,
          create: payload,
        });

        if (user) return user;
        throw new HttpException(
          'Doctor(s) not found or invalid Role',
          HttpStatus.NOT_FOUND,
        );
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
