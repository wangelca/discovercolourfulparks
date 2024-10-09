from fastapi import FastAPI, HTTPException, Query, Depends
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from database import database, SessionLocal
from models import Park, Spot, Event, User
from fastapi.middleware.cors import CORSMiddleware
import datetime

app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app runs here
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Dependency to get the SQLAlchemy session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.get("/")
def read_root():
    return {"message": "Welcome to Colorful National Parks!"}

# Define a Pydantic model for Park, Spot, etc. if needed
class ParkReponse(BaseModel):
    parkId: int
    name: str
    province: str
    description: str
    location: str
    parkImageUrl: List[str]
    parameters: str

    class Config:
        orm_mode=True

class EventReponse(BaseModel):
    eventId: int
    parkId: int
    eventName: str
    eventLocation: str
    fee: float
    description: str
    discount: float
    startDate: datetime
    endDate: datetime
    eventImageUrl: List[str]
    parameters: Optional[str] = None
    requiredbooking: bool    

    class Config:
        orm_mode=True
        arbitrary_types_allowed = True

@app.get("/parks", response_model=List[ParkReponse])
async def get_parks(db: Session = Depends(get_db)):
    parks = db.query(Park).all()
    return parks

@app.get("/events", response_model=List[EventReponse])
async def get_events(db: Session = Depends(get_db)):
    events = db.query(Event).all()
    return events

