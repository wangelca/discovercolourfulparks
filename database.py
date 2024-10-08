from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from databases import Database

# Database URL
DATABASE_URL = "postgresql://postgres:2131@localhost:5432/ColorfulNationalParks"

# For asynchronous database handling
database = Database(DATABASE_URL)

# SQLAlchemy metadata and engine creation
metadata = MetaData()

# Create SQLAlchemy engine for synchronous ORM interaction
engine = create_engine(DATABASE_URL)

# Session management
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for your models
Base = declarative_base()
