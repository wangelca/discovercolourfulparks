from fastapi import FastAPI, HTTPException, Query, Depends, File, UploadFile, Form, APIRouter
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Tuple, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import database, SessionLocal, Base, engine, get_db
from models import Park, Spot, Event, User, Booking, Review
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
from datetime import date, datetime, time, timezone, timedelta
from app.routers import users, notifications, reviews, favorite, report
import os
import shutil
import openai
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

openai.api_key = os.getenv("OPENAI_API_KEY")

UPLOAD_DIR = "public/avatars"

logger = logging.getLogger("uvicorn.error")

app.include_router(users.router)
app.include_router(notifications.router)
app.include_router(reviews.router)
app.include_router(report.router, prefix="/reports")
app.include_router(favorite.router)

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
    
class ReportBase(BaseModel):
    parkId: int
    userId: int
    reportType: str
    details: str

class ReportCreate(ReportBase):
    pass

class ReportResponse(BaseModel):
    reportID: int
    parkId: int
    userId: int
    reportType: str
    details: str
    created_at: datetime

    class Config:
        orm_mode = True

class ParkResponse(BaseModel):
    parkId: int
    name: str
    province: str
    description: str
    location: str
    parkImageUrl: List[str]
    parameters: Optional[str] = None
        
class ParkUpdateRequest(BaseModel):
    name: str
    province: str
    description: str
    location: str
    parkImageUrl: Optional[List[str]] = None
    parameters: Optional[str] = None      


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
    eventImageUrl: List[str] = []  # Default to an empty list if None
    parameters: Optional[str] = None
    requiredbooking: bool    

    class Config:
        orm_mode = True
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
    mktPref: Optional[bool]
    favSpotId: Optional[List[int]]
    favEventId: Optional[List[int]]

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
    # New fields for itinerary bookings
    itinerary_data: Optional[List[Dict]] = None  # List of day-by-day itinerary activities
    destination: Optional[str] = None  # Province or area for the itinerary
    total_cost: Optional[float] = None  # Total cost for the itinerary booking

    class Config:
        orm_mode=True
        arbitrary_types_allowed = True



class ReviewBase(BaseModel):
    user_id: int
    spot_id: int
    event_id: int
    rating: int = Field(..., ge=1, le=5)
    review: Optional[str] = None

class ReviewCreate(ReviewBase):
    pass

