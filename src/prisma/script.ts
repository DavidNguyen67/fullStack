import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.create({
      data: {
        email: 'admin@gmail.com',
        password: 'admin',
        name: 'admin',
        gender: 'male',
        typeRole: 'Role',
        keyRole: 'R1',
      },
    });
    console.log(user);
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
