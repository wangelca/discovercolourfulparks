from fastapi import FastAPI, HTTPException, Query
from prisma import Prisma
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import sys

sys.path.append('./node_modules/@prisma/client')

load_dotenv()

app = FastAPI()
prisma = Prisma()

class SpotOut(BaseModel):
    spotId: int
    parkId: int
    spotName: str
    spotDescription: str
    spotHourlyRate: float
    spotDiscount: float
    spotLocation: str
    spotImageUrl: List[str]
    parameters: Optional[str]
    requiredbooking: bool

class EventOut(BaseModel):
    eventId: int
    parkId: int
    eventName: str
    description: str
    startDate: datetime  # This should match your Prisma schema type
    endDate: datetime    # This should match your Prisma schema type
    eventImageUrl: List[str]
    eventLocation: str
    fee: float
    discount: float
    parameters: Optional[str]
    requiredbooking: bool

    class Config:
        orm_mode = True  # This enables working with ORM objects

class ParkOut(BaseModel):
    parkId: int
    name: str
    province: str  
    description: str
    location: str
    parkImageUrl: List[str]  # List of strings for the image URLs
    parameters: Optional[str]  # parameters is optional

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app runs here
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@app.on_event("startup")
async def startup():
    await prisma.connect()


@app.on_event("shutdown")
async def shutdown():
    await prisma.disconnect()

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

@app.get("/api/parks", response_model=List[ParkOut])
async def get_parks(province: Optional[str] = Query(None)):
    if province:
        parks = await prisma.park.find_many(
            where={"province": province},
            include={"events": True, "spots": True}  # Include relations
        )
    else:
        parks = await prisma.park.find_many(
            include={"events": True, "spots": True}  # Include relations
        )

    if not parks:
        raise HTTPException(status_code=404, detail="No parks found")

    # Ensure `events` and `spots` are not `None`
    for park in parks:
        if park.events is None:
            park.events = []
        if park.spots is None:
            park.spots = []

    return parks


    
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
    
@app.get("/api/spots", response_model=List[SpotOut])
async def get_spots(parkId: int):
    spots = await prisma.spot.find_many(
        where={"parkId": parkId}
    )
    if not spots:
        raise HTTPException(status_code=404, detail="No spots found for this park")
    return spots    

@app.get("/events")
async def get_events_list():
    async with Prisma() as db:
        eventsRes= await db.event.find_many()
        return eventsRes
    
@app.get("/events/{eventId}")
async def specific_event(eventId: int):
    async with Prisma() as db:
        eventRes = await db.event.find_unique(where={"eventId": eventId})
        
        if not eventRes:
            raise HTTPException(status_code=404, detail="Event not found")
        
        return eventRes
    
@app.get("/api/events", response_model=List[EventOut])
async def get_events(parkId: int):
    # Fetch the events based on parkId
    events = await prisma.event.find_many(
        where={"parkId": parkId}
    )
    
    # Check if no events found, and raise 404
    if not events:
        raise HTTPException(status_code=404, detail="No events found for this park")

    # No need to manually convert DateTime fields, FastAPI will handle it with Pydantic models
    return events


    
@app.get("/events/{eventId}")
async def get_event(eventId: int):
    async with Prisma() as db:
        eventRes = await db.event.find_unique(where={"eventId": eventId})
        
        if not eventRes:
            raise HTTPException(status_code=404, detail="Event not found")
        
        return eventRes       
