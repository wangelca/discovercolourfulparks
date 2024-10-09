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

class SpotReponse(BaseModel):
    spotId: int
    parkId: int
    spotName: str
    spotDescription: str
    spotHourlyRate: float
    spotDiscount: float
    spotLocation: str
    spotImageUrl: Optional [List[str]] = None
    parameters: Optional[str] = None
    requiredbooking: bool

    class Config:
        orm_mode=True

class UserReponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime
    updatedAt: datetime
    firstName: str
    lastName: str
    phoneNumber: str
    publicMetadata: str    

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

@app.get("/spots", response_model=List[SpotReponse])
async def get_spots(db: Session = Depends(get_db)):
    spots = db.query(Spot).all()
    return spots

@app.get("/users", response_model=List[UserReponse])
async def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

@app.get("/users/{user_id}", response_model=UserReponse)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

#update the user by userId
@app.put("/users/{user_id}", response_model=UserReponse)
async def update_user(user_id: int, user: UserReponse, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    user.firstName = user.firstName
    user.lastName = user.lastName
    user.phoneNumber = user.phoneNumber
    db.commit()
    return user

#update the park by parkId
@app.put("/parks/{parkId}", response_model=ParkReponse)
async def update_park(parkId: int, park: ParkReponse, db: Session = Depends(get_db)):
    park = db.query(Park).filter(Park.parkId == parkId).first()
    if park is None:
        raise HTTPException(status_code=404, detail="Park not found")
    park.name = park.name
    park.province = park.province
    park.description = park.description
    park.location = park.location
    park.parkImageUrl = park.parkImageUrl
    park.parameters = park.parameters
    db.commit()
    return park

#add a new park
@app.post("/parks/add", response_model=ParkReponse)
async def create_park(park: ParkReponse, db: Session = Depends(get_db)):
    new_park = Park(parkId=park.parkId, name=park.name, province=park.province, description=park.description, location=park.location, parkImageUrl=park.parkImageUrl, parameters=park.parameters)
    db.add(new_park)
    db.commit()
    db.refresh(new_park)
    return new_park

@app.get("/parks/{parkId}", response_model=ParkReponse)
async def get_park(parkId: int, db: Session = Depends(get_db)):
    park = db.query(Park).filter(Park.parkId == parkId).first()
    if park is None:
        raise HTTPException(status_code=404, detail="Park not found")
    return park

#filter the park by province
@app.get("/parks/province/{selectedProvince}", response_model=List[ParkReponse])
async def get_park_by_province(selectedProvince: str, db: Session = Depends(get_db)):
    park = db.query(Park).filter(Park.province == selectedProvince).all()
    if park is None:
        raise HTTPException(status_code=404, detail="Park not found")
    return park

#get all spots in a park
@app.get("/parks/{parkId}/spots", response_model=List[SpotReponse])
async def get_park_spots(parkId: int, db: Session = Depends(get_db)):
    park = db.query(Park).filter(Park.parkId == parkId).first()
    if park is None:
        raise HTTPException(status_code=404, detail="Park not found")
    return park.spots

@app.get("/events/{event_id}", response_model=EventReponse)
async def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.eventId == event_id).first()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

#get all events in a park
@app.get("/parks/{parkId}/events", response_model=List[EventReponse])
async def get_park_events(parkId: int, db: Session = Depends(get_db)):
    park = db.query(Park).filter(Park.parkId == parkId).first()
    if park is None:
        raise HTTPException(status_code=404, detail="Park not found")
    return park.events

@app.get("/spots/{spotId}", response_model=SpotReponse)
async def get_spot(spotId: int, db: Session = Depends(get_db)):
    spot = db.query(Spot).filter(Spot.spotId == spotId).first()
    if spot is None:
        raise HTTPException(status_code=404, detail="Spot not found")
    return spot


