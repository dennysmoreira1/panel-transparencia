import axios from 'axios';

// Usar la URL que está en tus variables de entorno, si está configurada
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Crea una instancia de Axios con configuración global
const instance = axios.create({
    baseURL: API_URL,  // URL base de tu API
    headers: {
        'Content-Type': 'application/json', // Especifica el tipo de contenido
    },
    withCredentials: true,  // Si usas cookies con CORS, habilítalo
});

export default instance;
