import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

const ProtectedRoute = ({ element: Element }) => {
    return isAuthenticated() ? <Element /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
