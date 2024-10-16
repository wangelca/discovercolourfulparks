# database.py

from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from databases import Database
from dotenv import load_dotenv
import os

load_dotenv()

# Load the database URL from environment variable
DATABASE_URL = os.getenv("DATABASE_URL")

# Initialize databases for async queries
database = Database(DATABASE_URL)

# Create SQLAlchemy engine for synchronous ORM interaction
engine = create_engine(DATABASE_URL)

# Initialize Base and sessionmaker for ORM
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Initialize declarative base (this automatically uses metadata)
Base = declarative_base()
