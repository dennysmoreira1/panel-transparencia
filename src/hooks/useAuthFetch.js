import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function useAuthFetch() {
    const { token, refreshToken, logout } = useAuth();

    const api = axios.create({
        baseURL,
        withCredentials: true,
        headers: { Authorization: token ? `Bearer ${token}` : "" },
    });

    // Interceptor para refrescar token 401
    api.interceptors.response.use(
        (r) => r,
        async (error) => {
            if (error.response?.status === 401) {
                try {
                    await refreshToken();
                    error.config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
                    return api.request(error.config);
                } catch {
                    logout();
                }
            }
            return Promise.reject(error);
        }
    );

    return api;
}
