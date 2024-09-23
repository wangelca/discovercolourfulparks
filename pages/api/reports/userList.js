import { prisma } from '../../../app/lib/prisma';

export default async function handler(req, res) {
  try {
    const userList = await prisma.user.findMany();  // Fetch all users from the database
    res.status(200).json(userList);
  } catch (error) {
    console.error('Error fetching user list:', error);
    res.status(500).json({ error: 'Failed to fetch user list' });
  }
}
