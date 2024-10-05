from prisma import Prisma
import asyncio

async def test_prisma():
    prisma = Prisma()
    await prisma.connect()
    users = await prisma.user.find_many()
    print(users)
    await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(test_prisma())
