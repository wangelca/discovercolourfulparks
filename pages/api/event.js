import { prisma } from '../../app/lib/prisma'; 

export default async function handler(req, res) {
  try {
    if (!prisma) {
      throw new Error('Prisma client is not initialized');
    }
  
    const events = await prisma.event.findMany();

    // Return the users in the response
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
}
