import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.user.createMany({
      data: [
        {
          email: 'doctor1@gmail.com',
          password: 'doctor1',
          name: 'doctor1',
          gender: 'female',
          typeId: 'Role',
          positionId: 'R1',
        },
        {
          email: 'doctor2@gmail.com',
          password: 'doctor2',
          name: 'doctor2',
          gender: 'male',
          typeId: 'Role',
          positionId: 'R2',
        },
      ],
      skipDuplicates: true,
    });
  } catch (error) {
    console.log(error);
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
