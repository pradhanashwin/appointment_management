import React from 'react';
import { useParams } from 'react-router-dom';
import EventForm from '../components/EventForm';

function EventDetails() {
    const { eventId } = useParams<{ eventId: string }>();
    // Fetch the event by ID and pass it to EventForm (for simplicity, not implemented here)
    return <EventForm event={{ id: eventId, title: '', startTime: '', endTime: '', description: '', participants: '' }} isEdit />;
}

export default EventDetails;
