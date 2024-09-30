import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { eventId, id, spotId, bookingStartTime } = req.body;  


    const userExists = await prisma.user.findUnique({ where: { id } });

    if (!userExists) {
      return res.status(400).json({ error: 'User does not exist' });
    }

   
    const spotExists = await prisma.spot.findUnique({ where: { spotId } });

    if (!spotExists) {
      return res.status(400).json({ error: 'Spot does not exist' });
    }

    try {
      const newBooking = await prisma.booking.create({
        data: {
          eventId,
          userId: id,  
          spotId,
          bookingDate: new Date(),
          bookingStatus: 'confirmed',
          bookingStartTime: new Date(bookingStartTime),
        },
      });
      res.status(201).json({ success: true, booking: newBooking });
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ success: false, error: 'Error creating booking' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
