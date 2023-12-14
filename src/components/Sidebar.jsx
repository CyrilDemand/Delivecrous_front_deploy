import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    return (
        <aside className="w-64 bg-gray-200 p-4">
            <ul>
                <li><Link to="/pipelines/52941398">Projet Back</Link></li>
            </ul>
        </aside>
    );
};

export default Sidebar;