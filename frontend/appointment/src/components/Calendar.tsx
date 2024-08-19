// src/components/Calendar.tsx
import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Calendar as BigCalendar, momentLocalizer, Views as CalendarViews } from 'react-big-calendar';
import CustomToolbar from './toolbar';
import CustomModal from './CustomModal'; // Import the custom modal component
import Input from './input';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../actions';
import axios from 'axios';

const localizer = momentLocalizer(moment);

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

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                const url = `https://holidayapi.com/v1/holidays?country=NP&year=2023&key=7908bfe9-6fc9-474b-acf1-de5963aea45d`;
                const response = await axios.get(url);
                setHolidays(response.data.holidays || []);
            } catch (error) {
                console.error('Error fetching holidays:', error);
            }
        };

        fetchHolidays();
    }, []);


    const holidayDates = holidays.map(holiday => new Date(holiday.date));
    const handleYearChange = (year: number) => {
        const newDate = new Date(year, date.getMonth(), date.getDate());
        setDate(newDate);
    };
    
    // Map backend event data to react-big-calendar format
    const mappedEvents = events.map((event: any) => ({
        id: event.id,
        title: event.title,
        start: new Date(event.start_datetime),
        end: new Date(event.end_datetime),
        description: event.description,
        participants: '' // Adjust if participants are included in the backend
    }));

    const onSelectEventHandler = (event: Event) => {
        setModalTitle('Event Details');
        setModalContent(
            <div>
                <p><strong>Id:</strong> {event.id}</p>
                <p><strong>Title:</strong> {event.title}</p>
                <p><strong>Start:</strong> {moment(event.start).format('MMMM D, YYYY HH:mm')}</p>
                <p><strong>End:</strong> {moment(event.end).format('MMMM D, YYYY HH:mm')}</p>
                <p><strong>Description:</strong> {event.description}</p>
                <p><strong>Participants:</strong> {event.participants}</p>
            </div>
        );
        setCurrentEvent(event);
        setIsOpen(true); // Opens the modal
    };

    const onSelectEventSlotHandler = (slotInfo: any) => {
        setCurrentEvent({
            id: null,
            title: '',
            start: slotInfo.start,
            end: slotInfo.end,
            description: '',
            participants: ''
        });
        setModalTitle('Create Event');
        setModalContent(
            <div>
                <input type="hidden" value={currentEvent?.id || ''} />
                <Input onChange={(value) => setCurrentEvent((prev: any) => ({ ...prev, title: value }))} placeholder="Event Title" defaultValue="" />
                <Input type="datetime" onChange={(value) => setCurrentEvent((prev: any) => ({ ...prev, start: new Date(value).toISOString() }))} placeholder="Start Datetime" defaultValue={moment(slotInfo.start).format('YYYY-MM-DDTHH:mm')} />
                <Input type="datetime" onChange={(value) => setCurrentEvent((prev: any) => ({ ...prev, end: new Date(value).toISOString() }))} placeholder="End Datetime" defaultValue={moment(slotInfo.end).format('YYYY-MM-DDTHH:mm')} />
                <Input onChange={(value) => setCurrentEvent((prev: any) => ({ ...prev, description: value }))} placeholder="Description" defaultValue="" />
                <Input onChange={(value) => setCurrentEvent((prev: any) => ({ ...prev, participants: value}))} placeholder="Participants (comma-separated)" defaultValue="" />
            </div>
        );
        setIsOpen(true); // Opens the modal
    };

    const handleSave = () => {
        const formattedEvent = {
            ...currentEvent,
            start_datetime: currentEvent.start,
            end_datetime: currentEvent.end,
        };
        delete formattedEvent.start;
        delete formattedEvent.end;

        if (formattedEvent) {
            debugger
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

    const eventStyleGetter = (event: Event) => {
        const current_time = moment().format('YYYY MM DD');
        const event_time = moment(event.start).format('YYYY MM DD');
        const background = current_time > event_time ? '#DE6987' : '#8CBD4C';
        return {
            style: {
                backgroundColor: background
            }
        };
    };

    console.log('Displaying events in calendar:', mappedEvents); // Ensure events are correctly formatted

    return (
        <div className="calendar-container">
            <BigCalendar
                localizer={localizer}
                defaultView={CalendarViews.MONTH}
                style={{ height: 600 }}
                events={mappedEvents}
                date={date}
                onNavigate={(newDate) => setDate(newDate)}
                eventPropGetter={eventStyleGetter}
                components={{ toolbar: (props) => <CustomToolbar {...props} onYearChange={handleYearChange} /> }}
                onSelectEvent={onSelectEventHandler}
                onSelectSlot={onSelectEventSlotHandler}
                selectable
            />
            <h2>Holidays</h2>
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
    console.log('Redux state events:', state.events); // Add this line to verify the Redux state
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
