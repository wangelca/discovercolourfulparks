import { prisma } from '../../app/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const parks = await prisma.park.findMany(); // Fetch all parks
      res.status(200).json(parks);
    } catch (error) {
      console.error('Error fetching parks:', error);
      res.status(500).json({ error: 'Unable to fetch parks' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