class ReviewResponse(ReviewBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class ScheduleItem(BaseModel):
    time: str
    activity: str
    cost: str

class ActivityDay(BaseModel):
    day: int
    schedule: List[ScheduleItem]

class Itinerary(BaseModel):
    days: int
    location: str
    activities: List[ActivityDay]

class SendItineraryRequest(BaseModel):
    email: EmailStr
    itinerary: Itinerary

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

#get all events
@app.get("/events", response_model=List[EventResponse])

async def get_events(
    page: int = Query(1, ge=1, description="Page number, starting from 1"),
    limit: int = Query(10, ge=1, le=100, description="Number of events per page, maximum 100"),
    db: Session = Depends(get_db)
):
    # Calculate the offset based on page number and limit
    offset = (page - 1) * limit

    # Fetch events with pagination
    events = db.query(Event).offset(offset).limit(limit).all()

    # Return only the list of events

    return events

# Get total count of events
@app.get("/events/count", response_model=int)
async def get_events_count(db: Session = Depends(get_db)):
    total_events = db.query(Event).count()
    return total_events

# get spots based on parkId and admission rate range
@app.get("/spots", response_model=List[SpotResponse])
async def get_spots(
    db: Session = Depends(get_db),
    min_hourly_rate: Optional[float] = Query(0),
    max_hourly_rate: Optional[float] = Query(1000),
    park_id: Optional[List[int]] = Query(None),
    category: Optional[str] = Query(None),
    page: int = Query(1, ge=1),  # Page number, must be >= 1
    limit: int = Query(9, ge=1)  # Limit number of spots per page, must be >= 1
):
    # Start with all spots
    query = db.query(Spot)

    # Filter by hourly rate range
    query = query.filter(Spot.spotAdmission.between(min_hourly_rate, max_hourly_rate))

    # Filter by multiple park IDs
    if park_id:
        query = query.filter(Spot.parkId.in_(park_id))

    # Filter by category
    if category:
        query = query.filter(Spot.category == category)

    # Apply pagination
    offset = (page - 1) * limit
    spots = query.offset(offset).limit(limit).all()

    return spots

@app.get("/spots/count", response_model=int)
async def get_spots_count(db: Session = Depends(get_db),
    min_hourly_rate: Optional[float] = Query(0),
    max_hourly_rate: Optional[float] = Query(1000),
    park_id: Optional[List[int]] = Query(None),
    category: Optional[str] = Query(None)
):
    # Start with all spots
    query = db.query(Spot)

    # Filter by hourly rate range
    query = query.filter(Spot.spotAdmission.between(min_hourly_rate, max_hourly_rate))

    # Filter by multiple park IDs
    if park_id:
        query = query.filter(Spot.parkId.in_(park_id))

    # Filter by category
    if category:
        query = query.filter(Spot.category == category)

    total_spots = query.count()

    return total_spots

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

@app.put("/users/{user_id}/avatar")
async def update_avatar(user_id: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.clerk_user_id == user_id).first()
    
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    avatar_filename = f"{user_id}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, avatar_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    user.avatar = f"/{UPLOAD_DIR}/{avatar_filename}"
    db.commit()

    return {"message": "Avatar updated successfully", "avatar": user.avatar}

#update the user by userId (individual profile page)
@app.put("/users/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, updated_user: UserResponse, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.clerk_user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    user.firstName = updated_user.firstName
    user.lastName = updated_user.lastName
    user.phoneNumber = updated_user.phoneNumber
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
async def update_park(
    parkId: int,
    park: ParkUpdateRequest,
    db: Session = Depends(get_db)
):
    print(f"Updating park with ID: {parkId}")
    print(f"Received data: {park}")

    db_park = db.query(Park).filter(Park.parkId == parkId).first()
    if db_park is None:
        raise HTTPException(status_code=404, detail="Park not found")

    print(f"Current values before update: {db_park}")

    db_park.name = park.name
    db_park.province = park.province
    db_park.description = park.description
    db_park.location = park.location
    db_park.parameters = park.parameters if park.parameters else db_park.parameters

    try:
        db.commit()
        db.refresh(db_park) 
        print(f"Updated values after commit: {db_park}")
    except Exception as e:
        db.rollback()
        print(f"Error during commit: {e}")
        raise HTTPException(status_code=500, detail="Database commit failed: " + str(e))

    return ParkResponse(
        parkId=db_park.parkId,
        name=db_park.name,
        province=db_park.province,
        description=db_park.description,
        location=db_park.location,
        parkImageUrl=db_park.parkImageUrl,
        parameters=db_park.parameters
    )


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
@app.get("/events/{eventID}", response_model=EventResponse)
async def get_events(db: Session = Depends(get_db), eventID: int = None):
    if eventID:
        event = db.query(Event).filter(Event.eventId == eventID).first()
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

# generate description using AI
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
    
def parse_cost(cost):
    if cost in ["Free", "None", None]:
        return 0
    try:
        return float(str(cost).replace("$", ""))
    except (ValueError, TypeError):
        return 0

def ai_select_activities(parks: List, spots: List, events: List, used_parks, used_spots, used_events, user_preferences=None, remaining_budget=0) -> Tuple[List, List, object]:
    """
    Selects activities for the itinerary, ensuring unique parks, spots, and an event each day,
    while respecting the remaining budget.
    """
    if user_preferences:
        user_preferences = user_preferences.split(",")  # Convert string back to a list

    # Filter out already-used parks and spots
    available_parks = [park for park in parks if park.parkId not in used_parks]
    available_spots = [spot for spot in spots if spot.spotId not in used_spots]
    available_events = [event for event in events if event.eventId not in used_events]

    # Select up to 2 unique parks without exceeding the budget
    selected_parks = []
    for park in available_parks:
        cost = parse_cost(park.duration)  # Adjust cost parsing based on park structure
        if cost <= remaining_budget:
            selected_parks.append(park)
            remaining_budget -= cost
        if len(selected_parks) >= 2:
            break

    # Select up to 3 unique spots from the chosen parks within budget
    selected_spots = []
    for park in selected_parks:
        park_spots = [spot for spot in available_spots if spot.parkId == park.parkId]
        for spot in park_spots:
            cost = parse_cost(spot.spotAdmission)
            if cost <= remaining_budget:
                selected_spots.append(spot)
                remaining_budget -= cost
            if len(selected_spots) >= 3:
                break

    # Select one unique event if available within budget
    selected_event = None
    for event in available_events:
        cost = parse_cost(event.fee)
        if cost <= remaining_budget:
            selected_event = event
            remaining_budget -= cost
            break

    return selected_parks, selected_spots, selected_event


def generate_schedule(activities, start_time):
    schedule = []
    current_time = datetime.strptime(start_time, "%H:%M")

    for activity in activities:
        duration = activity.get("duration", 60)
        end_time = current_time + timedelta(minutes=duration)
        
        schedule.append({
            "activity_name": activity["name"],
            "start_time": current_time.strftime("%I:%M %p"),
            "end_time": end_time.strftime("%I:%M %p"),
            "location": activity["location"],
            "type": activity["type"],
            "duration": duration,
            "cost": activity.get("cost", "Free")
        })

        current_time = end_time + timedelta(minutes=15)

    return schedule


@app.get("/itinerary")
async def generate_itinerary(
    days: int = Query(1, ge=1, le=3),
    preference: str = Query(None),
    budget: int = Query(100),
    traveling_with: str = Query("solo"),
    start_time: str = Query("08:00"),
    experience_type: str = Query("relaxation"),
    meal_preferences: str = Query("none"),
    province: str = Query("Alberta"),
    db: Session = Depends(get_db)
):
    # Validate the province
    if province not in ["Alberta", "British Columbia"]:
        return {"error": "Invalid province. Please select either 'Alberta' or 'British Columbia'."}

    parks = db.query(Park).filter(Park.province == province).all()
    if not parks:
        return {"error": f"No parks found in {province}."}

    park_ids = [park.parkId for park in parks]
    spots = db.query(Spot).filter(Spot.parkId.in_(park_ids)).all()
    events = db.query(Event).filter(Event.parkId.in_(park_ids)).all()

    itinerary = []
    used_parks, used_spots, used_events = set(), set(), set()
    remaining_budget = budget  # Start with the full budget

    for day in range(days):
        selected_parks, selected_spots, selected_event = ai_select_activities(
            parks, spots, events, used_parks, used_spots, used_events, preference, remaining_budget
        )

        used_parks.update([park.parkId for park in selected_parks])
        used_spots.update([spot.spotId for spot in selected_spots])
        if selected_event:
            used_events.add(selected_event.eventId)

        paid_activities = []
        free_activities = []

        for park in selected_parks:
            entry = {
                "type": "Park",
                "name": park.name,
                "location": park.location,
                "duration": park.duration or 60,
                "cost": "Free" if park.duration == 0 else f"${park.duration}",
            }
            (free_activities if entry["cost"] == "Free" else paid_activities).append(entry)

        for spot in selected_spots:
            entry = {
                "type": "Spot",
                "name": spot.spotName,
                "description": spot.spotDescription,
                "location": spot.spotLocation,
                "duration": spot.duration or 60,
                "cost": "Free" if spot.spotAdmission == 0 else f"${spot.spotAdmission}",
            }
            (free_activities if entry["cost"] == "Free" else paid_activities).append(entry)

        if selected_event:
            entry = {
                "type": "Event",
                "name": selected_event.eventName,
                "location": selected_event.eventLocation,
                "duration": selected_event.duration or 60,
                "cost": "Free" if selected_event.fee == 0 else f"${selected_event.fee}",
            }
            (free_activities if entry["cost"] == "Free" else paid_activities).append(entry)

        # Calculate day cost and update remaining budget
        day_cost = sum(parse_cost(activity["cost"]) for activity in paid_activities)
        remaining_budget -= day_cost  # Deduct day's cost from the remaining budget

        # Print debug information
        print(f"Day {day + 1} cost: {day_cost}, Remaining budget: {remaining_budget}")

        activities = paid_activities + free_activities
        schedule = generate_schedule(activities, start_time)

        itinerary.append({
            "day": day + 1,
            "paid_activities": paid_activities,
            "free_activities": free_activities,
            "day_cost": day_cost,
            "schedule": schedule
        })

        if remaining_budget <= 0:
            break  # Stop adding days if the budget is exceeded


    total_cost = budget - remaining_budget  # Calculate actual spent budget
    print(f"Total cost: {total_cost}")

    return {
        "itinerary": itinerary,
        "total_cost": total_cost,
        "destination": province
    }

def send_email(recipient_email, subject, body):
    sender_email = "your_email@example.com"  # Replace with your email
    sender_password = "your_password"  # Replace with your email password

    msg = MIMEMultipart()
    msg["From"] = sender_email
    msg["To"] = recipient_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, recipient_email, msg.as_string())


@app.post("/itinerary-bookings", response_model=List[BookingResponse])
async def book_itinerary(
    itinerary: Dict[str, Any],  # Expecting a dictionary with specific structure
    id: str = Query(...),  # User ID
    booking_date: str = Query(...),
    adults: int = Query(1),
    kids: int = Query(0),
    db: Session = Depends(get_db)
):
    try:
        # Validate booking date
        booking_date = datetime.strptime(booking_date, '%Y-%m-%d').date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid booking date format. Use YYYY-MM-DD.")

    # Extract paid activities
    paid_activities = [activity for day in itinerary["itinerary"] for activity in day["paid_activities"]]
    if not paid_activities:
        raise HTTPException(status_code=400, detail="No paid activities in the itinerary to book.")

    # Initialize list to store booking responses
    booking_responses = []

    for activity in paid_activities:
        if activity["type"] == "Spot":
            new_booking = Booking(
                id=id,  # User ID
                bookingDate=booking_date,
                bookingStatus="confirmed",
                adults=adults,
                kids=kids,
                paymentAmount=parse_cost(activity["cost"]),
                spotId=activity.get("spot_id"),
                eventId=None,  # Not an event
                destination=itinerary.get("destination", "Unknown"),
                total_cost=parse_cost(activity["cost"])
            )
        elif activity["type"] == "Event":
            new_booking = Booking(
                id=id,  # User ID
                bookingDate=booking_date,
                bookingStatus="confirmed",
                adults=adults,
                kids=kids,
                paymentAmount=parse_cost(activity["cost"]),
                spotId=None,  # Not a spot
                eventId=activity.get("event_id"),
                destination=itinerary.get("destination", "Unknown"),
                total_cost=parse_cost(activity["cost"])
            )
        else:
            continue  # Ignore activities that are neither Spot nor Event

        # Add booking to the database
        db.add(new_booking)
        db.commit()
        db.refresh(new_booking)

        # Add to response list
        booking_responses.append(BookingResponse(
            bookingId=new_booking.bookingId,
            id=new_booking.id,
            bookingDate=new_booking.bookingDate,
            bookingStatus=new_booking.bookingStatus,
            paymentAmount=new_booking.paymentAmount,
            spotId=new_booking.spotId,
            eventId=new_booking.eventId
        ))

    # Return list of created bookings
    return booking_responses
