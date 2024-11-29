 
from fastapi import  HTTPException, Query, Depends, File, Form, APIRouter
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Tuple, Dict, Any
from sqlalchemy.orm import Session
from database import database, SessionLocal, Base, engine, get_db
from models import Park, Spot, Event, User, Booking, Review
from datetime import date, datetime, time, timezone, timedelta

router = APIRouter()

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

def parse_cost(cost):
    if cost in ["Free", "None", None]:
        return 0
    try:
        return float(str(cost).replace("$", ""))
    except (ValueError, TypeError):
        return 0

def ai_select_activities(spots: List, events: List, used_spots, used_events, user_preferences=None, remaining_budget=0) -> Tuple[List, List, object]:
    """
    Selects activities for the itinerary, ensuring unique parks, spots, and an event each day,
    while respecting the remaining budget.
    """
    if user_preferences:
        user_preferences = user_preferences.split(",")  # Convert string back to a list

    # Filter out already-used parks and spots
    available_spots = [spot for spot in spots if spot.spotId not in used_spots]
    available_events = [event for event in events if event.eventId not in used_events]

    # Select up to 3 unique spots from the chosen parks within budget
    selected_spots = []
    for spot in available_spots:
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

    return selected_spots, selected_event

def generate_schedule(activities, start_time):
    schedule = []
    current_time = datetime.strptime(start_time, "%H:%M")

    for activity in activities:
        duration = activity.get("duration", 60)
        end_time = current_time + timedelta(minutes=duration)
        
        schedule.append({
            "activity_name": activity["name"],
            "start_time": current_time.strftime("%H:%M"),
            "end_time": end_time.strftime("%H:%M"),
            "location": activity["location"],
            "type": activity["type"],
            "park_name": activity.get("park_name", ""),
            "duration": duration,
            "cost": activity.get("cost", "Free"),
            "id": activity.get("id")
        })

        current_time = end_time + timedelta(minutes=15)

    return schedule


@router.get("/itinerary")
async def generate_itinerary(
    days: int = Query(1, ge=1, le=3),
    preference: str = Query(None),
    budget: int = Query(100),
    adults: int = Query(1),
    kids: int = Query(0),
    start_time: str = Query("08:00"),
    experience_type: str = Query("relaxation"),
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
    used_spots, used_events = set(), set()
    remaining_budget = budget  # Start with the full budget

    for day in range(days):
        selected_spots, selected_event = ai_select_activities(
            spots, events, used_spots, used_events, preference, remaining_budget
        )

        used_spots.update([spot.spotId for spot in selected_spots])
        if selected_event:
            used_events.add(selected_event.eventId)

        paid_activities = []
        free_activities = []


        for spot in selected_spots:
            park = db.query(Park).filter(Park.parkId == spot.parkId).first()
            entry = {
                "type": "Spot",
                "id": spot.spotId,
                "name": spot.spotName,
                "description": spot.spotDescription,
                "location": spot.spotLocation,
                "park_name": park.name if park else "",
                "duration": spot.duration or 60,
                "cost": "Free" if spot.spotAdmission == 0 else f"${spot.spotAdmission}",
            }
            (free_activities if entry["cost"] == "Free" else paid_activities).append(entry)

        if selected_event:
            park = db.query(Park).filter(Park.parkId == selected_event.parkId).first()
            entry = {
                "type": "Event",
                "id": selected_event.eventId,
                "name": selected_event.eventName,
                "location": selected_event.eventLocation,
                "park_name": park.name if park else "",
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

@router.post("/itinerary-bookings", response_model=List[BookingResponse])
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
