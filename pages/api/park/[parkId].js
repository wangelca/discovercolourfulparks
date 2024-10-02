import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { parkId } = req.query;
  try {
    const park = await prisma.park.findUnique({
      where: { parkId: parseInt(parkId, 10) },
    });

    if (!park) {
      return res.status(404).json({ message: 'Park not found' });
    }

    res.status(200).json(park);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
