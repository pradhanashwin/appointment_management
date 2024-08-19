import axios from 'axios';
import moment from 'moment';

// Define your API base URL
const BASE_URL = 'http://localhost:8000/api';

// Action Types
export const FETCH_EVENTS = 'fetch_events';
export const CREATE_EVENT = 'create_event';
export const UPDATE_EVENT = 'update_event';
export const DELETE_EVENT = 'delete_event';
export const PAST_EVENTS = 'past_events';
export const UPCOMING_EVENTS = 'upcoming_events';

// Helper function for API requests
const apiRequest = async (url: string, method: string, data?: any) => {
    try {
        const response = await axios({ url, method, data });
        return response.data;
    } catch (error) {
        console.error(`API request failed: ${error}`);
        throw error;
    }
};

// Fetch events from the backend
export function fetchEvents() {
    return async (dispatch: Dispatch) => {
        try {
            const events = await apiRequest(`${BASE_URL}/events/`, 'GET');
            dispatch({ type: FETCH_EVENTS, payload: events });
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };
}

// Create a new event
export function createEvent(values: any) {
    return async (dispatch: Dispatch) => {
        try {
            debugger
            const newEvent = await apiRequest(`${BASE_URL}/events/`, 'POST', values);
            dispatch({ type: CREATE_EVENT, payload: newEvent });
            dispatch(fetchEvents()); // Refresh events list
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };
}

// Update an existing event
export function updateEvent(values: any) {
    return async (dispatch: Dispatch) => {
        try {
            const updatedEvent = await apiRequest(`${BASE_URL}/events/${values.id}`, 'PUT', values);
            dispatch({ type: UPDATE_EVENT, payload: updatedEvent });
            dispatch(fetchEvents()); // Refresh events list
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };
}

// Delete an event
export function deleteEvent(id: number) {
    return async (dispatch: Dispatch) => {
        try {
            await apiRequest(`${BASE_URL}/events/${id}`, 'DELETE');
            dispatch({ type: DELETE_EVENT, payload: id });
            dispatch(fetchEvents()); // Refresh events list
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };
}

// Get all past events
export function pastEvents() {
    return async (dispatch: Dispatch) => {
        try {
            const events = await apiRequest(`${BASE_URL}/events/`, 'GET');
            const pastEvents = events.filter((item: any) => moment().isAfter(moment(item.start)));
            dispatch({ type: PAST_EVENTS, payload: pastEvents });
        } catch (error) {
            console.error('Error fetching past events:', error);
        }
    };
}

// Get all upcoming events
export function upcomingEvents() {
    return async (dispatch: Dispatch) => {
        try {
            const events = await apiRequest(`${BASE_URL}/events/`, 'GET');
            const upcomingEvents = events.filter((item: any) => moment().isBefore(moment(item.start)));
            dispatch({ type: UPCOMING_EVENTS, payload: upcomingEvents });
        } catch (error) {
            console.error('Error fetching upcoming events:', error);
        }
    };
}
