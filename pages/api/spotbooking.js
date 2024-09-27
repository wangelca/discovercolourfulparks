import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, spotId, date } = req.body;

    try {
      const booking = await prisma.booking.create({
        data: {
            id,
          spotId,
          bookingDate: new Date(date),
        },
      });
      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ error: 'Unable to create booking' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
