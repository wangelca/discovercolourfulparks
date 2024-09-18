import { prisma } from '../../app/lib/prisma';  // Adjust path if necessary

export default async function handler(req, res) {
  try {
    // Fetch all users from the database
    const users = await prisma.user.findMany();

    // Return the users in the response
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}
