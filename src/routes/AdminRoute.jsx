// src/routes/AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
    const { authData } = useAuth();

    // Si no está autenticado o no es admin, redirige al dashboard
    if (!authData || authData.rol !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
