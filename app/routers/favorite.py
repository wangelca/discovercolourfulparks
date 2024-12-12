from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from models import User, Event, Spot, Review  # Database models
from database import get_db  # Database session dependency
from pydantic import BaseModel

# Define Pydantic models for request and response validation
class FavoriteUpdate(BaseModel):
    event_id: int = None
    spot_id: int = None

# Initialize the API router
router = APIRouter()

@router.put("/user/{user_id}/favorites")
def update_favorites(user_id: int, favorites: FavoriteUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if favorites.event_id:
        user.favEventId = list(set(user.favEventId or []) | {favorites.event_id})
    if favorites.spot_id:
        user.favSpotId = list(set(user.favSpotId or []) | {favorites.spot_id})
    
    db.commit()
    return {"message": "Favorites updated successfully"}

@router.delete("/user/{user_id}/favorites")
def remove_from_favorites(user_id: int, event_id: int = Query(None), spot_id: int = Query(None), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if event_id is not None and event_id in user.favEventId:
        user.favEventId.remove(event_id)

    if spot_id is not None and spot_id in user.favSpotId:
        user.favSpotId.remove(spot_id)

    db.commit()
    return {"message": "Event or spot removed from favorites"}

@router.get("/users/{user_id}/favorites")
def get_user_favorites(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    fav_event_ids = user.favEventId or []
    fav_spot_ids = user.favSpotId or []

    # Fetch events
    events = db.query(Event).filter(Event.eventId.in_(fav_event_ids)).all() if fav_event_ids else []
    # Fetch spots
    spots = db.query(Spot).filter(Spot.spotId.in_(fav_spot_ids)).all() if fav_spot_ids else []

    return {
        "favoriteEvents": [
            {
                "eventId": e.eventId,
                "eventName": e.eventName,
                "eventLocation": e.eventLocation,
                "fee": e.fee,
                "description": e.description,
                "startDate": e.startDate.isoformat() if e.startDate else None,
                "endDate": e.endDate.isoformat() if e.endDate else None
            } for e in events
        ],
        "favoriteSpots": [
            {
                "spotId": s.spotId,
                "spotName": s.spotName,
                "spotDescription": s.spotDescription,
                "spotAdmission": s.spotAdmission,
                "spotLocation": s.spotLocation,
            } for s in spots
        ]
    }

@router.get("/users/{user_id}/reviews")
def get_user_reviews(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_reviews = db.query(Review).filter(Review.id == user.id).all()

    # Prepare a response that includes info about the reviewed Event or Spot
    reviews_data = []
    for r in user_reviews:
        review_info = {
            "reviewId": r.reviewId,
            "rating": r.rating,
            "review": r.review,
            "created_at": r.created_at.isoformat()
        }

        if r.event_id:
            event = db.query(Event).filter(Event.eventId == r.event_id).first()
            review_info["event"] = {
                "eventId": event.eventId,
                "eventName": event.eventName,
                "eventLocation": event.eventLocation
            }
        if r.spot_id:
            spot = db.query(Spot).filter(Spot.spotId == r.spot_id).first()
            review_info["spot"] = {
                "spotId": spot.spotId,
                "spotName": spot.spotName,
                "spotLocation": spot.spotLocation
            }

        reviews_data.append(review_info)

    return {
        "reviews": reviews_data
    }