import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import EventCard from '../components/EventCard';
import EditEventModal from '../components/EditEventModal';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/DiscoverEvents.css'; // Reusing Discover Styles

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingEvent, setEditingEvent] = useState(null);
    const { auth } = useAuth();

    const fetchMyEvents = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/event/user-events');
            if (data?.success) {
                setEvents(data.events);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyEvents();
    }, []);

    const handleEdit = (event) => {
        setEditingEvent(event);
    };

    const handleUpdate = () => {
        fetchMyEvents();
        // Optional: show toast notification
    };

    return (
        <div className="discover-container">
            <div className="discover-header">
                <h1 className="discover-title">My Events</h1>
                <p className="discover-subtitle">Manage the events you are hosting.</p>
            </div>

            {loading ? (
                <div className="loading-state">Loading your events...</div>
            ) : events.length === 0 ? (
                <div className="empty-state">
                    <p>You haven't created any events yet.</p>
                    <Link to="/create-event" className="btn-primary">Create Event</Link>
                </div>
            ) : (
                <div className="event-grid">
                    {events.map(event => (
                        <EventCard
                            key={event._id}
                            event={event}
                            refresh={fetchMyEvents}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>
            )}

            {editingEvent && (
                <EditEventModal
                    event={editingEvent}
                    onClose={() => setEditingEvent(null)}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
};

export default MyEvents;
