import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import '../styles/Layout.css';

const Layout = () => {
    return (
        <div className="app-layout">
            <Navbar />
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;