import React, { useState } from 'react';
import {useLocation} from "react-router-dom";
import { FaGithub } from "react-icons/fa";

const Login = () => {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const redirectParam = searchParams.get('redirect');
    const handleGitHubLogin = () => {
        if (redirectParam) {
            window.location.href = `http://localhost:3001/auth/github?redirect=${encodeURIComponent(redirectParam)}`;
        } else {
            window.location.href = 'http://localhost:3001/auth/github';
        }
    };

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center bg-blue-500">
            <div className="max-w-sm bg-white shadow-xl px-20 py-10">
                <h1 className="font-bold text-3xl">Log In : </h1>

                <div className="mb-4 text-center mt-10">
                    <button onClick={handleGitHubLogin} className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        <FaGithub className="inline-block mr-2"/>
                        Login with GitHub
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;