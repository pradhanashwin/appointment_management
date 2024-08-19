import React, { useEffect } from 'react';

interface NotificationProps {
    event: {
        title: string;
    };
}

function Notification({ event }: NotificationProps) {
    useEffect(() => {
        if (Notification.permission === 'granted') {
            new Notification('Event Reminder', {
                body: `Event "${event.title}" starts now!`,
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('Event Reminder', {
                        body: `Event "${event.title}" starts now!`,
                    });
                }
            });
        }
    }, [event]);

    return null;
}

export default Notification;
