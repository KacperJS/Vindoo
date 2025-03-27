import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.scss';

const Sidebar = ({ toggleSidebar, sidebarOpen }) => {
    return (
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            <button className="close-button" onClick={toggleSidebar}>✖</button>
            <h2>Menu</h2>
            <ul>
                <li><Link to="/home" onClick={toggleSidebar}>Home</Link></li>
                <li><Link to="/task-management" onClick={toggleSidebar}>Zarządzanie Zadaniami</Link></li>
                <li><Link to="/contacts-management" onClick={toggleSidebar}>Zarządzanie Kontaktami</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
