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
    const { auth } = useAuth();
    const [sort, setSort] = useState('date');
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const params = {};
            if (search) params.search = search;
            if (category) params.category = category;
            if (sort) params.sort = sort;

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
    }, [search, category, sort]);

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

                <div className="filter-dropdown">
                    <button
                        className="filter-btn"
                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    >
                        {category || 'All Categories'}
                    </button>

                    {showCategoryDropdown && (
                        <div className="dropdown-menu">
                            {[
                                'All Categories',
                                'Conference',
                                'Workshop',
                                'Meetup',
                                'Party',
                                'Sports',
                                'Music',
                                'Other'
                            ].map(cat => (
                                <div
                                    key={cat}
                                    className={`dropdown-item ${category === cat ? 'active' : ''}`}
                                    onClick={() => {
                                        setCategory(cat);
                                        setShowCategoryDropdown(false);
                                    }}
                                >
                                    {cat}
                                    {category === cat && <span className="check">✓</span>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="filter-dropdown">
                    <button
                        className="filter-btn"
                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                    >
                        {sort === 'date'
                            ? 'Date (Earliest)'
                            : sort === 'popular'
                                ? 'Most Popular'
                                : 'Largest Capacity'}
                    </button>

                    {showSortDropdown && (
                        <div className="dropdown-menu">
                            <div className={`dropdown-item ${sort === 'date' ? 'active' : ''}`}
                                onClick={() => { setSort('date'); setShowSortDropdown(false); }}>
                                Date (Earliest) {sort === 'date' && <span className="check">✓</span>}
                            </div>

                            <div className={`dropdown-item ${sort === 'popular' ? 'active' : ''}`}
                                onClick={() => { setSort('popular'); setShowSortDropdown(false); }}>
                                Most Popular {sort === 'popular' && <span className="check">✓</span>}
                            </div>

                            <div className={`dropdown-item ${sort === 'capacity' ? 'active' : ''}`}
                                onClick={() => { setSort('capacity'); setShowSortDropdown(false); }}>
                                Largest Capacity {sort === 'capacity' && <span className="check">✓</span>}
                            </div>
                        </div>
                    )}
                </div>
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