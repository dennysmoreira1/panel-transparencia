import { useAuth } from '../context/AuthContext';

export const fetchConToken = async (url, options = {}, auth) => {
    let token = auth.accessToken;

    // Agregar encabezado Authorization
    const config = {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            'Content-Type': options.body ? 'application/json' : undefined,
        },
        credentials: 'include', // para enviar cookies del refreshToken si es necesario
    };

    let response = await fetch(url, config);

    if (response.status === 401) {
        // Intentar renovar el token
        const nuevoToken = await auth.refreshAccessToken();

        if (!nuevoToken) {
            auth.logout(); // Si no se pudo renovar, cerrar sesión
            throw new Error('Sesión expirada. Por favor vuelve a iniciar sesión.');
        }

        // Reintentar la petición con el nuevo token
        config.headers.Authorization = `Bearer ${nuevoToken}`;
        response = await fetch(url, config);
    }

    return response;
};
