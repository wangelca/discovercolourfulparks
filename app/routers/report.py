# app/routers/report.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Report, Park, User
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

# Request model for creating a report
class ReportCreate(BaseModel):
    parkId: int
    userId: int
    reportType: str
    details: str

# Response model for a report
class ReportResponse(BaseModel):
    reportID: int
    parkId: int
    userId: int
    reportType: str
    details: str
    created_at: datetime

    class Config:
        orm_mode = True

# Endpoint to create a new report
@router.post("/", response_model=ReportResponse)
async def create_report(report: ReportCreate, db: Session = Depends(get_db)):
    # Fetch park and user to ensure existence
    park = db.query(Park).filter(Park.parkId == report.parkId).first()
    if not park:
        raise HTTPException(status_code=404, detail="Park not found")

    user = db.query(User).filter(User.id == report.userId).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Validate reportType
    if report.reportType not in ['Weather Alert', 'Driving Conditions', 'Terrain Conditions', 'Fire Sightings']:
        raise HTTPException(status_code=400, detail="Invalid report type")

    # Create new report
    new_report = Report(
        parkId=report.parkId,
        userId=report.userId,
        reportType=report.reportType,
        details=report.details
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report

# Endpoint to get reports for a specific park
@router.get("/park/{parkId}", response_model=List[ReportResponse])
async def get_reports_by_park(parkId: int, db: Session = Depends(get_db)):
    # Check if the park exists
    park = db.query(Park).filter(Park.parkId == parkId).first()
    if not park:
        raise HTTPException(status_code=404, detail="Park not found")

    # Retrieve reports for the specified park
    reports = (
        db.query(Report)
        .filter(Report.parkId == parkId)
        .order_by(Report.created_at.desc())
        .limit(10)  # Limit to 10 most recent reports
        .all()
    )
    return reports

# Optional: Endpoint to get all reports
@router.get("/", response_model=List[ReportResponse])
async def get_all_reports(db: Session = Depends(get_db)):
    reports = db.query(Report).all()
    return reports

