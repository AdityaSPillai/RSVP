import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import '../styles/CreateEvent.css'; // Reuse CreateEvent styles
import '../styles/LoginModal.css'; // Reuse some modal styles

const EditEventModal = ({ event, onClose, onUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(event.image);

    const [formData, setFormData] = useState({
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        category: event.category,
        capacity: event.capacity,
        image: null,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file });
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const eventData = new FormData();
            eventData.append("title", formData.title);
            eventData.append("description", formData.description);
            eventData.append("date", formData.date);
            eventData.append("time", formData.time);
            eventData.append("location", formData.location);
            eventData.append("category", formData.category);
            eventData.append("capacity", formData.capacity);
            if (formData.image) {
                eventData.append("image", formData.image);
            }

            const { data } = await api.put(`/event/update/${event._id}`, eventData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (data?.success) {
                onUpdate();
                onClose();
            }
        } catch (error) {
            console.error("Error updating event:", error);
            alert("Failed to update event");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-modal-overlay" onClick={onClose}>
            <div
                className="login-modal-content"
                onClick={e => e.stopPropagation()}
                style={{ maxWidth: '600px', width: '90%' }}
            >
                <div className="modal-scroll-content">
                    <div className="create-event-header">
                        <h1 className="create-event-title">Edit Event</h1>
                        <p className="create-event-subtitle">Update your event details</p>
                    </div>

                    <form onSubmit={handleSubmit} className="create-event-form">
                        <div className="form-group">
                            <label htmlFor="title">Event Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="3"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group half">
                                <label htmlFor="date">Date</label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group half">
                                <label htmlFor="time">Time</label>
                                <input
                                    type="time"
                                    id="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="location">Location</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group half">
                                <label htmlFor="category">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option value="Conference">Conference</option>
                                    <option value="Workshop">Workshop</option>
                                    <option value="Meetup">Meetup</option>
                                    <option value="Party">Party</option>
                                    <option value="Concert">Concert</option>
                                    <option value="Sports">Sports</option>
                                </select>
                            </div>
                            <div className="form-group half">
                                <label htmlFor="capacity">Capacity</label>
                                <input
                                    type="number"
                                    id="capacity"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="image">Event Image</label>
                            <input
                                type="file"
                                id="image"
                                name="image"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="file-input"
                            />
                            {imagePreview && (
                                <div className="image-preview-container" style={{ maxHeight: '150px', overflow: 'hidden', borderRadius: '10px', marginTop: '10px' }}>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="image-preview"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="form-actions">
                            <button type="button" onClick={onClose} className="btn-secondary">
                                Cancel
                            </button>
                            <button type="submit" className="btn-submit btn-primary" disabled={loading}>
                                {loading ? 'Updating...' : 'Update Event'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditEventModal;
