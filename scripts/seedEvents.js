const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    await prisma.event.createMany({
      data: [
        {
          eventName: 'Indigenous Voices',
          eventLocation: '311 Cave Ave, Banff, AB T1L 1K2',
          fee: 9.0,
          description: 'Cave and Basin National Historic Site is honored to present a collection of artworks, exhibits and programs from vibrant Indigenous communities with traditional and contemporary connections to Banff (including the Nakoda, Siksika, Kainai, Piikani, Tsuut ina, Ktunaxa, Secw pemc and Métis).',
          discount: 7.5,
          startDate: new Date('2024-10-15'),
          startTime: '5:00PM',
          endDate: new Date('2024-10-15'),
          endTime: '9:30AM',
          parkId: 1,
        },
        {
          eventName: 'Art In Nature Trail',
          eventLocation: 'Location Start at the Banff Park Museum',
          fee: 0.0,
          description: "Banff's newest art exhibition isn't inside a gallery, and you don't need a ticket. It's part of the beauty of nature as you explore the Art in Nature Trail along the Bow River in Banff.",
          discount: 0.0,
          startDate: new Date('2024-09-30'),
          startTime: 'Daylight',
          endDate: new Date('2024-09-30'),
          endTime: 'Daylight',
          parkId: 1,
        },
        {
          eventName: 'Fall Equinox Release & Reset Yoga Workshop',
          eventLocation: 'Banff Yoga Practice',
          fee: 60.0,
          description: 'Join Alyssa for a rejuvenating weekend of yoga, meditation, & journaling to send off summer and welcome in fall. Bringing her strong connection to nature, grounding energy, and a playful sense of curiosity to the mat, you will be guided through a journey of reflection and intention setting to rekindle your inner flame.',
          discount: 0.0,
          startDate: new Date('2024-09-22'),
          startTime: '4:00PM',
          endDate: new Date('2024-09-21'),
          endTime: '2:00PM',
          parkId: 1,
        },
        {
          eventName: 'Downtown Foodie Tour',
          eventLocation: '500 Connaught Dr, Jasper, AB, Canada T0E 1E0',
          fee: 125.0,
          description: "On this 1.5 KM downtown guided walk, you'll be visiting four restos and tasting four carefully handpicked dishes paired with four boozie treats and listening to Jasper's top tales along the way. What's on the menu? Not telling. It's all part of the adventure. Price includes food, drinks, and gratuities at the restaurants. Tips for the guide are appreciated at your discretion.",
          discount: 0.0,
          startDate: new Date('2026-01-31'),
          startTime: '5:30PM',
          endDate: new Date('2024-09-28'),
          endTime: '2:30PM',
          parkId: 3,
        }
      ]
    });

    console.log('Events seeded successfully!');
  } catch (error) {
    console.error('Error seeding events:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
