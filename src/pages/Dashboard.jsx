import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-3xl font-bold">Bienvenido al Panel de Transparencia</h1>
                    {user && (
                        <p className="text-gray-700 text-lg mt-1">
                            Sesión iniciada como <strong>{user.username || user.email}</strong>
                        </p>
                    )}
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Cerrar sesión
                </button>
            </div>
            <p className="text-gray-700 text-lg">
                Usa el menú de la izquierda para navegar entre los módulos de gestión de datos públicos.
            </p>
        </div>
    );
}
