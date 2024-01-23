import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { exclude } from 'src/utils/function';
import * as role from '../../../../utils/constants';
import { env } from 'process';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  async getTopDoctorHome() {
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
        take: +env.MAX_RECORD_LENGTH,
        where: {
          roleId: role.ROLE.DOCTOR,
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
          roleId: role.ROLE.DOCTOR,
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
          doctorInfo: {
            select: {
              addressClinic: true,
              count: true,
              priceInfo: {
                select: {
                  valueEn: true,
                  valueVi: true,
                  keyMap: true,
                },
              },
              provinceInfo: {
                select: {
                  valueEn: true,
                  valueVi: true,
                  keyMap: true,
                },
              },
              paymentInfo: {
                select: {
                  valueEn: true,
                  valueVi: true,
                  keyMap: true,
                },
              },
              clinicInfo: {
                select: {
                  name: true,
                  id: true,
                },
              },
              specialtyInfo: {
                select: {
                  name: true,
                  id: true,
                },
              },
              nameClinic: true,
              note: true,
            },
          },
        },
        where: {
          id: id,
          roleId: role.ROLE.DOCTOR,
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

  async getDoctorCommonInfo(id: number) {
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
          markDown: true,
          doctorInfo: {
            select: {
              addressClinic: true,
              count: true,
              priceInfo: {
                select: {
                  valueEn: true,
                  valueVi: true,
                  keyMap: true,
                },
              },
              provinceInfo: {
                select: {
                  valueEn: true,
                  valueVi: true,
                  keyMap: true,
                },
              },
              paymentInfo: {
                select: {
                  valueEn: true,
                  valueVi: true,
                  keyMap: true,
                },
              },
              nameClinic: true,
            },
          },
        },
        where: {
          id: id,
          roleId: role.ROLE.DOCTOR,
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
          roleId: role.ROLE.DOCTOR,
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
}
