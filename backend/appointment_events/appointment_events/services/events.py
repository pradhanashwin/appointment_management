# appointment/services/events.py
from sqlalchemy.orm import Session
from appointment_events.db.models.events import Event
from typing import List, Optional
from sqlalchemy.future import select
from fastapi import APIRouter, HTTPException, Query, Request
from datetime import datetime
import pytz
from appointment_events.schemas.events import EventResponse

async def get_events(db: Session, skip: int = 0, limit: int = 10) -> List[EventResponse]:
    # Construct the query with pagination
    events_query = select(Event).offset(skip).limit(limit)
    
    # Await the query execution
    result = await db.execute(events_query)
    
    # Fetch all rows using scalars()
    events = result.scalars().all()

    if not events:
        raise HTTPException(status_code=404, detail="Events not found")

    # Convert events to EventResponse
    event_responses = []
    for event in events:
        # Ensure participants is a list
        # if event.participants is None:
        #     participants = []
        # elif isinstance(event.participants, str):
        #     participants = event.participants.split(',')
        # elif isinstance(event.participants, list):
        #     participants = event.participants
        # else:
        #     participants = []  # Fallback to empty list

        event_responses.append(EventResponse(
            id=event.id,
            title=event.title,
            start_datetime=event.start_datetime.isoformat(),
            end_datetime=event.end_datetime.isoformat(),
            description=event.description,
            participants=event.participants if event.participants else ''
        ))
    return event_responses

async def get_event(db: Session, event_id: int) -> EventResponse:
    query = select(Event).filter(Event.id == event_id)
    result = await db.execute(query)
    event = result.scalar_one_or_none()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    return EventResponse(
        id=event.id,
        title=event.title,
        start_datetime=event.start_datetime.isoformat(),
        end_datetime=event.end_datetime.isoformat(),
        description=event.description,
        participants=event.participants if event.participants else ''
    )

async def create_event(db: Session, event: Event) -> EventResponse:
    if event.start_datetime and event.start_datetime.tzinfo is None:
        event.start_datetime = pytz.UTC.localize(event.start_datetime)
    if event.end_datetime and event.end_datetime.tzinfo is None:
        event.end_datetime = pytz.UTC.localize(event.end_datetime)
    
    db.add(event)
    await db.commit()  # Ensure commit is awaited
    await db.refresh(event)  # Ensure refresh is awaited
    print("eventeventevent",event.title)
    return EventResponse(
        id=event.id,
        title=event.title,
        start_datetime=event.start_datetime.isoformat(),
        end_datetime=event.end_datetime.isoformat(),
        description=event.description,
        participants=event.participants if event.participants else '' # Ensure this is a list
    )

async def update_event(db: Session, event_id: int, event_data:dict) -> EventResponse:
    
    query = select(Event).filter(Event.id == event_id)
    result = await db.execute(query)
    event = result.scalar_one_or_none()
    if event:
        for key, value in event_data.items():
            setattr(event, key, value)
        await db.commit()
        await db.refresh(event)
    return event

async def delete_event(db: Session, event_id: int) -> bool:
    
    query = select(Event).filter(Event.id == event_id)
    result = await db.execute(query)
    event = result.scalar_one_or_none()
    if event:
        await db.delete(event)
        await db.commit()
        return True
    return False
