// pages/api/signup.js
import { getAuth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { Clerk } from '@clerk/clerk-sdk-node';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  console.log('Received request on /api/signup');

  if (req.method === 'POST') {
    const { userId } = getAuth(req);

    if (!userId) {
      console.error('Unauthorized access - no user ID');
      return res.status(401).json({ error: 'Unauthorized access' });
    }

    try {
      // Fetch user details from Clerk
      const user = await Clerk.users.getUser(userId);
      if (!user.emailAddresses || user.emailAddresses.length === 0) {
        console.error('User email is missing in Clerk data');
        return res.status(400).json({ error: 'User email is required' });
      }

      const email = user.emailAddresses[0].emailAddress;
      const username = user.username || null; // Default to null if not provided

      // Ensure password handling - this example assumes Clerk handles authentication
      // If you need to manage a password, ensure it's hashed securely
      const password = 'defaultPassword'; // Replace this with a secure method
      const hashedPassword = await bcrypt.hash(password, 10);

      console.log('Syncing user with Clerk ID:', user.id, 'and email:', email, 'and username:', username);

      // Upsert user in the database
      await prisma.user.upsert({
        where: { clerk_user_id: user.id },
        update: { email, username, password: hashedPassword },
        create: {
          clerk_user_id: user.id,
          email,
          username,
          password: hashedPassword, // Ensure the password field is handled
        },
      });

      res.status(201).json({ message: 'User signed up and synced successfully' });
    } catch (error) {
      console.error('Error syncing user on signup:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      // Close Prisma connection
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
