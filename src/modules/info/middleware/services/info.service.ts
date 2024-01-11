import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { infoDto } from 'src/utils/dto/info.dto';

@Injectable()
export class InfoService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdateDoctorInfo(payload: infoDto['doctor']) {
    try {
      payload = { ...payload, updateAt: new Date() };
      payload.id && delete payload.id;
      const info = await this.prisma.doctor_info.upsert({
        where: {
          doctorId: payload.doctorId,
        },
        update: payload,
        create: payload,
      });

      if (info) return info;
      throw new HttpException(
        'Cant upsert info for doctor',
        HttpStatus.NOT_FOUND,
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
