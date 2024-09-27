import { prisma } from '../../app/lib/prisma';

export default async function handler(req, res)
 {
try {
  if (!prisma) {
    throw new Error('Prisma client is not initialized');
  }

  const spots = await prisma.spot.findMany();

  res.status(200).json(spots);
} catch (error) {
  console.error('Error fetching users:', error);
  res.status(500).json({ error: 'Failed to fetch users' });
}}