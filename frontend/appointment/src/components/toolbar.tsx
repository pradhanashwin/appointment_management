// src/components/toolbar.tsx
import React, { useEffect, useState } from 'react';
import { ToolbarProps } from 'react-big-calendar';

interface CustomToolbarProps extends ToolbarProps {
    onYearChange: (year: number) => void;
    date: Date;
}

const CustomToolbar: React.FC<CustomToolbarProps> = ({ label, onNavigate, onView, onYearChange, date }) => {
    const [selectedYear, setSelectedYear] = useState(date.getFullYear());

    useEffect(() => {
        setSelectedYear(date.getFullYear());
    }, [date]);

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newYear = Number(event.target.value);
        setSelectedYear(newYear);
        onYearChange(newYear);
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);

    return (
        <div className="rbc-toolbar">
            <span className="rbc-btn-group">
                <button type="button" onClick={() => onNavigate('PREV')}>Back</button>
                <button type="button" onClick={() => onNavigate('TODAY')}>Today</button>
                <button type="button" onClick={() => onNavigate('NEXT')}>Next</button>
            </span>
            <span className="rbc-toolbar-label">{label}</span>
            <span className="rbc-btn-group">
                <select value={selectedYear} onChange={handleYearChange}>
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </span>
            <span className="rbc-btn-group">
                <button type="button" onClick={() => onView('month')}>Month</button>
                <button type="button" onClick={() => onView('week')}>Week</button>
                <button type="button" onClick={() => onView('day')}>Day</button>
            </span>
        </div>
    );
};

export default CustomToolbar;
