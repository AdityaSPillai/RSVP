import { useState, useEffect } from 'react';
import api from '../../utils/api';
import EventCard from '../EventCard';
import EditEventModal from '../EditEventModal';
import { Link } from 'react-router-dom';
import '../../styles/DiscoverEvents.css';

const MyEventsTab = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingEvent, setEditingEvent] = useState(null);

    const fetchMyEvents = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/event/user-events');
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
        fetchMyEvents();
    }, []);

    return (
        <>
            <h2 className="discover-title">My Events</h2>
            <p className="discover-subtitle">Manage the events you are hosting.</p>

            {loading ? (
                <div className="loading-state">Loading your events...</div>
            ) : events.length === 0 ? (
                <div className="empty-state">
                    <p>You haven't created any events yet.</p>
                    <Link to="/create-event" className="btn-primary">
                        Create Event
                    </Link>
                </div>
            ) : (
                <div className="event-grid">
                    {events.map(event => (
                        <EventCard
                            key={event._id}
                            event={event}
                            refresh={fetchMyEvents}
                            onEdit={setEditingEvent}
                        />
                    ))}
                </div>
            )}

            {editingEvent && (
                <EditEventModal
                    event={editingEvent}
                    onClose={() => setEditingEvent(null)}
                    onUpdate={fetchMyEvents}
                />
            )}
        </>
    );
};

export default MyEventsTab;