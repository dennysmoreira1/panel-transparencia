import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
            <span className="font-semibold">Panel de Transparencia</span>
            <div className="flex items-center space-x-4">
                {user && <span className="text-sm">Hola, {user.username}</span>}
                <button onClick={logout} className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-500">
                    Cerrar sesión
                </button>
            </div>
        </nav>
    );
}
