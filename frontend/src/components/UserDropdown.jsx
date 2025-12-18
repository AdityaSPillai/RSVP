import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import '../styles/UserDropdown.css';

const UserDropdown = ({ userName, userEmail, onLogout, onClose }) => {
    const location = useLocation();
    return (
        <div className="user-dropdown">

            {/* Username (text only) */}
            <div className="dropdown-user">
                <img
                    className="dropdown-avatar"
                    src={`https://ui-avatars.com/api/?name=${userName}&background=random`}
                    alt={userName}
                />
                <div className="dropdown-user-info">
                    <div className="dropdown-name">{userName}</div>
                    <div className="dropdown-email">{userEmail}</div>
                </div>
            </div>

            <div className="dropdown-divider" />

            <Link to="/discover" className="dropdown-item" onClick={onClose}>
                <img src="/find.png" alt="Discover" />
                <span>Discover</span>
            </Link>

            <Link to="/profile" className="dropdown-item" onClick={onClose}>
                <img src="/user.png" alt="Profile" />
                <span>Profile</span>
            </Link>

            <Link to="/dashboard" className="dropdown-item" onClick={onClose}>
                <img src="/dashboard.png" alt="Dashboard" />
                <span>Dashboard</span>
            </Link>

            <div className="dropdown-divider" />

            <button className="dropdown-item logout" onClick={() => { onClose(); onLogout() }}>
                <img src="/logout.png" alt="Logout" />
                Sign Out
            </button>
        </div>
    );
};

export default UserDropdown;