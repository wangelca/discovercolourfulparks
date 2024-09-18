// pages/api/[userId].js
import { prisma } from '../lib/prisma';

export default async function handler(req, res) {
  const { userId } = req.query;  // Extract userId from the URL

  try {
    const user = await prisma.user.findUnique({
      where: {
        clerk_user_id: userId,  // Assumes you're using `clerk_user_id` as the identifier
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
}
