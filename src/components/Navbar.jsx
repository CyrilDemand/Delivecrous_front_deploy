import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import logo from '../ressources/logo.png';

const Navbar = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('http://localhost:3001/user/info', {withCredentials:true}); // Adjust the URL as needed
                setUserInfo(response.data);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo();
    }, []);

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <nav className="bg-blue-500 text-white p-4 flex flex-row justify-between items-center">
            <div className='flex flex-row'>
                <img src={logo} alt='logo' className='h-[40px] w-auto'/>
                <h1 className="text-3xl font-bold ml-3">CodePulse</h1>
            </div>

            {userInfo && (
                <div className='flex flex-row items-center'>
                    <div className='flex flex-col items-end'>
                        <span className='font-bold'>{`Logged as ${userInfo.name}`}</span>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                    <img src={userInfo.picture} alt="Avatar" className="w-10 h-10 rounded-full ml-3" />
                </div>
            )}


        </nav>
    );
};

export default Navbar;