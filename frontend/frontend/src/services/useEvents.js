import { useState } from 'react';
import { eventService } from '../services';

export const useEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await eventService.getAllEvents();
            setEvents(response.data.events);
        } catch (err) {
            setError('Failed to fetch events');
            console.error('Error fetching events:', err);
        } finally {
            setLoading(false);
        }
    }

    return {
        events,
        loading,
        error,
        fetchEvents
    };
};