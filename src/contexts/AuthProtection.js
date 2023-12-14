// withAuthProtection.js
import React, { useContext, useEffect } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { AuthContext } from './AuthContext';

const withAuthProtection = (WrappedComponent) => {
    return (props) => {
        const { isAuthenticated, isLoading } = useContext(AuthContext);
        const navigate = useNavigate();
        const location = useLocation();


        useEffect(() => {
            if (!isLoading && !isAuthenticated) {
                const fullPath = location.pathname + location.search + location.hash;

                navigate('/login?redirect=' + encodeURIComponent(fullPath), { replace: true });
            }
        }, [isAuthenticated, isLoading, navigate, location]);


        if (!isAuthenticated || isLoading) {
            // You can render a loading indicator or null here
            return null;
        }

        return <WrappedComponent {...props} />;
    };
};

export default withAuthProtection;