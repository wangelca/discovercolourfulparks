const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Test fetching users
    const users = await prisma.user.findMany();
    console.log('Fetched users:', users);

    // You can add more CRUD operations here to test further
  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
