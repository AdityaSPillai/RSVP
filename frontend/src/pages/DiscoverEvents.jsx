import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import EventCard from '../components/EventCard';
import '../styles/DiscoverEvents.css';

import EditEventModal from '../components/EditEventModal';
import { useAuth } from '../context/AuthContext';

const DiscoverEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [editingEvent, setEditingEvent] = useState(null);
    const { auth } = useAuth(); // Needed for EventCard checks implicitly, but also good practice

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const params = {};
            if (search) params.search = search;
            if (category) params.category = category;

            const res = await api.get('/event/all', { params });
            setEvents(res.data.events || []);
        } catch (err) {
            console.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [search, category]);

    const handleEdit = (event) => {
        setEditingEvent(event);
    };

    const handleUpdate = () => {
        fetchEvents();
    };

    return (
        <div className="discover-wrapper">
            <header className="discover-header">
                <h1>Discover Events</h1>
                <p>Explore and join events happening around you</p>
            </header>

            <section className="discover-controls">
                <input
                    type="text"
                    placeholder="Search by title, description, or location"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="Conference">Conference</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Meetup">Meetup</option>
                    <option value="Party">Party</option>
                    <option value="Sports">Sports</option>
                    <option value="Music">Music</option>
                    <option value="Other">Other</option>
                </select>
            </section>

            {loading ? (
                <div className="event-grid">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="event-skeleton" />
                    ))}
                </div>
            ) : events.length === 0 ? (
                <div className="empty-state">
                    <h3>No events found</h3>
                    <p>Try changing your search or filters</p>
                </div>
            ) : (
                <div className="event-grid">
                    {events.map((event) => (
                        <EventCard
                            key={event._id}
                            event={event}
                            refresh={fetchEvents}
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

export default DiscoverEvents;