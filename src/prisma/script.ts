import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.user.create({
      data: {
        email: 'admin@gmail.com',
        password: 'admin',
        name: 'admin',
        gender: 'male',
        typeId: 'Role',
        positionId: 'R1',
      },
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
