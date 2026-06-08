import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

const StudentRoute = ({ children }) => {
    const { user, loading } = useAppContext();

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (!user || user.type !== 'student') {
        return <Navigate to="/student-login" replace />;
    }

    return children;
};

export default StudentRoute;
