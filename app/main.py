from fastapi import FastAPI, HTTPException, Query
from prisma import Prisma
from pydantic import BaseModel
from typing import List, Optional
import asyncpg  # assuming you are using PostgreSQL with FastAPI
import databases
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
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


@app.get("/")
async def read_root():
    return {"message": "Hello World"}

@app.get("/parks")
async def get_parks():
    async with Prisma() as db:
        parksRes= await db.park.find_many()
        return parksRes
    
@app.get("/users")
async def get_users():
    async with Prisma() as db:
        usersRes= await db.user.find_many()
        return usersRes

@app.get("/spots")
async def get_spots():
    async with Prisma() as db:
        spotsRes= await db.spot.find_many()
        return spotsRes

@app.get("/events")
async def get_events():
    async with Prisma() as db:
        eventsRes= await db.event.find_many()
        return eventsRes
    

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