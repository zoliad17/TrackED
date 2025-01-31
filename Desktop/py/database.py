from sqlalchemy import create_engine
from fastapi import Depends
from typing import Annotated
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
import os
from dotenv import load_dotenv, dotenv_values

load_dotenv()

URL_DATABASE = os.getenv("URL_DATABASE")

engine = create_engine(URL_DATABASE)

SessionLocal = sessionmaker( autoflush='False', bind=engine)

Base = declarative_base()
# Get Database 
def get_db():
    db = None
    try:
        db = SessionLocal()
        yield db
    finally:
        if db is not None:
            db.close()

db_dependency = Annotated[Session, Depends(get_db)]