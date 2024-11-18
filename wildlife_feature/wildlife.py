from typing import List
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import WildlifeSighting
from schemas import WildlifeSightingCreate, WildlifeSightingResponse

router = APIRouter()

@router.post("/wildlife", response_model=WildlifeSightingResponse)
def report_sighting(sighting: WildlifeSightingCreate, db: Session = Depends(get_db)):
    db_sighting = WildlifeSighting(**sighting.dict())
    db.add(db_sighting)
    db.commit()
    db.refresh(db_sighting)
    return db_sighting

@router.get("/wildlife/recent", response_model=List[WildlifeSightingResponse])
def get_recent_sightings(db: Session = Depends(get_db), limit: int = 10):
    return db.query(WildlifeSighting).order_by(WildlifeSighting.sighting_time.desc()).limit(limit).all()
