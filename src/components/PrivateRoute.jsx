import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, requiredRole = null }) {
    const { accessToken, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!accessToken || !user) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole) {
        const rolesPermitidos = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        if (!rolesPermitidos.includes(user.rol)) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return children ? children : <Outlet />;
}
