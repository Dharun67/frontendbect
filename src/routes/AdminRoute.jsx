import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAppContext();

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (!user || user.type !== 'admin') {
        return <Navigate to="/admin-login" replace />;
    }

    return children;
};

export default AdminRoute;
