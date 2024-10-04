import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { parkId } = req.query;

  try {
    let events;

    // If parkId is provided, filter events by parkId, otherwise return all events
    if (parkId) {
      events = await prisma.event.findMany({
        where: { parkId: parseInt(parkId) }, // Filter by parkId
      });
    } else {
      events = await prisma.event.findMany(); // Fetch all events if no parkId is provided
    }

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Error fetching events' });
  }
}
