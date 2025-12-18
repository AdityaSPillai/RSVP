import { createPortal } from 'react-dom';
import '../styles/AttendeesModal.css';

const AttendeesModal = ({ attendees, onClose }) => {
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);

        return new Intl.DateTimeFormat('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(date);
    };
    return createPortal(
        <div className="modal-backdrop" onClick={onClose}>
            <div
                className="modal-container"
                onClick={(e) => e.stopPropagation()} // prevent close on inner click
            >
                <div className="modal-header">
                    <h3>Event Attendees</h3>
                    <button className="modal-close-btn" onClick={onClose}>✕</button>
                </div>

                {attendees.length === 0 ? (
                    <p className="empty-attendees">No attendees yet.</p>
                ) : (
                    <table className="attendees-table">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Joined At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendees
                                .sort((a, b) => a.serialNumber - b.serialNumber)
                                .map(attendee => (
                                    <tr key={attendee._id}>
                                        <td>{attendee.serialNumber}</td>
                                        <td>{attendee.name}</td>
                                        <td>{attendee.mail}</td>
                                        <td className="joined-at">
                                            {formatDateTime(attendee.joinedAt)}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>,
        document.body
    );
};

export default AttendeesModal;