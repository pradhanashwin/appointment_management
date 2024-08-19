from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from appointment_events.db.dependencies import get_db_session
from appointment_events.schemas.events import EventCreate, EventUpdate, Event as EventSchema
from appointment_events.services.events import create_event, get_events, get_event, update_event, delete_event
from appointment_events.db.models.events import Event as EventModel

router = APIRouter()

@router.post("/events/", response_model=EventSchema)
async def create_event_route(event: EventCreate, db: AsyncSession = Depends(get_db_session)):
    event_obj = EventModel(**event.dict())  # Convert Pydantic model to SQLAlchemy model
    return await create_event(db, event_obj)

@router.get("/events/", response_model=List[EventSchema])
async def read_events(skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_db_session)):
    return await get_events(db, skip=skip, limit=limit)

@router.get("/events/{event_id}", response_model=EventSchema)
async def read_event(event_id: int, db: AsyncSession = Depends(get_db_session)):
    db_event = await get_event(db, event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event

@router.put("/events/{event_id}", response_model=EventSchema)
async def update_event_route(event_id: int, event_data: EventUpdate, db: AsyncSession = Depends(get_db_session)):
    db_event = await update_event(db, event_id, event_data.dict())
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event

@router.delete("/events/{event_id}", response_model=bool)
async def delete_event_route(event_id: int, db: AsyncSession = Depends(get_db_session)):
    success = await delete_event(db, event_id)
    if not success:
        raise HTTPException(status_code=404, detail="Event not found")
    return success
