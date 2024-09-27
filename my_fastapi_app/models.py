from sqlalchemy import Column, Integer, String
from .database import Base

class Park(Base):
    __tablename__ = "parks"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    location = Column(String)

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    location = Column(String)
    date = Column(String)
    description = Column(String)

class Spot(Base):
    __tablename__ = "spots"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)
    hourly_rate = Column(Integer)
    location = Column(Integer)
    
