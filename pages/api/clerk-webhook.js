import { Webhook } from '@clerk/clerk-sdk-node';
import { PrismaClient } from '@prisma/client';
import { buffer } from 'micro';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Enables detailed logging
});
const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false, // Disable automatic body parsing to handle raw payload
  },
};

export default async function handler(req, res) {
  try {
    // Read the raw body of the request
    const rawBody = await buffer(req);
    const headers = req.headers;

    // Verify the Clerk webhook
    const clerkEvent = Webhook.verify(rawBody.toString(), headers, webhookSecret);

    console.log('Webhook verified. Event:', clerkEvent.type);

    switch (clerkEvent.type) {
      case 'user.created': {
        const { id, email_addresses, username } = clerkEvent.data;
        const email = email_addresses[0]?.email_address;

        if (!email) {
          console.error('Email address is missing in the user.created event');
          return res.status(400).json({ message: 'Email address is required' });
        }

        console.log('Creating user with clerk_user_id:', id, 'and email:', email);

        // Insert the user into the database
        await prisma.user.create({
          data: {
            clerk_user_id: id,
            email,
            username: username || null, // Handle cases where username might not be provided
          },
        });

        console.log('User created successfully in PostgreSQL');
        res.status(200).json({ message: 'User created successfully' });
        break;
      }

      case 'user.updated': {
        const { id, email_addresses, username } = clerkEvent.data;
        const email = email_addresses[0]?.email_address;

        if (!email) {
          console.error('Email address is missing in the user.updated event');
          return res.status(400).json({ message: 'Email address is required' });
        }

        console.log('Updating user with clerk_user_id:', id, 'and email:', email);

        await prisma.user.update({
          where: { clerk_user_id: id },
          data: {
            email,
            username: username || null,
          },
        });

        console.log('User updated successfully in PostgreSQL');
        res.status(200).json({ message: 'User updated successfully' });
        break;
      }

      case 'user.deleted': {
        const { id } = clerkEvent.data;

        console.log('Deleting user with clerk_user_id:', id);

        await prisma.user.delete({
          where: { clerk_user_id: id },
        });

        console.log('User deleted successfully from PostgreSQL');
        res.status(200).json({ message: 'User deleted successfully' });
        break;
      }

      default:
        console.log('Unhandled event type:', clerkEvent.type);
        res.status(400).json({ message: 'Unhandled event type' });
    }
  } catch (error) {
    console.error('Error handling Clerk webhook:', error);

    // Add more specific error handling if needed, such as Prisma connection errors
    if (error.code === 'P2025') {
      // Prisma error code for record not found
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } finally {
    // Properly close the Prisma client connection when done
    await prisma.$disconnect();
  }
}
