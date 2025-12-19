import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { useState } from 'react';
import AttendeesModal from './AttendeesModal';
import '../styles/EventCard.css';

const EventCard = ({ event, refresh, onEdit }) => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [showAttendees, setShowAttendees] = useState(false);
    const CATEGORY_COLORS = {
        Conference: "#F2545B",
        Workshop: "#A93F55",
        Meetup: "#19323C",
        Party: "#869596",
        Sports: "#C0ABA4",
        Music: "#A6857E",
        Other: "#8C5E58"
    };

    const isAttending =
        auth.user &&
        event.attendees.some(a =>
            (typeof a === 'object' ? a._id : a) === auth.user.id
        );

    // Check if current user is the host
    const isHost = auth.user && (
        event.host?._id?.toString() === auth.user.id ||
        event.host?.toString() === auth.user.id
    );

    const isFull = event.attendees.length >= event.capacity;
    const aboutToBeFull = event.attendees.length >= event.capacity * 0.9;
    const spotsLeft = event.capacity - event.attendees.length;

    const joinEvent = async () => {
        await api.put(`/event/join/${event._id}`);
        refresh();
    };

    const leaveEvent = async () => {
        await api.put(`/event/leave/${event._id}`);
        refresh();
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <article className="event-card">
            {/* IMAGE HEADER */}
            <div className="event-image-wrapper">
                {event.image ? (
                    <img
                        src={event.image}
                        alt={event.title}
                        className="event-image"
                    />
                ) : (
                    <img src="/default.jpg" alt="Default Cover Image" className="event-image" />
                )}

                <span
                    className="event-badge category"
                    style={{
                        backgroundColor: CATEGORY_COLORS[event.category] || CATEGORY_COLORS.Other,
                        color: "#fff"
                    }}
                >
                    {event.category}
                </span>

                {isFull && !isAttending && (
                    <span className="event-badge sold-out">
                        Sold Out
                    </span>
                )}

                {aboutToBeFull && !isAttending && !isFull && (
                    <span className="event-badge sold-out">
                        Filling Fast
                    </span>
                )}
            </div>

            {/* CONTENT */}
            <div className="event-card-body">
                <h3 className="event-title">{event.title}</h3>
                <div className="event-icon-data">
                    <img src="/calendar.png" className="event-icon" alt="Calendar Icon" />
                    <p className="event-meta">
                        {event.date} • {event.time}
                    </p>
                </div>
                <div className="event-icon-data">
                    <img src="/location.png" className="event-icon" alt="Location Icon" />
                    <p className="event-meta">
                        {event.location}
                    </p>
                </div>

                <div className="event-capacity">
                    <div className="event-icon-data">
                        <img src="/users.png" className="event-icon" alt="Capacity Icon" />
                        <span>
                            {event.attendees.length}/{event.capacity}
                        </span>
                    </div>

                    <div className="capacity-bar">
                        <div
                            className={`capacity-fill ${isFull ? 'full' : ''}`}
                            style={{
                                width: `${(event.attendees.length / event.capacity) * 100}%`
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div className="event-footer">
                <div className="event-logo-text-group">
                    <img src={event.host?.profileImage || `https://ui-avatars.com/api/?name=${event.host?.name || 'Unknown Host'}&background=random`} alt={event.host?.name || 'Unknown Host'} className="logo-icon-event-card" />
                    <span className="event-host">
                        {event.host?.name || 'Unknown Host'}
                    </span>
                </div>

                {isHost ? (
                    <div className="host-action-buttons">
                        <button
                            className="btn-secondary-event"
                            onClick={() => setShowAttendees(true)}
                        >
                            Attendees
                        </button>

                        <button
                            className="btn-secondary-event"
                            onClick={() => onEdit && onEdit(event)}
                        >
                            Edit Event
                        </button>
                    </div>
                ) : !auth.user ? (
                    isFull ? (
                        <button className="btn-disabled-event" disabled>
                            Full
                        </button>
                    ) : (
                        <button
                            className="btn-primary-event"
                            onClick={handleLoginRedirect}
                        >
                            Login to Join
                        </button>
                    )
                ) : isAttending ? (
                    <button className="btn-secondary-event" onClick={leaveEvent}>
                        Leave Event
                    </button>
                ) : isFull ? (
                    <button className="btn-disabled-event" disabled>
                        Full
                    </button>
                ) : (
                    <button className="btn-primary-event" onClick={joinEvent}>
                        Join · {spotsLeft} left
                    </button>
                )}
            </div>
            {showAttendees && (
                <AttendeesModal
                    attendees={event.attendees}
                    onClose={() => setShowAttendees(false)}
                />
            )}
        </article>
    );
};

export default EventCard;