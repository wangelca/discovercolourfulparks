import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const events = await prisma.event.findMany();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching events' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
