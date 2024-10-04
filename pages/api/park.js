import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { province } = req.query;

  try {
    // Fetch parks filtered by province if province query param is present
    const parks = await prisma.park.findMany({
      where: province ? { province: decodeURIComponent(province) } : {},
    });

    res.status(200).json(parks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching parks" });
  }
}