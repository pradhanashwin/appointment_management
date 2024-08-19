import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface Event {
    id?: string;
    title: string;
    start: string;
    end: string;
    description: string;
    participants: string;
}

interface EventFormProps {
    event?: Event;
    isEdit?: boolean;
    startDate?: Date; // Optional start date
    endDate?: Date;   // Optional end date
}

const EventForm: React.FC<EventFormProps> = ({ event, isEdit = false, startDate, endDate }) => {
    const [title, setTitle] = useState<string>(event?.title || '');
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [description, setDescription] = useState<string>(event?.description || '');
    const [participants, setParticipants] = useState<string>(event?.participants || '');
    const navigate = useNavigate();

    // Update form fields when event or date range changes
    useEffect(() => {
        if (event) {
            setTitle(event.title);
            setStartTime(event.startTime);
            setEndTime(event.endTime);
            setDescription(event.description);
            setParticipants(event.participants);
        } else if (startDate && endDate) {
            setStartTime(format(startDate, "yyyy-MM-dd'T'HH:mm"));
            setEndTime(format(endDate, "yyyy-MM-dd'T'HH:mm"));
        }
    }, [event, startDate, endDate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newEvent: Event = { title, startTime, endTime, description, participants };

        try {
            if (isEdit && event?.id) {
                await axios.put(`/api/events/${event.id}`, newEvent);
            } else {
                await axios.post('/api/events', newEvent);
            }
            navigate('/');
        } catch (error) {
            console.error('Error saving event:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                placeholder="Event Title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
            />
            <input 
                type="datetime-local" 
                placeholder="Start Time" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)} 
                required 
            />
            <input 
                type="datetime-local" 
                placeholder="End Time" 
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)} 
                required 
            />
            <textarea 
                placeholder="Description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
            />
            <input 
                type="text" 
                placeholder="Participants" 
                value={participants} 
                onChange={(e) => setParticipants(e.target.value)} 
            />
            <button type="submit">{isEdit ? 'Update Event' : 'Create Event'}</button>
        </form>
    );
};

export default EventForm;
