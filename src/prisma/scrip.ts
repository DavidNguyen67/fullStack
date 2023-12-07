import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createFakeData = async () => {};

createFakeData()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Successfully created fake data.');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
