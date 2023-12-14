import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');
    }


    return (
        <nav className="bg-blue-500 text-white p-4">
            <h1 className="text-lg font-bold">CodePulse</h1>
            <a onClick={handleLogout}>Logout</a>
        </nav>
    );
};

export default Navbar;