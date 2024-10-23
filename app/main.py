from lib2to3.pytree import Base
from fastapi import FastAPI, HTTPException, Query, Depends, File, UploadFile, Form, APIRouter
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import database, SessionLocal, Base, engine
from models import Park, Spot, Event, User, Booking
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
from datetime import date, datetime, time, timezone
from app.routers import users
import os
import shutil
import openai

app = FastAPI()

app.include_router(users.router)

openai.api_key = os.getenv("OPENAI_API_KEY")

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000" , "https://dcp-tawny.vercel.app"],  # React app runs here
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

@app.get("/")
def read_root():
    return {"message": "Welcome to Colorful National Parks!"}

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

class ParkResponse(BaseModel):
    parkId: int
    name: str
    province: str
    description: str
    location: str
    parkImageUrl: List[str]
    parameters: str

    class Config:
        orm_mode=True

class EventResponse(BaseModel):
    eventId: int
    parkId: int
    eventName: str
    eventLocation: str
    fee: float
    description: str
    discount: Optional[float] = None
    startDate: datetime
    endDate: datetime
    eventImageUrl: List[str]
    parameters: Optional[str] = None
    requiredbooking: bool    

    class Config:
        orm_mode=True
        arbitrary_types_allowed = True

class SpotResponse(BaseModel):
    spotId: int
    parkId: int
    spotName: str
    spotDescription: str
    spotAdmission: float
    spotDiscount: float
    spotLocation: str
    category: Optional[str] = None
    spotImageUrl: Optional [List[str]] = None
    parameters: Optional[str] = None
    requiredbooking: bool
    openingHour: time
    closingHour: time
    spotLimit: int

    class Config:
        orm_mode=True

class UserResponse(BaseModel):
    id: int
    clerk_user_id: str
    username: Optional[str]
    email: str
    created_at: datetime
    updatedAt: Optional[datetime]
    firstName: Optional[str]
    lastName: Optional[str]
    phoneNumber: Optional[str]
    publicMetadata: Optional[str]    

    class Config:
        orm_mode=True        
        arbitrary_types_allowed = True
        
class BookingResponse(BaseModel):
    bookingId: Optional[int] = None
    id: int
    spotId: Optional[int] = None
    eventId: Optional[int] = None
    bookingDate: date
    bookingStatus: Optional[str] = None
    adults: int
    kids: int
    paymentAmount: float

    class Config:
        orm_mode=True
        arbitrary_types_allowed = True


