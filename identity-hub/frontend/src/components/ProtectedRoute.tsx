import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles }) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" replace />; // Or unauthorized page
    }

    return <Outlet />;
};

export default ProtectedRoute;
