// pages/api/get-clerk-users.js
import { users } from '@clerk/clerk-sdk-node';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch all users from Clerk
      const allUsers = await users.getUserList();

      // Return the list of users
      res.status(200).json(allUsers);
    } catch (error) {
      console.error('Error fetching Clerk users:', error);
      res.status(500).json({ error: 'Failed to fetch Clerk users' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
