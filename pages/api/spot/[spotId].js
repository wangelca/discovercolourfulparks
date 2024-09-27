import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { spotId } = req.query;
  console.log('Received spotId:', spotId); // Log the received spotId

  try {
    const spot = await prisma.spot.findUnique({
      where: { spotId: parseInt(spotId, 10) },
    });

    if (!spot) {
      return res.status(404).json({ message: 'Spot not found' });
    }

    res.status(200).json(spot);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
