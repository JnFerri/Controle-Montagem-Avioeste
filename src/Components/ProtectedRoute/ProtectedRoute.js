import React from 'react';
import {useNavigate} from 'react-router-dom';

const ProtectedRoute = ({ component: Component, isAuthenticated, ...rest }) => {
    const navigate = useNavigate();


    const handleRetornaLogin = () => {
            navigate('/');
    };
    return (
                isAuthenticated ? <Component {...rest} /> : handleRetornaLogin()
        );
        
};

export default ProtectedRoute;