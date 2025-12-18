import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import '../styles/EventCard.css';

const EventCard = ({ event, refresh, onEdit }) => {
    const { auth } = useAuth();
    const navigate = useNavigate();

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
    const spotsLeft = event.capacity - event.attendees.length;

    const joinEvent = async () => {
        await api.put(`/event/join/${event._id}`);
        refresh();
    };

    const leaveEvent = async () => {
        await api.put(`/event/leave/${event._id}`);
        refresh();
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

                <span className="event-badge category">
                    {event.category}
                </span>

                {isFull && !isAttending && (
                    <span className="event-badge sold-out">
                        Sold Out
                    </span>
                )}
            </div>

            {/* CONTENT */}
            <div className="event-card-body">
                <h3 className="event-title">{event.title}</h3>

                <p className="event-meta">
                    {event.date} • {event.time}
                </p>

                <p className="event-location">{event.location}</p>

                <div className="event-capacity">
                    <span>
                        {event.attendees.length}/{event.capacity}
                    </span>

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
                    <img src={`https://ui-avatars.com/api/?name=${event.host?.name || 'Unknown Host'}&background=random`} alt={event.host?.name || 'Unknown Host'} className="logo-icon-event-card" />
                    <span className="event-host">
                        {event.host?.name || 'Unknown Host'}
                    </span>
                </div>

                {isHost ? (
                    <button className="btn-secondary-event" onClick={() => onEdit && onEdit(event)}>
                        Edit Event
                    </button>
                ) : (
                    <>
                        {isAttending ? (
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
                    </>
                )}
            </div>
        </article>
    );
};

export default EventCard;