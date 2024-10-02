from fastapi import FastAPI
from prisma import Prisma

app = FastAPI()
prisma = Prisma()

@app.on_event("startup")
async def startup():
    await prisma.connect()

@app.on_event("shutdown")
async def shutdown():
    await prisma.disconnect()

@app.get("/events/")
async def get_events():
    events = await prisma.event.find_many()
    return events

@app.get("/parks/")
async def get_parks():
    parks = await prisma.park.find_many()
    return parks

@app.get("/spots/")
async def get_spots():
    spots = await prisma.spot.find_many()
    return spots




# from fastapi import FastAPI, Depends
# from sqlalchemy.orm import Session
# from . import models
# from .database import engine, get_db

# models.Base.metadata.create_all(bind=engine)

# app = FastAPI()

# @app.get("/parks")
# def get_parks(db: Session = Depends(get_db)):
#     return db.query(models.Park).all()

# @app.get("/events")
# def get_events(db: Session = Depends(get_db)):
#     return db.query(models.Event).all()

# @app.get("/spots")
# def get_spots(db: Session = Depends(get_db)):
#     return db.query(models.Spot).all()
