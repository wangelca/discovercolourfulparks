# references : ChatGPT: define models for events, spots and reviews/ratings
from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class Event(Base):
    __tablename__ = 'events'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    location = Column(String)
    description = Column(Text)
    reviews = relationship("Reviews", back_populates="event")

class Spot(Base):
    __tablename__ = 'spots'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    location = Column(Text)
    reviews = relationship("Reviews", back_populates="spot")

class Review(Base):
    __tablename__ = 'reviews'

    id = Column(Integer, primary_key=True, index=True)
    rating = Column(Float, nullable=False)
    review = Column(Text, nullable=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    spot_id = Column(Integer, ForeignKey('spots.id'), nullable=True)
    
    event = relationship("Event", back_populates="reviews", foreign_keys=[event_id])
    spot = relationship("Spot", back_populates="reviews", foreign_keys=[spot_id])
    user = relationship("User", back_populates="reviews", foreign_keys=[user_id])






