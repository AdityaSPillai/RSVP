import { useState } from 'react';
import '../styles/Dashboard.css';
import MyEventsTab from '../components/dashboard/MyEventsTab';
import AttendingTab from '../components/dashboard/AttendingTab';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('my-events');

    return (
        <div className="owner-dashboard">
            <div className="dashboard-layout">

                {/* LEFT SIDEBAR */}
                <div className="sidebar-tabs">
                    <button
                        className={`sidebar-tab ${activeTab === 'my-events' ? 'active' : ''}`}
                        onClick={() => setActiveTab('my-events')}
                    >
                        My Events
                    </button>

                    <button
                        className={`sidebar-tab ${activeTab === 'attending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('attending')}
                    >
                        Attending
                    </button>
                </div>

                {/* RIGHT CONTENT */}
                <div className="main-content-area">
                    {activeTab === 'my-events' && <MyEventsTab />}
                    {activeTab === 'attending' && <AttendingTab />}
                </div>

            </div>
        </div>
    );
};

export default Dashboard;