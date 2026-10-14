import React from 'react'
import { useAuth } from '../../store/auth';
import { Navigate, } from 'react-router-dom';

export default function UserProtectedRoutes({children}) {
    const { token } = useAuth();

    // If no token, redirect to login
    if (!token) {
        return <Navigate to="/" replace />;
    }
    return children;

}
