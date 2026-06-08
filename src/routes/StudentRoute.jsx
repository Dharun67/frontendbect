import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

const StudentRoute = ({ children }) => {
    const { sessionUser, sessionType, loading } = useApp();

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (!sessionUser || sessionType !== 'student') {
        return <Navigate to="/student-login" replace />;
    }

    return children;
};

export default StudentRoute;
