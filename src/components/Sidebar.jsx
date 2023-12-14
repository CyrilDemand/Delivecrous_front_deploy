import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // make sure to install axios if not already installed

const Sidebar = () => {
    const [repositories, setRepositories] = useState([]);

    useEffect(() => {
        // Fetch repositories when the component mounts
        const fetchRepositories = async () => {
            try {
                const response = await axios.get('http://localhost:3001/repositories');
                setRepositories(response.data);
            } catch (error) {
                console.error('Error fetching repositories:', error);
            }
        };

        fetchRepositories();
    }, []); // Empty dependency array means this effect runs once on mount

    return (
        <aside className="w-64 bg-gray-200 p-4">
            <ul>
                {repositories.map(repo => (
                    <li key={repo._id}>
                        <Link to={`/pipelines/${repo._id}`}>{repo.name}</Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

export default Sidebar;