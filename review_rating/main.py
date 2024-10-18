# references : ChatGPT: create the afstAPI routes to submit reviews and retrieve them
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from .models import Park, Spot, Review
from .database import get_db
from .schemas import ReviewCreate, Review

app = FastAPI()

@app.post("/reviews/", response_model=Review)
def create_review(review: ReviewCreate, db: Session = Depends(get_db)):
    db_review = Review(rating=review.rating, comment=review.comment, event_id=review.event_id, spot_id=review.spot_id)
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@app.get("/reviews/event/{event_id}")
def get_events_reviews(event_id: int, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.event_id == event_id).all()
    return reviews
    
@app.get("/reviews/spot/{spot_id}")
def get_spot_reviews(spot_id: int, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.spot.id == spot_id).all()
    return reviews

