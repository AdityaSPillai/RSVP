import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {
    return (
        <div className="landing-container">
            <span className="landing-badge">
                <img src="/star.png" alt="Stars" className="landing-icon" />
                Your next event awaits
            </span>

            <h1 className="landing-title">
                Discover, Create & <br />
                <span className="text-gradient">Join Amazing Events</span>
            </h1>

            <p className="landing-description">
                The modern platform for discovering local events, connecting with your community, and hosting unforgettable experiences.
            </p>

            <div className="landing-actions">
                <Link to="/discover" className="btn-primary">
                    Browse Events
                    <img src="/right.png" alt="Arrow Right" className="landing-icon" />
                </Link>
                <Link to="/signup" className="btn-secondary">
                    Get Started Free
                </Link>
            </div>

            {/* Dynamic background elements */}
            <div className="blob blob-purple"></div>
            <div className="blob blob-blue"></div>
        </div>
    );
};

export default LandingPage;
