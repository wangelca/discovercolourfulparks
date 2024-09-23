import { prisma } from '../../app/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const payments = await prisma.payment.findMany();
      res.status(200).json(payments);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching payments' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
