import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const bookings = await prisma.booking.findMany({
        include: {
          event: true,  
          user: true,   
        },
      });
      res.status(200).json(bookings);  
    } catch (error) {
      res.status(500).json({ error: 'Error fetching bookings' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
