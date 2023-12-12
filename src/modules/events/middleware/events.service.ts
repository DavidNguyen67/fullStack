import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

@Injectable()
export class EventsService {
  async storeImages(dataImgBuffers: Buffer[]) {
    await prisma.events.createMany({
      data: dataImgBuffers.map((imageBuffer) => ({
        image: imageBuffer,
        events_name: faker.internet.displayName(),
      })),
      skipDuplicates: true,
    });
    return;
  }
  async streamingImages() {
    return await prisma.events.findMany({
      select: {
        events_name: true,
        image: true,
      },
    });
  }
}
