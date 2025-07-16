// src/pages/Unauthorized.jsx
export default function Unauthorized() {
    return (
        <div className="p-10 text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">403 - Acceso no autorizado</h1>
            <p className="text-gray-700">No tienes permiso para acceder a esta página.</p>
        </div>
    );
}
