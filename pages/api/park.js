import { prisma } from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const parks = await prisma.park.findMany();
      res.status(200).json(parks);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching parks' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
