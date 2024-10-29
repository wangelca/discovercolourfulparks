from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from models import User
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