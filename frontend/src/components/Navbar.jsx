import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <div className="logo-icon">
                        <img src="/calendarw.png" alt="Calendar" className="logo-icon w" />
                    </div>
                    <span>Eventify</span>
                </Link>

                <div className="nav-actions">
                    <div className="nav-links">
                        <Link to="/discover" className="nav-item">Discover</Link>
                        {auth.user && <Link to="/my-events" className="nav-item">My Events</Link>}
                    </div>

                    {auth.user ? (
                        <>
                            <Link to="/create-event" className="btn-create">
                                <img src="/plus.png" alt="Plus" className="btn-create-logo" />
                                Create Event
                            </Link>
                            <div className="user-menu">
                                <div className="user-avatar">
                                    <img src={`https://ui-avatars.com/api/?name=${auth.user.name}&background=random`} alt={auth.user.name} />
                                </div>
                                <button onClick={handleLogout} className="btn-logout">
                                    Sign out
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="btn-login">Log in</Link>
                            <Link to="/signup" className="btn-signup">Sign up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
