from sqlalchemy.orm import DeclarativeBase

from appointment_events.db.meta import meta


class Base(DeclarativeBase):
    """Base for all models."""

    metadata = meta
