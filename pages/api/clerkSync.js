import { prisma } from '../../app/lib/prisma';  
import { createClerkClient } from '@clerk/nextjs/server'

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

export default async function handler(req, res) {
  try {
    // Fetch all users from Clerk using the SDK
    const userList = await clerkClient.users.getUserList()

    if (!userList || userList.length === 0) {
      return res.status(200).json({ message: 'No users found in Clerk.' });
    }

    // Loop through Clerk users and upsert them into your PostgreSQL database
    for (const user of userList) {
      await prisma.user.upsert({
        where: { clerk_user_id: user.id },  // Match by Clerk user ID
        update: {
          email: user.emailAddresses[0]?.emailAddress || '',
          username: user.username || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          phoneNumber: user.phoneNumbers[0]?.phoneNumber || '',
        },
        create: {
          clerk_user_id: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          username: user.username || '',
          password: 'hashed-password',  // Handle password as needed
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          phoneNumber: user.phoneNumbers[0]?.phoneNumber || '',
        },
      });
    }

    res.status(200).json({ message: 'Users synced successfully' });
  } catch (error) {
    console.error('Error syncing users:', error);
    res.status(500).json({ error: 'Failed to sync users' });
  }
}