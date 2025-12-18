import React from 'react';
import { useState, useRef, useEffect } from 'react';
import UserDropdown from './UserDropdown';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <div className="logo-icon">
                        <img src="/rsvpb.png" alt="Logo" className="logo-icons" />
                    </div>
                    <span>Eventify</span>
                </Link>

                <div className="nav-actions">
                    {auth.user ? (
                        <>
                            <Link to="/create-event" className="btn-create">
                                <img src="/plusw.png" alt="Plus" className="btn-create-logo" />
                                <span className="btn-create-text">Create Event</span>
                            </Link>
                            <div className="user-menu" ref={dropdownRef}>
                                <button
                                    className="user-avatar-btn"
                                    onClick={() => setOpen(prev => !prev)}
                                >
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${auth.user.name}&background=random`}
                                        alt={auth.user.name}
                                    />
                                </button>

                                {open && (
                                    <UserDropdown
                                        userName={auth.user.name}
                                        userEmail={auth.user.email}
                                        onLogout={handleLogout}
                                        onClose={() => setOpen(false)}
                                    />
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="nav-auth-buttons">
                            <Link to="/login" className="login-glow-btn">
                                <div className="login-glow-inner">
                                    <img src="/user.png" alt="User" />
                                    <span>Log In</span>
                                </div>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;