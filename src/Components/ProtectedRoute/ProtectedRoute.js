import React, { useEffect } from 'react';
import {useNavigate} from 'react-router-dom';

const ProtectedRoute = ({ component: Component, isAuthenticated, ...rest }) => {
    const navigate = useNavigate();


        
    function RetornaLogin(){
            useEffect(() => {
                    
                            navigate('/');
                    
            }, [])

    }

    return (
                isAuthenticated ? <Component {...rest} /> : RetornaLogin()
        );
        
};

export default ProtectedRoute;