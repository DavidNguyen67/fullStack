import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { exclude } from 'src/utils/function';
import * as role from '../../../../utils/constants';
import { UpdateDoctorsDto } from 'src/utils/dto/User.dto';

@Injectable()
export class MarkdownsService {
  constructor(private prisma: PrismaService) {}

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

  async updateMarkDown(payload: UpdateDoctorsDto | any) {
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
