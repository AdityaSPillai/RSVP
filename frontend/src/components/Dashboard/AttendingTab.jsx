import { useState, useEffect } from 'react';
import api from '../../utils/api';
import EventCard from '../EventCard';
import '../../styles/DiscoverEvents.css';

const AttendingTab = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAttendingEvents = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/event/attending');
            if (data?.success) {
                setEvents(data.events);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendingEvents();
    }, []);

    return (
        <>
            <h2 className="discover-title">Attending</h2>
            <p className="discover-subtitle">Events you have joined.</p>

            {loading ? (
                <div className="loading-state">Loading attending events...</div>
            ) : events.length === 0 ? (
                <div className="empty-state">
                    <p>You are not attending any events yet.</p>
                </div>
            ) : (
                <div className="event-grid">
                    {events.map(event => (
                        <EventCard
                            key={event._id}
                            event={event}
                            refresh={fetchAttendingEvents}
                        />
                    ))}
                </div>
            )}
        </>
    );
};

export default AttendingTab;