@app.post("/event-bookings", response_model=BookingResponse)
async def book_event(booking: BookingResponse, db: Session = Depends(get_db)):
    
    if isinstance(booking.bookingDate, str):
        bookingDate = datetime.strptime(booking.bookingDate, '%Y-%m-%d').date()  # Parse into a date object
    else:
        bookingDate = booking.bookingDate

    # Create a new booking
    new_booking = Booking(
        eventId=booking.eventId,
        id=booking.id,  # User ID
        bookingDate=booking.bookingDate,
        bookingStatus="confirmed",
        adults=booking.adults,
        kids=booking.kids,
        paymentAmount=booking.paymentAmount,
        spotId=None  # No event ID for spot booking
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    # Return the new booking using BookingResponse
    return new_booking    

#get all bookings
@app.get("/bookings", response_model=List[BookingResponse])
async def get_bookings(db: Session = Depends(get_db)):
    bookings = db.query(Booking).all()
    return bookings

@app.get("/bookings/{booking_id}", response_model=BookingResponse)
async def get_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.bookingId == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    event = db.query(Event).filter(Event.eventId == booking.eventId).first()

    return BookingResponse(
        bookingId=booking.bookingId,
        id=booking.id,
        eventId=booking.eventId,
        bookingDate=booking.bookingDate,
        bookingStatus=booking.bookingStatus,
        requiresPayment=booking.paymentAmount > 0,
        paymentAmount=booking.paymentAmount if booking.paymentAmount else 0.0
    )

@app.get("/payment/{booking_id}")
async def payment_page(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.bookingId == booking_id).first()

    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Here you can handle logic to redirect or present the payment page
    return {
        "message": f"Payment page for booking ID {booking_id}",
        "amount_due": booking.paymentAmount
    }

# get all parks
@app.get("/parks", response_model=List[ParkResponse])
async def get_parks(db: Session = Depends(get_db)):
    parks = db.query(Park).all()
    return parks

# get all events
@app.get("/events", response_model=List[EventResponse])
async def get_events(db: Session = Depends(get_db)):
    events = db.query(Event).all()
    return events

# get spots based on parkId and admission rate range
@app.get("/spots", response_model=List[SpotResponse])
async def get_spots(
    db: Session = Depends(get_db),
    min_hourly_rate: Optional[float] = Query(0),
    max_hourly_rate: Optional[float] = Query(1000),
    park_id: Optional[List[int]] = Query(None)
):
    # Start with all spots
    query = db.query(Spot)

    # Filter by hourly rate range
    query = query.filter(Spot.spotAdmission.between(min_hourly_rate, max_hourly_rate))

    # Filter by multiple park IDs
    if park_id:
        query = query.filter(Spot.parkId.in_(park_id))

    spots = query.all()
    return spots

# get all users
@app.get("/users", response_model=List[UserResponse])
async def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

# get users by userId
@app.get("/users/{clerk_user_id}", response_model=UserResponse)
async def get_user(clerk_user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.clerk_user_id == clerk_user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

#update the user by userId (individual profile page)
@app.put("/users/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, user: UserResponse, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.clerk_user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    user.firstName = user.firstName
    user.lastName = user.lastName
    user.phoneNumber = user.phoneNumber
    db.commit()
    return user

#get a user's bookings
@app.get("/users/{user_id}/bookings", response_model=List[BookingResponse])
async def get_user_bookings(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user.booking

#update the park by parkId
@app.put("/parks/{parkId}", response_model=ParkResponse)
async def update_park(parkId: int, park: ParkResponse, db: Session = Depends(get_db)):
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
@app.post("/parks/add", response_model=ParkResponse)
async def create_park(park: ParkResponse, db: Session = Depends(get_db)):
    new_park = Park(parkId=park.parkId, name=park.name, province=park.province, description=park.description, location=park.location, parkImageUrl=park.parkImageUrl, parameters=park.parameters)
    db.add(new_park)
    db.commit()
    db.refresh(new_park)
    return new_park

# get a park by parkId
@app.get("/parks/{parkId}", response_model=ParkResponse)
async def get_park(parkId: int, db: Session = Depends(get_db)):
    park = db.query(Park).filter(Park.parkId == parkId).first()
    if park is None:
        raise HTTPException(status_code=404, detail="Park not found")
    return park

#filter the park by province
@app.get("/parks/province/{selectedProvince}", response_model=List[ParkResponse])
async def get_park_by_province(selectedProvince: str, db: Session = Depends(get_db)):
    park = db.query(Park).filter(Park.province == selectedProvince).all()
    if park is None:
        raise HTTPException(status_code=404, detail="Park not found")
    return park

#get all spots in a park
@app.get("/parks/{parkId}/spots", response_model=List[SpotResponse])
async def get_park_spots(parkId: int, db: Session = Depends(get_db)):
    park = db.query(Park).filter(Park.parkId == parkId).first()
    if park is None:
        raise HTTPException(status_code=404, detail="Park not found")
    return park.spots

#get event details by eventId
@app.get("/events/{event_id}", response_model=EventResponse)
async def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.eventId == event_id).first()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

#add a new event
@app.post("/events/add", response_model=EventResponse)
async def create_event(
    parkId: str = Form(...),
    eventName: str = Form(...),
    description: str = Form(...),
    fee: float = Form(...),
    discount: float = Form(...),
    eventLocation: str = Form(...),
    startDate: datetime = Form(...),  # Only handle one event at a time
    endDate: datetime = Form(...),    # Only handle one event at a time
    requiredbooking: bool = Form(...),
    eventImageUrl: UploadFile = File(...),  # Accept one image as file input
    db: Session = Depends(get_db)
):
    # Fetch the highest eventId for this park
    highest_event_id = db.query(Event).filter(Event.parkId == parkId).order_by(Event.eventId.desc()).first()

    # Generate the new eventId
    if highest_event_id:
        new_event_id = highest_event_id.eventId + 1
    else:
        # If no events exist for this park, start with the parkId followed by 001
        new_event_id = int(f"{parkId}001")

    # Fetch the province from the park table based on the parkId
    park = db.query(Park).filter(Park.parkId == parkId).first()
    if not park:
        raise HTTPException(status_code=404, detail="Park not found")

    province = park.province  # Assuming province is a column in the park table

    # Generate the parameters based on eventName and province
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
    
    relative_image_path = f"..\\{eventImageUrl.filename}"
    image_paths.append(relative_image_path)

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
        eventImageUrl=image_paths,
        requiredbooking=requiredbooking,
        parameters=parameters
    )
    
    # Save the event object in the database
    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return new_event

#update an event by eventId
@app.put("/events/{eventId}", response_model=EventResponse)
async def update_event(eventId: int, event: EventResponse, db: Session = Depends(get_db)):
    db_event = db.query(Event).filter(Event.eventId == eventId).first()
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Update the event fields with the data coming from the request
    db_event.eventName = event.eventName
    db_event.description = event.description
    db_event.fee = event.fee
    db_event.discount = event.discount
    db_event.eventLocation = event.eventLocation
    db_event.startDate = event.startDate
    db_event.endDate = event.endDate
    db_event.eventImageUrl = event.eventImageUrl
    db_event.parameters = event.parameters
    db_event.requiredbooking = event.requiredbooking
    
    db.commit()  # Commit the changes to the database
    db.refresh(db_event)  # Refresh the instance with the new data
    return event

#get all events in a park 
@app.get("/parks/{parkId}/events", response_model=List[EventResponse])
async def get_park_events(parkId: int, db: Session = Depends(get_db)):
    park = db.query(Park).filter(Park.parkId == parkId).first()
    if park is None:
        raise HTTPException(status_code=404, detail="Park not found")
    return park.events

# get spot details by spotId
@app.get("/spots/{spotId}", response_model=SpotResponse)
async def get_spot(spotId: int, db: Session = Depends(get_db)):
    spot = db.query(Spot).filter(Spot.spotId == spotId).first()
    if spot is None:
        raise HTTPException(status_code=404, detail="Spot not found")
    return spot

#add a new spot
@app.post("/spots/add", response_model=SpotResponse)
async def create_spot(
    parkId: str = Form(...),
    spotName: str = Form(...),
    spotDescription: str = Form(...),
    spotAdmission: float = Form(...),
    spotDiscount: float = Form(...),
    spotLocation: str = Form(...),
    category: str = Form(...),
    openingHour: str = Form (...),
    closingHour: str= Form(...),
    requiredbooking: bool = Form(...),
    spotLimit: int = Form(...),
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
        new_spot_id = int(f"{parkId}001")

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
        spotAdmission=spotAdmission,
        spotDiscount=spotDiscount,
        spotLocation=spotLocation,
        category=category,
        spotImageUrl=image_paths ,  # Save the image path in the database
        openingHour=openingHour,
        closingHour=closingHour,
        requiredbooking=requiredbooking,
        spotLimit=spotLimit,
        parameters=parameters
    )
    
    # Save the spot object in the database
    db.add(new_spot)
    db.commit()
    db.refresh(new_spot)

    return new_spot

# add a new spot booking
@app.post("/spot-bookings", response_model=BookingResponse)
async def create_booking(booking: BookingResponse, db: Session = Depends(get_db)):

    if isinstance(booking.bookingDate, str):
        bookingDate = datetime.strptime(booking.bookingDate, '%Y-%m-%d').date()  # Parse into a date object
    else:
        bookingDate = booking.bookingDate

    # Create a new booking
    new_booking = Booking(
        spotId=booking.spotId,
        id=booking.id,  # User ID
        bookingDate=booking.bookingDate,
        bookingStatus="confirmed",
        adults=booking.adults,
        kids=booking.kids,
        paymentAmount=booking.paymentAmount,
        eventId=None  # No event ID for spot booking
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    # Return the new booking using BookingResponse
    return new_booking

# Generate revenue report for bookings
@app.get("/spot-revenue")
async def get_spot_revenue(
    start_date: date = Query(...), 
    end_date: date = Query(...), 
    db: Session = Depends(get_db)
):
    revenue_data = (
        db.query(
            Booking.spotId,
            Spot.spotName.label("spot_name"),
            Booking.eventId,
            Event.eventName.label("event_name"),
            func.sum(Booking.paymentAmount).label("total_revenue")
        )
        .join(Spot, Spot.spotId == Booking.spotId, isouter=True)
        .join(Event, Event.eventId == Booking.eventId, isouter=True)
        .filter(Booking.bookingDate.between(start_date, end_date))
        .group_by(Booking.spotId, Spot.spotName, Booking.eventId, Event.eventName)  # Group by spotName and eventName
        .all()
    )
    
    return JSONResponse(content=[{
        "spot_id": r.spotId,
        "spot_name": r.spot_name,
        "event_id": r.eventId,
        "event_name": r.event_name,
        "total_revenue": r.total_revenue
    } for r in revenue_data])

# generat description using AI
@app.post("/generate-description")
async def generate_description(parkName: str = Form(...), name: str = Form(...), entityType: str = Form(...)):
    """
    Generate AI-based description for spots or events based on the park and entity name.
    entityType can be 'spot' or 'event'.
    """
    print(f"Received request to generate description for {entityType} named {name} at park {parkName}")
 
    try:
        # Use the correct chat completion API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that generates descriptions for spots and events in parks."},
                {
                    "role": "user",
                    "content": (
                        f"Generate a detailed and engaging description for a {entityType} "
                        f"named {name} located in {parkName}. Highlight the key features, "
                        f"attractions, and reasons to visit or participate. Keep it below 80 words." 
                    ),
                }
            ],
            max_tokens=200  # Control the length of the response
        )

        description = response['choices'][0]['message']['content'].strip()
        return {"description": description}

    except Exception as e:
        print(f"Error generating description: {e}")
        raise HTTPException(status_code=500, detail="Error generating description")
