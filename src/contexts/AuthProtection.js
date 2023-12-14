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
                const pathname = location.pathname;
                const lastSegment = pathname.substring(pathname.lastIndexOf('/') + 1);
                //TODO : spliter correctement l'url (pas seulement après le dernier slash) et verifier que tout marche jusqu'a la fin

                navigate('/login?redirect=' + lastSegment, { replace: true });
            }
        }, [isAuthenticated, isLoading, navigate]);

        return <WrappedComponent {...props} />;
    };
};

export default withAuthProtection;