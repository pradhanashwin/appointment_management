import { combineReducers } from 'redux';
import EventReducer from './eventReducer';

const rootReducer = combineReducers({
    events: EventReducer
});

export default rootReducer;
