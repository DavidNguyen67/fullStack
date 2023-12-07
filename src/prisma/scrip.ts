import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createFakeData(maxFakeRecord) {
  function getRandomPhone(length) {
    return Math.floor(
      Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1),
    );
  }

  function makeEmail() {
    const strValues = 'abcdefg12345';
    let strEmail = '';
    let strTmp;
    for (let i = 0; i < 10; i++) {
      strTmp = strValues.charAt(Math.round(strValues.length * Math.random()));
      strEmail = strEmail + strTmp;
    }
    strTmp = '';
    strEmail = strEmail + '@';
    for (let j = 0; j < 8; j++) {
      strTmp = strValues.charAt(Math.round(strValues.length * Math.random()));
      strEmail = strEmail + strTmp;
    }
    strEmail = strEmail + '.com';
    return strEmail;
  }

  for (let i = 0; i < maxFakeRecord; i++) {
    await prisma.brand.create({
      data: {
        brand_name: `Brand_${Math.floor(i / 3)}`,
        image: null,
      },
    });

    await prisma.category.create({
      data: {
        category_name: `Category_${i}`,
      },
    });

    await prisma.store.create({
      data: {
        store_name: `Store_${Math.floor(i / 3)}`,
        phone: `+${getRandomPhone(2)}${getRandomPhone(7)}`,
        email: `${makeEmail()}`,
        street: `${Math.floor(i / 3) + 100} Main St`,
        city: `City ${String.fromCharCode(65 + Math.floor(i / 3))}`,
        state: `State ${String.fromCharCode(65 + Math.floor(i / 3))}`,
        zip_code: `${getRandomPhone(4)}`,
        storeImage: null,
      },
    });

    await prisma.role.create({
      data: {
        role_name: `Role_${i}`,
        description: `Description_${i}`,
        permissions_id: i + 1,
      },
    });

    await prisma.user.create({
      data: {
        username: `User_${i}`,
        email: `${makeEmail()}`,
        password: `password_${i}`,
        active: true,
        role_id: i + 1,
      },
    });

    await prisma.permission.create({
      data: {
        permission_name: `Permission_${i}`,
        url: `URL_${i}`,
      },
    });

    await prisma.staff.create({
      data: {
        first_name: `Staff_FirstName_${i}`,
        last_name: `Staff_LastName_${i}`,
        email: `${makeEmail()}`,
        phone: `+${getRandomPhone(2)}${getRandomPhone(7)}`,
        active: true,
        store_id: i + 1,
        user_id: i + 1,
      },
    });

    await prisma.customer.create({
      data: {
        first_name: `Customer_FirstName_${i}`,
        last_name: `Customer_LastName_${i}`,
        email: `${makeEmail()}`,
        phone: `+${getRandomPhone(2)}${getRandomPhone(7)}`,
        street: `${i + 200} Oak St`,
        city: `City ${String.fromCharCode(70 + i)}`,
        state: `State ${String.fromCharCode(70 + i)}`,
        zip_code: `${getRandomPhone(4)}`,
      },
    });

    await prisma.product.create({
      data: {
        product_name: `Product_${i}`,
        brand_id: i + 1,
        category_id: i + 1,
        model_year: 2023 + Math.floor(i / 3),
        list_price: (i + 1) * 50,
        image: null,
      },
    });

    await prisma.order.create({
      data: {
        customer_id: i + 1,
        order_status:
          i % 3 === 0 ? 'fulfilled' : i % 2 === 0 ? 'completed' : 'pending',
        order_date: new Date(),
        required_date: new Date(),
        shipped_date: i % 2 === 0 ? new Date() : null,
        store_id: i + 1,
        staff_id: i + 1,
      },
    });

    await prisma.orderItem.create({
      data: {
        order_id: i + 1,
        item_id: i + 1,
        product_id: Math.ceil((i + 1) / 3),
        quantity: i + 1,
        list_price: (i + 1) * 100,
        discount: i % 2 === 0 ? null : i * 5,
      },
    });

    await prisma.stock.create({
      data: {
        store_id: Math.ceil((i + 1) / 4),
        product_id: Math.ceil((i + 1) / 3),
        quantity: ((i + 1) / 3) * 10,
      },
    });
  }
}

const maxFakeRecord = 10;
createFakeData(maxFakeRecord)
  .then(async () => {
    await prisma.$disconnect();
    console.log('Successfully created fake data.');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
