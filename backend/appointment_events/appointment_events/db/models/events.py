from sqlalchemy import Column, Integer, String, DateTime
from appointment_events.db.base import Base

class Event(Base):
    __tablename__ = 'events'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String, index=True)
    start_datetime = Column(DateTime(timezone=True))
    end_datetime = Column(DateTime(timezone=True))
    description = Column(String)
    participants = Column(String)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Convert to timezone-aware if naive datetimes are provided
        if self.start_datetime and self.start_datetime.tzinfo is None:
            self.start_datetime = pytz.utc.localize(self.start_datetime)
        if self.end_datetime and self.end_datetime.tzinfo is None:
            self.end_datetime = pytz.utc.localize(self.end_datetime)
