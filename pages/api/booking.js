import { prisma } from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const bookings = await prisma.booking.findMany();
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching bookings' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
