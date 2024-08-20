// src/components/TimezoneSelector.tsx
import React from 'react';
import momentTimezone from 'moment-timezone';

interface TimezoneSelectorProps {
    onTimezoneChange: (timezone: string) => void;
    selectedTimezone: string;
}

const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({ onTimezoneChange, selectedTimezone }) => {
    const timezones = momentTimezone.tz.names();

    return (
        <div className="timezone-selector">
            <label htmlFor="timezone">Select Timezone:</label>
            <select 
                id="timezone" 
                value={selectedTimezone} 
                onChange={(e) => onTimezoneChange(e.target.value)}
            >
                {timezones.map((tz) => (
                    <option key={tz} value={tz}>{tz}</option>
                ))}
            </select>
        </div>
    );
};

export default TimezoneSelector;
