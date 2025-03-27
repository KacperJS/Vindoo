import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import Login from './components/Login';
import Register from './components/Register';
import TaskManagement from './components/TaskManagement';
import ContactsManagement from './components/ContactsManagement';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import 'leaflet/dist/leaflet.css';

const App = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <Router>
            <Navbar toggleSidebar={toggleSidebar} />
            <Sidebar toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Register />} />
                <Route path="/home" element={<Dashboard toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />} />
                <Route path="/task-management" element={<TaskManagement />} />
                <Route path="/contacts-management" element={<ContactsManagement />} />
            </Routes>
        </Router>
    );
};

export default App;
