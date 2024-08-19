// src/App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import CalendarComponent from './components/Calendar';
import store from './stores';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <h1>Event Calendar</h1>
        <CalendarComponent />
      </div>
    </Provider>
  );
};

export default App;
