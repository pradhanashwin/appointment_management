# appointment/services/events.py
from sqlalchemy.orm import Session
from appointment_events.db.models.events import Event
from typing import List, Optional
from sqlalchemy.future import select
from fastapi import APIRouter, HTTPException, Query, Request
from datetime import datetime
import pytz
from appointment_events.schemas.events import EventResponse


DEFAULT_TIMEZONE = pytz.timezone('UTC')  # Example: Nepal Time

async def get_events(db: Session, skip: int = 0, limit: int = 10) -> List[EventResponse]:
    # Construct the query with pagination
    events_query = select(Event)
    
    # Await the query execution
    result = await db.execute(events_query)
    
    # Fetch all rows using scalars()
    events = result.scalars().all()

    if not events:
        raise HTTPException(status_code=404, detail="Events not found")

    # Convert events to EventResponse
    event_responses = []
    for event in events:
        event_responses.append(EventResponse(
            id=event.id,
            title=event.title,
            start_datetime=event.start_datetime.isoformat(),
            end_datetime=event.end_datetime.isoformat(),
            description=event.description,
            participants=event.participants
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
    if event.start_datetime:
        # Handle naive datetime: assume it is in the default timezone
        if event.start_datetime.tzinfo is None:
            event.start_datetime = DEFAULT_TIMEZONE.localize(event.start_datetime)
        # Convert to UTC
        event.start_datetime = event.start_datetime.astimezone(pytz.UTC)
    
    if event.end_datetime:
        # Handle naive datetime: assume it is in the default timezone
        if event.end_datetime.tzinfo is None:
            event.end_datetime = DEFAULT_TIMEZONE.localize(event.end_datetime)
        # Convert to UTC
        event.end_datetime = event.end_datetime.astimezone(pytz.UTC)
    
    db.add(event)
    await db.commit()  # Ensure commit is awaited
    await db.refresh(event)  # Ensure refresh is awaited
    
    return EventResponse(
        id=event.id,
        title=event.title,
        start_datetime=event.start_datetime.isoformat(),
        end_datetime=event.end_datetime.isoformat(),
        description=event.description,
        participants=event.participants if event.participants else ''
    )

async def update_event(db: Session, event_id: int, event_data: dict) -> EventResponse:
    query = select(Event).filter(Event.id == event_id)
    result = await db.execute(query)
    event = result.scalar_one_or_none()
    
    if event:
        for key, value in event_data.items():
            if key in ['start_datetime', 'end_datetime']:
                if isinstance(value, str):
                    # Convert from ISO format if necessary
                    value = datetime.fromisoformat(value)
                # Handle naive datetime: assume it is in the default timezone
                if value.tzinfo is None:
                    value = DEFAULT_TIMEZONE.localize(value)
                # Convert to UTC
                value = value.astimezone(pytz.UTC)
                setattr(event, key, value)
            else:
                setattr(event, key, value)
                
        await db.commit()
        await db.refresh(event)
        
        return EventResponse(
            id=event.id,
            title=event.title,
            start_datetime=event.start_datetime.isoformat(),
            end_datetime=event.end_datetime.isoformat(),
            description=event.description,
            participants=event.participants if event.participants else ''
        )
    
    raise HTTPException(status_code=404, detail="Event not found")

async def delete_event(db: Session, event_id: int) -> bool:
    
    query = select(Event).filter(Event.id == event_id)
    result = await db.execute(query)
    event = result.scalar_one_or_none()
    if event:
        await db.delete(event)
        await db.commit()
        return True
    return False
