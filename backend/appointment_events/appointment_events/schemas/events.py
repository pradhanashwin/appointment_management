from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    participants: Optional[str] = None
    start_datetime: datetime
    end_datetime: datetime

class EventCreate(EventBase):
    title: str
    start_datetime: datetime
    end_datetime: datetime
    description: Optional[str] = None
    participants: Optional[str] = None

class EventResponse(BaseModel):
    id: int
    title: str
    start_datetime: str
    end_datetime: str
    participants: str
    description: str

class EventUpdate(EventBase):
    pass

class Event(EventBase):
    id: int

    class Config:
        orm_mode = True
