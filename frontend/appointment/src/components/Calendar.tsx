// src/components/Calendar.tsx
import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Calendar as BigCalendar, momentLocalizer, Views as CalendarViews } from 'react-big-calendar';
import TimezoneSelector from './TimezoneSelector'; // Import the TimezoneSelector component
import CustomToolbar from './toolbar';
import CustomModal from './CustomModal'; // Import the custom modal component
import Input from './input';
import moment from 'moment';
import momentTimezone from 'moment-timezone'; // Import moment-timezone
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../actions';
import axios from 'axios';


interface Event {
    id: number;
    title: string;
    start: Date;
    end: Date;
    description?: string;
    participants?: string;
}

const Calendar: React.FC<ConnectedProps<typeof connector>> = ({ events, fetchEvents, createEvent, updateEvent, deleteEvent }) => {
    const [modalIsOpen, setIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
    const [modalTitle, setModalTitle] = useState('');
    const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
    const [holidays, setHolidays] = useState<any[]>([]);
    const [date, setDate] = useState(new Date());
    const [selectedTimezone, setSelectedTimezone] = useState(momentTimezone.tz.guess()); // Initialize with user's local timezone
    const holidayKey = process.env.VITE_APP_HOLIDAY_KEY;
    const localizer = momentLocalizer(moment.tz.setDefault(selectedTimezone));

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const fetchHolidays = async (year: number) => {
        
        try {
            const url = `https://holidayapi.com/v1/holidays?country=NP&year=${year}&key=${holidayKey}`;
            const response = await axios.get(url);
            setHolidays(response.data.holidays || []);
        } catch (error) {
            console.error('Error fetching holidays:', error);
        }
    };

    useEffect(() => {
        const currentYear = date.getFullYear();
        fetchHolidays(currentYear);
    }, []);

    const handleYearChange = (year: number) => {
        const newDate = new Date(year, date.getMonth(), date.getDate());
        setDate(newDate);
        setHolidays([]); // Clear holidays before fetching new ones
        fetchHolidays(year); // Fetch holidays for the selected year
    };
    const handleTimezoneChange = (timezone: string) => {
        setSelectedTimezone(timezone);
    };
    // Map backend event data to react-big-calendar format
    const mappedEvents = events.map((event: any) => ({
        id: event.id,
        title: event.title,
        start: momentTimezone.tz(event.start_datetime, selectedTimezone).toDate(),
        end: momentTimezone.tz(event.end_datetime, selectedTimezone).toDate(),
        description: event.description,
        participants: event.participants
    }));

    const onSelectEventHandler = (event: Event) => {
        setModalTitle('Edit Event');
        setCurrentEvent(event);
        setModalContent(
            <div className="event-form">
                <div className="mb-3">
                    <Input 
                        type="text" 
                        onChange={(value) => setCurrentEvent(prev => ({ ...prev, title: value }))} 
                        placeholder="Event Title" 
                        defaultValue={event.title}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="event-start" className="form-label">Start Datetime</label>
                    <Input 
                        type="datetime-local" 
                        onChange={(value) => setCurrentEvent(prev => ({ ...prev, start: value }))} 
                        placeholder="Start Datetime" 
                        defaultValue={moment(event.start).format('YYYY-MM-DDTHH:mm')} 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="event-end" className="form-label">End Datetime</label>
                    <Input 
                        type="datetime-local" 
                        onChange={(value) => setCurrentEvent(prev => ({ ...prev, end: value }))} 
                        placeholder="End Datetime" 
                        defaultValue={moment(event.end).format('YYYY-MM-DDTHH:mm')} 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="event-description" className="form-label">Description</label>
                    <Input 
                        type="text" 
                        onChange={(value) => setCurrentEvent(prev => ({ ...prev, description: value }))} 
                        placeholder="Description" 
                        defaultValue={event.description || ''} 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="event-participants" className="form-label">Participants</label>
                    <Input 
                        type="text" 
                        onChange={(value) => setCurrentEvent(prev => ({ ...prev, participants: value }))} 
                        placeholder="Participants (comma-separated)" 
                        defaultValue={event.participants || ''} 
                    />
                </div>
            </div>
        );
        setIsOpen(true); // Opens the modal
    };

    const onSelectEventSlotHandler = (slotInfo) => {
        setCurrentEvent({
            id: null,
            title: '',
            // start: momentTimezone.tz(slotInfo.start, selectedTimezone).toISOString(),
            // end: momentTimezone.tz(slotInfo.end, selectedTimezone).toISOString(),
            start: slotInfo.start,
            end: slotInfo.end,
            description: '',
            participants: ''
        });
        setModalTitle('Create Event');
        setModalContent(
            <div className="event-form">
                <div className="mb-3">
                    <Input 
                        type="text" 
                        onChange={(value) => setCurrentEvent(prev => ({ ...prev, title: value }))} 
                        placeholder="Event Title" 
                        defaultValue="" 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="event-start" className="form-label">Start Datetime</label>
                    <Input 
                        type="datetime-local" 
                        onChange={(value) => setCurrentEvent(prev => ({ ...prev, start: value }))} 
                        placeholder="Start Datetime" 
                        defaultValue={moment(slotInfo.start).format('YYYY-MM-DDTHH:mm')} 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="event-end" className="form-label">End Datetime</label>
                    <Input 
                        type="datetime-local" 
                        onChange={(value) => setCurrentEvent(prev => ({ ...prev, end: value }))} 
                        placeholder="End Datetime" 
                        defaultValue={moment(slotInfo.end).format('YYYY-MM-DDTHH:mm')} 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="event-description" className="form-label">Description</label>
                    <Input 
                        type="text" 
                        onChange={(value) => setCurrentEvent(prev => ({ ...prev, description: value }))} 
                        placeholder="Description" 
                        defaultValue="" 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="event-participants" className="form-label">Participants</label>
                    <Input 
                        type="text" 
                        onChange={(value) => setCurrentEvent(prev => ({ ...prev, participants: value }))} 
                        placeholder="Participants (comma-separated)" 
                        defaultValue="" 
                    />
                </div>
            </div>
        );
        setIsOpen(true);
    };

    const handleSave = () => {
        if (currentEvent) {
            // Convert Date objects to ISO strings
            const formattedEvent = {
                ...currentEvent,
                start_datetime: momentTimezone.tz(currentEvent.start, selectedTimezone).toISOString(),
                end_datetime: momentTimezone.tz(currentEvent.end, selectedTimezone).toISOString(),
            };
    
            // Remove the old Date fields
            delete formattedEvent.start;
            delete formattedEvent.end;
    
            // Handle the event creation or update
            
            if (formattedEvent.id) {
                updateEvent(formattedEvent);
            } else {
                delete formattedEvent['id'];
                createEvent(formattedEvent);
            }
            setIsOpen(false);
        }
    };

    const handleDelete = () => {
        if (currentEvent?.id) {
            deleteEvent(currentEvent.id);
            setIsOpen(false);
        }
    };

    const eventStyleGetter = (event: Event, selectedTimezone: string) => {
        const current_time = moment.tz(moment(), selectedTimezone).format('YYYY MM DD');
        const event_time = moment.tz(event.start, selectedTimezone).format('YYYY MM DD');
        const background = current_time > event_time ? '#DE6987' : '#8CBD4C';
        return {
            style: {
                backgroundColor: background
            }
        };
    };
    
    
    return (
        <div className="calendar-container">
            <TimezoneSelector
                selectedTimezone={selectedTimezone}
                onTimezoneChange={handleTimezoneChange}
            />
            <BigCalendar
                localizer={localizer}
                defaultView={CalendarViews.MONTH}
                style={{ height: 600 }}
                events={mappedEvents}
                date={date}
                onNavigate={(newDate) => setDate(newDate)}
                eventPropGetter={(event) => eventStyleGetter(event, selectedTimezone)}
                components={{ toolbar: (props) => <CustomToolbar {...props} onYearChange={handleYearChange} onTimezoneChange={handleTimezoneChange}/> }}
                onSelectEvent={onSelectEventHandler}
                onSelectSlot={onSelectEventSlotHandler}
                selectable
            />
            <h2>Holidays</h2><span style={{fontSize:10}}>**only historical holidays before this year are available.</span>
            <ul>
                {holidays.map((holiday, index) => (
                    <li key={index}>{holiday.name} - {holiday.date}</li>
                ))}
            </ul>
            <CustomModal
                isOpen={modalIsOpen}
                onRequestClose={() => setIsOpen(false)}
                title={modalTitle}
                content={modalContent || <div>No Content</div>}
                onSave={handleSave}
                onDelete={currentEvent?.id ? handleDelete : undefined}
            />
        </div>
    );
};

const mapStateToProps = (state: any) => {
    return {
        events: state.events,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent
}, dispatch);

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(Calendar);
