import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { eventId, id, spotId, bookingStartTime } = req.body;  

    if (!eventId || !id || !spotId || !bookingStartTime) {
      return res.status(400).json({ error: 'Missing required fields: eventId, userId (id), spotId, or bookingStartTime.' });
    }


    const bookingStart = new Date(bookingStartTime);
    if (isNaN(bookingStart.getTime())) {
      return res.status(400).json({ error: 'Invalid booking start time format.' });
    }

    try {
      const userExists = await prisma.user.findUnique({ where: { id: parseInt(id) } });
      if (!userExists) {
        return res.status(400).json({ error: 'User does not exist.' });
      }

      const spotExists = await prisma.spot.findUnique({ where: { spotId: parseInt(spotId) } });
      if (!spotExists) {
        return res.status(400).json({ error: 'Spot does not exist.' });
      }

      // Create new booking
      const newBooking = await prisma.booking.create({
        data: {
          eventId: parseInt(eventId), 
          id: parseInt(id),           
          spotId: parseInt(spotId),  
          bookingDate: new Date(),    
          bookingStatus: 'confirmed', 
          bookingStartTime: bookingStart, 
        },
      });

      return res.status(201).json({ success: true, booking: newBooking });
    } catch (error) {
      console.error('Error creating booking:', error);
      return res.status(500).json({ success: false, error: 'Error creating booking.' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed. Please use POST.' });
  }
}
