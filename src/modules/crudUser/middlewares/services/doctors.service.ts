import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { exclude } from 'src/utils/function';
import * as role from '../../../../utils/constants';
import { UpdateDoctorsDto } from 'src/utils/dto/User.dto';

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
      // we got error that axios cant decode the json response when we return image
      // const response = await .... then log response we got a json string, not object
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

  async getDoctorDetail(id: number) {
    try {
      const doctor = await this.prisma.user.findFirst({
        include: {
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
          markDown: {
            select: {
              contentHTML_VI: true,
              contentHTML_EN: true,
              contentMarkdown_VI: true,
              contentMarkdown_EN: true,
              description_VI: true,
              description_EN: true,
            },
          },
        },
        where: {
          id: id,
          roleId: role.ROLE_DOCTOR_CODE,
        },
        orderBy: {
          id: 'asc',
        },
      });
      if (!doctor || Object.keys(doctor)?.length < 1) {
        throw new HttpException(
          'Doctor not found or invalid Role',
          HttpStatus.NOT_FOUND,
        );
      }
      return exclude(doctor, ['password', 'createAt', 'updateAt']);
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

      payload = { ...payload, updateAt: new Date() };
      payload.id && delete payload.id;

      const user = await this.prisma.markdown.upsert({
        where: {
          doctorId: id,
        },
        update: payload,
        create: payload,
      });

      if (user) return user;
      throw new HttpException(
        'Doctor(s) not found or invalid Role',
        HttpStatus.NOT_FOUND,
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
