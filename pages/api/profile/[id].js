import { prisma } from '../../../app/lib/prisma';  

export default async function handler(req, res) {
  const { id } = req.query; // Clerk's user ID

  if (req.method === 'GET') {
    try {
      // Fetch user data from database
      const user = await prisma.user.findUnique({
        where: { clerk_user_id: id }
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch user profile' });
    }
  } else if (req.method === 'PUT') {
    const { firstName, lastName, phoneNumber } = req.body;

    try {
      // Update user profile in the database
      const updatedUser = await prisma.user.update({
        where: { clerk_user_id: id },
        data: { firstName, lastName, phoneNumber }
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update user profile' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
