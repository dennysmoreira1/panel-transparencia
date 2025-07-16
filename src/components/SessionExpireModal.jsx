// src/components/SessionExpireModal.jsx
import React from 'react';

export default function SessionExpireModal({ visible, onStayLoggedIn, onLogout }) {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    ⚠️ Tu sesión está por expirar
                </h2>
                <p className="text-gray-600 mb-6">
                    ¿Deseas mantenerla activa?
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onLogout}
                        className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                    >
                        Cerrar sesión
                    </button>
                    <button
                        onClick={onStayLoggedIn}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Mantener sesión
                    </button>
                </div>
            </div>
        </div>
    );
}
