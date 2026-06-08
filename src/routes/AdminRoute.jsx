import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

const AdminRoute = ({ children }) => {
    const { sessionUser, sessionType, loading } = useApp();

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (!sessionUser || sessionType !== 'admin') {
        return <Navigate to="/admin-login" replace />;
    }

    return children;
};

export default AdminRoute;
