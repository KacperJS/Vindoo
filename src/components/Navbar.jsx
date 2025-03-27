import React from 'react';
import { useLocation } from 'react-router-dom';
import './Navbar.scss';

const Navbar = ({ toggleSidebar }) => {
    const location = useLocation();
    const showNavbar = location.pathname !== '/' && location.pathname !== '/signup';

    if (!showNavbar) {
        return null;
    }

    return (
        <nav className="navbar">
            <button className="hamburger" onClick={toggleSidebar}>
                ☰
            </button>
        </nav>
    );
};

export default Navbar;
