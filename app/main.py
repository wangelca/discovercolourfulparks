from fastapi import FastAPI, HTTPException, Query, Depends, File, UploadFile, Form
from pydantic import BaseModel
from typing import Optional
from typing import List, Optional
from sqlalchemy.orm import Session
from database import database, SessionLocal
from models import Park, Spot, Event, User
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from datetime import datetime
import os
import shutil

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
        
class ParkUpdateRequest(BaseModel):
    name: str
    province: str
    description: str
    location: str
    parkImageUrl: Optional[List[str]] = None
    parameters: Optional[str] = None

    class Config:
        orm_mode = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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

#add a new event
@app.post("/events/add", response_model=EventReponse)
async def create_spot(
    parkId: str = Form(...),
    eventName: str = Form(...),
    description: str = Form(...),
    fee: float = Form(...),
    discount: float = Form(...),
    eventLocation: str = Form(...),
    startDate: datetime = Form(...),
    endDate: datetime = Form(...),
    requiredbooking: bool = Form(...),
    eventImageUrl: UploadFile = File(...),  # Accept one image as file input
    db: Session = Depends(get_db)
):
    
    #Fetch the highest eventId for this park
    highest_event_id = db.query(Event).filter(Event.parkId == parkId).order_by(Event.eventId.desc()).first()

    #Generate the new spotId
    if highest_event_id:
        new_event_id = highest_event_id.eventId + 1
    else:
        # If no spots exist for this park, start with the parkId followed by 01
        new_event_id = int(f"{parkId}001")

    # Fetch the province from the park table based on the parkId
    park = db.query(Park).filter(Park.parkId == parkId).first()
    if not park:
        raise HTTPException(status_code=404, detail="Park not found")
    
    province = park.province  # Assuming province is a column in the park table

    # Generate the parameters based on spotName and province
    formatted_event_name = eventName.replace(" ", "+").lower()  # Replace spaces with '+' and lowercase
    formatted_province = province.replace(" ", "+").lower()
    parameters = f"{formatted_event_name},{formatted_province}+canada"

    # Validate file format
    if eventImageUrl.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid image format. Only JPEG and PNG are allowed.")
    
    # Save the image to the public directory
    image_paths = []    
    image_path = os.path.join("public", eventImageUrl.filename).replace("\\", "/")
    
    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(eventImageUrl.file, buffer)
    
    # Store the relative path as ".\\<filename>" for database
    relative_image_path = f"..\\{eventImageUrl.filename}"  # Adjust the format here
    image_paths.append(relative_image_path)  # Add the single image path to the array

    
    # Create new event object
    new_event = Event(
        eventId=new_event_id,
        parkId=parkId,
        eventName=eventName,
        description=description,
        fee=fee,
        discount=discount,
        eventLocation=eventLocation,
        startDate=startDate,
        endDate=endDate,
        eventImageUrl=image_paths ,  # Save the image path in the database
        requiredbooking=requiredbooking,
        parameters=parameters
    )
    
    # Save the spot object in the database
    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return new_event


