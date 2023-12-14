// Login.js
import React, { useState } from 'react';
// Importez d'autres bibliothèques si nécessaire, par exemple pour la gestion des formulaires

const Login = () => {
    const handleGitHubLogin = () => {
        window.location.href = 'http://localhost:3001/auth/github';
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-sm">
                <div className="mb-4 text-center">
                    <button onClick={handleGitHubLogin} className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Se connecter avec GitHub
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;