import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

const FacultyRoute = ({ children }) => {
    const { sessionUser, sessionType, loading } = useApp();

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (!sessionUser || sessionType !== 'faculty') {
        return <Navigate to="/faculty-login" replace />;
    }

    return children;
};

export default FacultyRoute;
