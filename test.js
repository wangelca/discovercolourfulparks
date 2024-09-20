const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Create a new user with the required password field
    const newUser = await prisma.user.create({
      data: {
        clerk_user_id: 'test_id_123',
        email: 'test@example.com',
        username: 'testuser',
        password: 'securepassword123',  // Provide a sample password
      },
    });
    console.log('Created User:', newUser);

    // Fetch the user
    const fetchedUser = await prisma.user.findUnique({
      where: { clerk_user_id: 'test_id_123' },
    });
    console.log('Fetched User:', fetchedUser);

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { clerk_user_id: 'test_id_123' },
      data: { username: 'updateduser' },
    });
    console.log('Updated User:', updatedUser);

    // Delete the user
    const deletedUser = await prisma.user.delete({
      where: { clerk_user_id: 'test_id_123' },
    });
    console.log('Deleted User:', deletedUser);
  } catch (error) {
    console.error('Error during testing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
