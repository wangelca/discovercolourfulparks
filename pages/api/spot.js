import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { parkId } = req.query;

  try {
    let spots;

    // If parkId is provided, filter spots by parkId, otherwise return all spots
    if (parkId) {
      spots = await prisma.spot.findMany({
        where: { parkId: parseInt(parkId) }, // Filter by parkId
      });
    } else {
      spots = await prisma.spot.findMany(); // Fetch all spots if no parkId is provided
    }

    res.status(200).json(spots);
  } catch (error) {
    console.error('Error fetching spots:', error);
    res.status(500).json({ error: 'Error fetching spots' });
  }
}
