 
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

def ai_select_activities(
    spots: List[Spot],
    events: List[Event],
    used_spots: set,
    used_events: set,
    user_preferences: Optional[str] = None,
    remaining_budget: float = 0.0
) -> Tuple[List[Spot], Optional[Event]]:
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
    selected_event = []
    for event in available_events:
        cost = parse_cost(event.fee)
        if cost <= remaining_budget:
            selected_event = event
            remaining_budget -= cost
            break

    return selected_spots, selected_event

def generate_schedule(activities: List[Dict], day_date: datetime, start_time: str) -> List[Dict]:
    schedule = []
    current_time = datetime.combine(day_date, datetime.strptime(start_time, "%H:%M").time())

    events = [a for a in activities if a["type"] == "Event"]
    spots = [a for a in activities if a["type"] == "Spot"]

    events = sorted(events, key=lambda e: e["event_start_datetime"])

    for event in events:
        event_start = event["event_start_datetime"]
        event_end = event["event_end_datetime"]

        while current_time + timedelta(minutes=30) < event_start and spots:
            spot = spots.pop(0)
            duration = spot.get("duration", 120)
            end_time = current_time + timedelta(minutes=duration)
            if end_time > event_start:
                break
            schedule.append({
                **spot,
                "start_time": current_time.strftime("%H:%M"),
                "end_time": end_time.strftime("%H:%M"),
            })
            current_time = end_time + timedelta(minutes=15)

        if current_time < event_start:
            current_time = event_start

        schedule.append({
            "activity_name": event["name"],
            "location": event["location"],
            "type": event["type"],
            "park_name": event.get("park_name", ""),
            "duration": duration,
            "cost": event.get("cost", "Free"),
            "id": event.get("id"),
            "start_time": event_start.strftime("%H:%M"),
            "end_time": event_end.strftime("%H:%M")
        })
        current_time = event_end + timedelta(minutes=15)

    for spot in spots:
        duration = spot.get("duration", 120)
        end_time = current_time + timedelta(minutes=duration)
        schedule.append({
            "activity_name": spot["name"],
            "location": spot["location"],
            "type": spot["type"],
            "park_name": spot.get("park_name", ""),
            "duration": duration,
            "cost": spot.get("cost", "Free"),
            "id": spot.get("id"),
            "start_time": current_time.strftime("%H:%M"),
            "end_time": end_time.strftime("%H:%M"),
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
    start_date: str = Query(...),  # Required start date
    end_date: str = Query(...),    # Required end date
    db: Session = Depends(get_db)
):
    try:
        trip_start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
        trip_end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

    if trip_end_date < trip_start_date:
        raise HTTPException(status_code=400, detail="End date must be after start date.")

    days = (trip_end_date - trip_start_date).days + 1

    if province not in ["Alberta", "British Columbia"]:
        raise HTTPException(status_code=400, detail="Invalid province. Select Alberta or British Columbia.")

    parks = db.query(Park).filter(Park.province == province).all()
    if not parks:
        raise HTTPException(status_code=404, detail=f"No parks found in {province}.")

    park_ids = [park.parkId for park in parks]
    spots = db.query(Spot).filter(Spot.parkId.in_(park_ids)).all()
    events = db.query(Event).filter(
        Event.parkId.in_(park_ids),
        Event.startDate <= trip_end_date,
        Event.endDate >= trip_start_date
    ).all()

    itinerary = []
    used_spots, used_events = set(), set()
    remaining_budget = budget

    for day in range(days):
        day_date = trip_start_date + timedelta(days=day)

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
                "description": selected_event.description,
                "location": selected_event.eventLocation,
                "park_name": park.name if park else "",
                "duration": selected_event.duration or 60,
                "cost": "Free" if selected_event.fee == 0 else f"${selected_event.fee}",
                "event_start_datetime": selected_event.startDate,
                "event_end_datetime": selected_event.endDate,
            }
            (free_activities if entry["cost"] == "Free" else paid_activities).append(entry)

        day_cost = sum(parse_cost(activity["cost"]) for activity in paid_activities)
        remaining_budget -= day_cost

        activities = paid_activities + free_activities
        schedule = generate_schedule(activities, day_date, start_time)

        itinerary.append({
            "day": day + 1,
            "date": day_date.strftime("%Y-%m-%d"),
            "paid_activities": paid_activities,
            "free_activities": free_activities,
            "day_cost": day_cost,
            "schedule": schedule
        })

        if remaining_budget <= 0:
            break

    total_cost = budget - remaining_budget
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
                bookingDate=activity.get("event_start_datetime").date(),
                bookingStatus="confirmed",
                adults=adults,
                kids=kids,
                paymentAmount=parse_cost(activity["cost"]),
                spotId=None,  # Not a spot
                eventId=activity.get("id"),
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
