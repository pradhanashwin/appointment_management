import { FETCH_EVENTS, CREATE_EVENT, UPDATE_EVENT, DELETE_EVENT, PAST_EVENTS, UPCOMING_EVENTS } from "../actions";

interface Event {
    id: number;
    title: string;
    start: Date;
    end: Date;
    description?: string;
    participants?: string;
}

interface EventAction {
    type: string;
    payload: any;
}

const initialState: Event[] = [];

export default function eventReducer(state = initialState, action: EventAction): Event[] {
    switch(action.type) {
        case FETCH_EVENTS:
            return action.payload;

        case CREATE_EVENT:
            return [...state, action.payload]; // Add new event

        case UPDATE_EVENT:
            return state.map(event =>
                event.id === action.payload.id ? action.payload : event
            ); // Update existing event

        case DELETE_EVENT:
            return state.filter(event => event.id !== action.payload); // Remove event by id

        case PAST_EVENTS:
            return action.payload; // Assuming the payload is already filtered for past events

        case UPCOMING_EVENTS:
            return action.payload; // Assuming the payload is already filtered for upcoming events

        default: 
            return state;
    }
}
