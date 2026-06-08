import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

const FacultyRoute = ({ children }) => {
    const { user, loading } = useAppContext();

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (!user || user.type !== 'faculty') {
        return <Navigate to="/faculty-login" replace />;
    }

    return children;
};

export default FacultyRoute;
