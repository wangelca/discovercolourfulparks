from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = 'user'
    
    id = Column(Integer, primary_key=True, index=True)
    clerk_user_id = Column(String, unique=True, index=True)
    username = Column(String, index=True, nullable=True)
    email = Column(String, unique=True, index=True)
    firstName = Column(String, nullable=True)
    lastName = Column(String, nullable=True)
    phoneNumber = Column(String, nullable=True)
    publicMetadata = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updatedAt = Column(DateTime, onupdate=datetime.datetime.utcnow)
    
    bookings = relationship("Booking", back_populates="user")
    payments = relationship("Payment", back_populates="user")


class Park(Base):
    __tablename__ = 'park'
    
    parkId = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    province = Column(String, nullable=True)
    description = Column(String)
    location = Column(String)
    parkImageUrl = Column(ARRAY(String))
    parameters = Column(String, nullable=True)
    
    spots = relationship("Spot", back_populates="park")
    events = relationship("Event", back_populates="park")  # Fix: Park has many events


class Spot(Base):
    __tablename__ = 'spot'
    
    spotId = Column(Integer, primary_key=True, index=True)
    parkId = Column(Integer, ForeignKey('park.parkId'))
    spotName = Column(String)
    spotDescription = Column(String)
    spotHourlyRate = Column(Float)
    spotDiscount = Column(Float)
    spotLocation = Column(String)
    spotImageUrl = Column(ARRAY(String), nullable=True)
    parameters = Column(String, nullable=True)
    requiredbooking = Column(Boolean, default=False)
    
    park = relationship("Park", back_populates="spots")
    bookings = relationship("Booking", back_populates="spot")


class Event(Base):
    __tablename__ = 'event'
    
    eventId = Column(Integer, primary_key=True, index=True)
    parkId = Column(Integer, ForeignKey('park.parkId'))
    eventName = Column(String)
    eventLocation = Column(String)
    fee = Column(Float)
    description = Column(String)
    discount = Column(Float)
    startDate = Column(DateTime)
    endDate = Column(DateTime)
    eventImageUrl = Column(ARRAY(String))
    parameters = Column(String, nullable=True)
    requiredbooking = Column(Boolean, default=False)
    
    park = relationship("Park", back_populates="events") 
    bookings = relationship("Booking", back_populates="event")


class Booking(Base):
    __tablename__ = 'bookings'
    
    bookingId = Column(Integer, primary_key=True, index=True)
    eventId = Column(Integer, ForeignKey('event.eventId'))
    id = Column(Integer, ForeignKey('user.id'))
    spotId = Column(Integer, ForeignKey('spot.spotId'))
    bookingDate = Column(DateTime)
    bookingStatus = Column(String)
    bookingStartTime = Column(DateTime)
    
    user = relationship("User", back_populates="bookings")
    event = relationship("Event", back_populates="bookings")
    spot = relationship("Spot", back_populates="bookings")
    payment = relationship("Payment", back_populates="booking", uselist=False)


class Payment(Base):
    __tablename__ = 'payments'
    
    paymentId = Column(Integer, primary_key=True, index=True)
    bookingId = Column(Integer, ForeignKey('bookings.bookingId'))
    id = Column(Integer, ForeignKey('user.id'))
    paymentStatus = Column(String)
    
    booking = relationship("Booking", back_populates="payment")
    user = relationship("User", back_populates="payments")
