from fastapi import FastAPI, HTTPException, Query
from prisma import Prisma
from pydantic import BaseModel
from typing import List, Optional
import asyncpg  # assuming you are using PostgreSQL with FastAPI
import databases
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
prisma = Prisma()

DATABASE_URL = "postgresql://postgres:2131@localhost:5432/ColorfulNationalParks"  # Update this with your DB details
database = databases.Database(DATABASE_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app runs here
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.get("/parks")
async def get_parks():
    async with Prisma() as db:
        parksRes= await db.park.find_many()
        return parksRes
    
@app.get("/parks/{parkId}")
async def get_park(parkId: int):
    async with Prisma() as db:
        parkRes = await db.park.find_unique(where={"parkId": parkId})
        
        if not parkRes:
            raise HTTPException(status_code=404, detail="Park not found")
        
        return parkRes

    
@app.get("/get_users")
async def get_users():
    async with Prisma() as db:
        users_res = await db.user.find_many()
        return users_res

@app.get("/spots")
async def get_spots():
    async with Prisma() as db:
        spotsRes= await db.spot.find_many()
        return spotsRes
    
@app.get("/spots/{spotId}")
async def get_spot(spotId: int):
    async with Prisma() as db:
        spotRes = await db.spot.find_unique(where={"spotId": spotId})
        
        if not spotRes:
            raise HTTPException(status_code=404, detail="Spot not found")
        
        return spotRes
    

@app.get("/events")
async def get_events():
    async with Prisma() as db:
        eventsRes= await db.event.find_many()
        return eventsRes
    
@app.get("/events/{eventId}")
async def get_event(eventId: int):
    async with Prisma() as db:
        eventRes = await db.event.find_unique(where={"eventId": eventId})
        
        if not eventRes:
            raise HTTPException(status_code=404, detail="Event not found")
        
        return eventRes       

class Spot(BaseModel):
    id: int
    name: str
    park_id: int

@app.get("/api/spot", response_model=List[Spot])
async def get_spots(parkId: Optional[int] = Query(None, alias="parkId")):
    query = "SELECT * FROM spots"  # Adjust to your table structure
    if parkId is not None:
        query += " WHERE park_id = :parkId"
        values = {"parkId": parkId}
    else:
        values = {}

    try:
        spots = await database.fetch_all(query=query, values=values)
        return spots
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error fetching spots")