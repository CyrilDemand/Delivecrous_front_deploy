import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import RepositoryPopup from "./RepositoryPopup";

const Sidebar = () => {
    const [repositories, setRepositories] = useState([]);

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

    const navigate = useNavigate();

    const fetchRepositories = async () => {
        try {
            const response = await axios.get('http://localhost:3001/repositories', { withCredentials: true });
            setRepositories(response.data);
        } catch (error) {
            console.error('Error fetching repositories:', error);
        }
    };

    useEffect(() => {
        fetchRepositories();
    }, [repositories]);
    const handleButtonClick = async () => {
        try {
            const response = await axios.get('http://localhost:3001/user/repositories', {withCredentials: true});
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    const popupSuccessCallback = (repoId) => {
        fetchRepositories();
        navigate(`/repository/${repoId}`)
    }

    return (
        <aside className="w-64 bg-gray-200">

            <ul className='w-full'>
                {repositories.map(repo => (
                    <Link to={`/repository/${repo._id}`} key={repo._id} className='block text-lg font-bold p-2 shadow hover:bg-gray-100 transition rounded'>
                        <li className='w-full'>
                            {repo.name}
                        </li>
                    </Link>
                ))}
            </ul>

            <button
                onClick={openPopup}
                className="mt-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full"
            >
                Add Repository
            </button>

            <RepositoryPopup isOpen={isPopupOpen} onClose={closePopup} onSuccess={popupSuccessCallback}/>
        </aside>
    );
};

export default Sidebar;