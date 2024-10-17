from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Event(Base):
    __tablename__ = 'events'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    location = Column(String)
    description = Column(Text)
    reviews = relationship("Review", back_populates="park")

class Spot(Base):
    __tablename__ = 'spots'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    reviews = relationship("Review", back_populates="spot")

class Review(Base):
    __tablename__ = 'reviews'
    id = Column(Integer, primary_key=True, index=True)
    rating = Column(Float)
    comment = Column(Text)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=True)
    spot_id = Column(Integer, ForeignKey('spots.id'), nullable=True)
    event = relationship("Event", back_populates="reviews")
    spot = relationship("Spot", back_populates="reviews")