#get all events in a park 
#add a new event
@app.post("/events/add", response_model=EventReponse)
async def create_spot(
    parkId: str = Form(...),
    eventName: str = Form(...),
    description: str = Form(...),
    fee: float = Form(...),
    discount: float = Form(...),
    eventLocation: str = Form(...),
    startDate: datetime = Form(...),
    endDate: datetime = Form(...),
    requiredbooking: bool = Form(...),
    eventImageUrl: UploadFile = File(...),  # Accept one image as file input
    db: Session = Depends(get_db)
):
    
    #Fetch the highest eventId for this park
    highest_event_id = db.query(Event).filter(Event.parkId == parkId).order_by(Event.eventId.desc()).first()

    #Generate the new spotId
    if highest_event_id:
        new_event_id = highest_event_id.eventId + 1
    else:
        # If no spots exist for this park, start with the parkId followed by 01
        new_event_id = int(f"{parkId}001")

    # Fetch the province from the park table based on the parkId
    park = db.query(Park).filter(Park.parkId == parkId).first()
    if not park:
        raise HTTPException(status_code=404, detail="Park not found")
    
    province = park.province  # Assuming province is a column in the park table

    # Generate the parameters based on spotName and province
    formatted_event_name = eventName.replace(" ", "+").lower()  # Replace spaces with '+' and lowercase
    formatted_province = province.replace(" ", "+").lower()
    parameters = f"{formatted_event_name},{formatted_province}+canada"

    # Validate file format
    if eventImageUrl.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid image format. Only JPEG and PNG are allowed.")
    
    # Save the image to the public directory
    image_paths = []    
    image_path = os.path.join("public", eventImageUrl.filename).replace("\\", "/")
    
    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(eventImageUrl.file, buffer)
    
    # Store the relative path as ".\\<filename>" for database
    relative_image_path = f"..\\{eventImageUrl.filename}"  # Adjust the format here
    image_paths.append(relative_image_path)  # Add the single image path to the array

    
    # Create new event object
    new_event = Event(
        eventId=new_event_id,
        parkId=parkId,
        eventName=eventName,
        description=description,
        fee=fee,
        discount=discount,
        eventLocation=eventLocation,
        startDate=startDate,
        endDate=endDate,
        eventImageUrl=image_paths ,  # Save the image path in the database
        requiredbooking=requiredbooking,
        parameters=parameters
    )
    
    # Save the spot object in the database
    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return new_event


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

#add a new spot
@app.post("/spots/add", response_model=SpotReponse)
async def create_spot(
    parkId: str = Form(...),
    spotName: str = Form(...),
    spotDescription: str = Form(...),
    spotHourlyRate: float = Form(...),
    spotDiscount: float = Form(...),
    spotLocation: str = Form(...),
    requiredbooking: bool = Form(...),
    spotImageUrl: UploadFile = File(...),  # Accept one image as file input
    db: Session = Depends(get_db)
):
    
    #Fetch the highest spotId for this park
    highest_spot_id = db.query(Spot).filter(Spot.parkId == parkId).order_by(Spot.spotId.desc()).first()

    #Generate the new spotId
    if highest_spot_id:
        new_spot_id = highest_spot_id.spotId + 1
    else:
        # If no spots exist for this park, start with the parkId followed by 01
        new_spot_id = int(f"{parkId}01")

    # Fetch the province from the park table based on the parkId
    park = db.query(Park).filter(Park.parkId == parkId).first()
    if not park:
        raise HTTPException(status_code=404, detail="Park not found")
    
    province = park.province  # Assuming province is a column in the park table

    # Generate the parameters based on spotName and province
    formatted_spot_name = spotName.replace(" ", "+").lower()  # Replace spaces with '+' and lowercase
    formatted_province = province.replace(" ", "+").lower()
    parameters = f"{formatted_spot_name},{formatted_province}+canada"

    # Validate file format
    if spotImageUrl.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid image format. Only JPEG and PNG are allowed.")
    

    
    if spotImageUrl.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid image format. Only JPEG and PNG are allowed.")
    
    # Save the image to the public directory
    image_paths = []    
    image_path = os.path.join("public", spotImageUrl.filename).replace("\\", "/")
    
    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(spotImageUrl.file, buffer)
    
    # Store the relative path as ".\\<filename>" for database
    relative_image_path = f"..\\{spotImageUrl.filename}"  # Adjust the format here
    image_paths.append(relative_image_path)  # Add the single image path to the array

    
    # Create new spot object
    new_spot = Spot(
        spotId=new_spot_id,
        parkId=parkId,
        spotName=spotName,
        spotDescription=spotDescription,
        spotHourlyRate=spotHourlyRate,
        spotDiscount=spotDiscount,
        spotLocation=spotLocation,
        spotImageUrl=image_paths ,  # Save the image path in the database
        requiredbooking=requiredbooking,
        parameters=parameters
    )
    
    # Save the spot object in the database
    db.add(new_spot)
    db.commit()
    db.refresh(new_spot)

    return new_spot

