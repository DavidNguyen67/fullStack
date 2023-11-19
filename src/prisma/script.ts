import { PrismaClient } from '@prisma/client';
import { HealthCheckError } from '@nestjs/terminus';
const prisma = new PrismaClient();

async function main() {
  try {
    await this.prismaService.$queryRaw`SELECT 1`;
    console.log('Connected to prisma');
  } catch (e) {
    throw new HealthCheckError('Prisma check failed', e);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
