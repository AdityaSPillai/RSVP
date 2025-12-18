import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../styles/CreateEvent.css';

const CreateEvent = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: 'Conference',
        capacity: 50
    });

    const [imageFile, setImageFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > MAX_IMAGE_SIZE) {
            alert('File size too big. Maximum allowed size is 5 MB.');
            e.target.value = ''; // reset file input
            setImageFile(null);
            return;
        }

        setImageFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = new FormData();

            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('date', formData.date);
            data.append('time', formData.time);
            data.append('location', formData.location);
            data.append('category', formData.category);
            data.append('capacity', formData.capacity);

            if (imageFile) {
                data.append('image', imageFile);
            }

            const res = await api.post('/event/create', data);

            if (res.data.success) {
                navigate('/discover');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-event-wrapper">
            <div className="create-event-card">
                <header className="create-event-header">
                    <h1>Create Event</h1>
                    <p>Provide details below to publish your event</p>
                </header>

                <form onSubmit={handleSubmit} className="create-event-form">
                    {error && <div className="form-error">{error}</div>}

                    <div className="form-group">
                        <label>Event Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Event name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe your event"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Time</label>
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Event location"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option>Conference</option>
                                <option>Workshop</option>
                                <option>Meetup</option>
                                <option>Party</option>
                                <option>Sports</option>
                                <option>Music</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Capacity</label>
                            <input
                                type="number"
                                name="capacity"
                                min="1"
                                value={formData.capacity}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* IMAGE UPLOAD */}
                    <div className="form-group">
                        <label>Cover Image</label>

                        <div className="upload-box">
                            <input
                                type="file"
                                accept="image/*"
                                id="event-image"
                                onChange={handleImageChange}
                                hidden
                            />

                            <label htmlFor="event-image" className="upload-btn">
                                Upload Image
                            </label>

                            {imageFile && (
                                <span className="file-name">{imageFile.name}</span>
                            )}
                        </div>

                        <small className="upload-hint">
                            Max image size: 5 MB
                        </small>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => navigate('/discover')}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;