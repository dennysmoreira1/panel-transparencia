// src/components/ModalArchivosObra.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { X } from 'lucide-react';

export default function ModalArchivosObra({ obra, onClose }) {
    const { token } = useAuth();
    const [archivos, setArchivos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchArchivos = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/obras/${obra.id}/archivos`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setArchivos(response.data);
            } catch (err) {
                setError('Error al cargar los archivos.');
            } finally {
                setLoading(false);
            }
        };

        if (obra?.id) {
            fetchArchivos();
        }
    }, [obra, token]);

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl relative p-6">
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
                    onClick={onClose}
                >
                    <X className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-bold mb-4">
                    Archivos de la obra: <span className="text-blue-600">{obra.nombre}</span>
                </h2>

                {loading ? (
                    <p>Cargando archivos...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : archivos.length === 0 ? (
                    <p>No hay archivos disponibles.</p>
                ) : (
                    <ul className="space-y-2">
                        {archivos.map((archivo) => (
                            <li key={archivo.id} className="border p-3 rounded flex justify-between items-center">
                                <span>{archivo.nombre}</span>
                                <a
                                    href={archivo.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    Descargar
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
