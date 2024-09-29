const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    await prisma.park.createMany({
      data: [
        {
          name: 'Banff National Park',
          description: 'Located in the Canadian Rockies in Alberta, Banff is the oldest national park, established in 1885. Known for its stunning mountain landscapes and turquoise lakes like Lake Louise, Banff attracts hundreds of thousands yearly for its natural beauty and endless recreational activities.',
          location: 'Improvement District No. 9, AB T0L',
        },
        {
          name: 'Elk Island National Park',
          description: 'Located in Alberta, Canada, this national park is a sanctuary for wildlife, known for its herds of bison. While relatively small, visitors can be expected to enjoy majestic views, diverse wildlife, and activities like hiking, camping, and stargazing.',
          location: '54401 Range Rd 203, Fort Saskatchewan, AB T8L 0V3',
        },
        {
          name: 'Jasper National Park',
          description: 'Located in the Canadian Rockies in Alberta, Jasper is the largest national park in the region, covering over 11,000 square kilometers. Known for its stunning mountain scenery, glaciers, lakes, and wildlife, the park offers opportunities for hiking, camping, skiing, stargazing, and other activities.',
          location: 'Jasper, AB T0E 1E0',
        },
        {
          name: 'Waterton Lakes National Park',
          description: 'Located in the southern part of Alberta, Waterton Lakes National Park boasts stunning landscapes where the prairies meet the Rocky Mountains. This national park offers beautiful lakes, diverse wildlife, and scenic hiking trails.',
          location: 'Waterton Park, AB T0K 2M0',
        },
        {
          name: 'Glacier National Park',
          description: 'Located in British Columbia, Glacier National Park is known for its dramatic mountain landscapes, glaciers, and dense forests. The park is home to grizzly bears, mountain goats, and over 400 glaciers.',
          location: 'Columbia-Shuswap, BC V0X 1R0',
        },
        {
          name: 'Gulf Islands National Park Reserve',
          description: 'Located in British Columbia, this park is an archipelago of small islands known for its scenic beauty, wildlife, and rich cultural history. The park offers activities like hiking, kayaking, wildlife viewing, and exploration opportunities of its forests, beaches, and marine ecosystems.',
          location: '195-203 Narvaez Bay Rd, Saturna, BC V0N 2Y0',
        },
        {
          name: 'Gwaii Haanas National Park Reserve, National Marine Conservation Area Reserve, and Haida Heritage Site',
          description: 'Located in the southern part of Haida Gwaii, an archipelago off the coast of British Columbia, this park is co-managed by the Haida Nation and the Canadian government. The area is known for its cultural significance, with ancient Haida village sites, traditional totem poles, and stunning natural beauty.',
          location: 'Daajing Giids, BC V0T 1S0',
        },
        {
          name: 'Kootenay National Park',
          description: 'Located in southeastern British Columbia, this national park offers notable attractions like Marble Canyon, Radium Hot Springs, and the Paint Pots. The park offers diverse landscapes, rugged mountains, deep canyons, alpine meadows, and hot springs.',
          location: '7556 Main St E, Radium Hot Springs, V0A 1E0',
        },
        {
          name: 'Mount Revelstoke National Park',
          description: 'Mount Revelstoke is located in British Columbia and is known for its mountain landscapes, alpine meadows, and dense temperate rainforests. Visitors can experience scenic drives, hikes, and diverse wildlife.',
          location: 'Meadows in the Sky Pkwy, Revelstoke, BC V0E 2S0',
        },
        {
          name: 'Pacific Rim National Park Reserve',
          description: 'Located on Vancouver Island in British Columbia, this park is renowned for its stunning coastal scenery and diverse ecosystems. It encompasses lush rainforests, rugged shorelines, and vibrant marine environments.',
          location: 'Pacific Rim National Park Reserve, British Columbia',
        },
        {
          name: 'Yoho National Park',
          description: 'Located in British Columbia, this park was established in 1886, spanning over 1,300 square kilometers, this park includes locations such as Emerald Lake and the breathtaking Takakkaw Falls, one of Canada\'s tallest waterfalls.',
          location: 'Field, BC V0A 1G0',
        },
      ],
    });

    console.log('Parks seeded successfully!');
  } catch (error) {
    console.error('Error seeding parks:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
