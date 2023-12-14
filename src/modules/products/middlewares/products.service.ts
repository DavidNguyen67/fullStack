import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ProductsService {
  async storeImages(dataImgBuffers: Buffer[]) {
    dataImgBuffers.forEach(async (buffer) => {
      await prisma.product.updateMany({
        where: {
          image: null, // Your condition here to match products with null images
        },
        data: {
          image: buffer,
        },
      });
    });
    return;
  }

  async streamingImages() {
    return await prisma.product.findMany({
      select: {
        product_name: true,
        image: true,
        product_id: true,
      },
    });
  }
  async streamingImage(product_id: number) {
    return await prisma.product.findFirst({
      where: {
        product_id: product_id,
      },
      select: {
        product_name: true,
        image: true,
        product_id: true,
      },
    });
  }
}
