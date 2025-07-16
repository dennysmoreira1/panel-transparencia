import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchPerfil = useCallback(async (token) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/perfil`, {
                headers: { Authorization: `Bearer ${token}` },
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Error al obtener perfil');

            const data = await res.json();
            setUser(data.user);
        } catch (err) {
            console.error('Error al obtener perfil de usuario:', err);
            setUser(null);
        }
    }, []);

    const login = useCallback(async (email, password) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) return { success: false, msg: data.msg || 'Login fallido' };

            setAccessToken(data.accessToken);
            await fetchPerfil(data.accessToken);

            return { success: true };
        } catch (err) {
            console.error("Error en login:", err);
            return { success: false, msg: 'Error de red o del servidor' };
        }
    }, [fetchPerfil]);

    const logout = useCallback(async () => {
        try {
            await fetch(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (err) {
            console.error("Error al cerrar sesión", err);
        } finally {
            setAccessToken(null);
            setUser(null);
            navigate('/login');
        }
    }, [navigate]);

    const refreshAccessToken = useCallback(async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
            });

            const data = await res.json();
            if (res.ok) {
                setAccessToken(data.accessToken);
                await fetchPerfil(data.accessToken);
                return data.accessToken;
            } else {
                setAccessToken(null);
                setUser(null);
                return null;
            }
        } catch (err) {
            console.error('Error al renovar token', err);
            setAccessToken(null);
            setUser(null);
            return null;
        }
    }, [fetchPerfil]);

    useEffect(() => {
        refreshAccessToken().finally(() => setLoading(false));
    }, [refreshAccessToken]);

    // Memoizar valores calculados para evitar re-renders innecesarios
    const contextValue = useMemo(() => ({
        accessToken,
        user,
        login,
        logout,
        refreshAccessToken,
        loading,
        isAuthenticated: !!accessToken && !!user,
        isAdmin: user?.rol === 'admin',
        isEditor: user?.rol === 'editor',
        isLector: user?.rol === 'lector',
    }), [accessToken, user, login, logout, refreshAccessToken, loading]);

    return (
        <AuthContext.Provider value={contextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

// Hook personalizado para fetch con manejo de token expirado
export const useAuthFetch = () => {
    const { accessToken, refreshAccessToken, logout } = useAuth();

    const authFetch = useCallback(async (url, options = {}) => {
        const makeRequest = async (token) => {
            return fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${token}`,
                },
                credentials: 'include',
            });
        };

        let res = await makeRequest(accessToken);

        if (res.status === 401) {
            const newToken = await refreshAccessToken();
            if (newToken) {
                res = await makeRequest(newToken);
            } else {
                logout();
                throw new Error("No autorizado, sesión expirada");
            }
        }

        return res;
    }, [accessToken, refreshAccessToken, logout]);

    return authFetch;
};
