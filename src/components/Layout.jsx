import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import {Outlet} from 'react-router-dom';
import withAuthProtection from "../contexts/AuthProtection";

const Layout = () => {
    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-grow">
                <Sidebar />
                <div className="flex-grow">
                    <Outlet /> {/* Ceci rendra le composant enfant correspondant */}
                </div>
            </div>
        </div>
    );
};

export default withAuthProtection(Layout);
