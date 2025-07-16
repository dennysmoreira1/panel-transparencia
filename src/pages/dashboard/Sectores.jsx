import React, { useEffect, useState } from 'react';
import { useAuthFetch } from '../../context/AuthContext';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';

const Sectores = () => {
    const authFetch = useAuthFetch();
    const [sectores, setSectores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [paginaActual, setPaginaActual] = useState(1);
    const sectoresPorPagina = 5;

    useEffect(() => {
        const fetchSectores = async () => {
            try {
                setLoading(true);
                const res = await authFetch('http://localhost:5000/api/sectores');
                const data = await res.json();
                setSectores(Array.isArray(data) ? data : []);
                setError(null);
            } catch (err) {
                setError('Error al obtener los sectores.');
            } finally {
                setLoading(false);
            }
        };

        fetchSectores();
    }, [authFetch]);

    const totalPaginas = Math.ceil(sectores.length / sectoresPorPagina);
    const indiceInicio = (paginaActual - 1) * sectoresPorPagina;
    const sectoresPaginados = sectores.slice(indiceInicio, indiceInicio + sectoresPorPagina);

    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            setPaginaActual(nuevaPagina);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Listado de Sectores</h2>

            {loading ? (
                <p>Cargando sectores...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <>
                    <table className="w-full border mb-4">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2">Nombre</th>
                                <th className="border px-4 py-2">Número de Obras</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sectoresPaginados.map((sector, idx) => (
                                <tr key={idx}>
                                    <td className="border px-4 py-2">{sector.nombre}</td>
                                    <td className="border px-4 py-2">{sector.numeroObras ?? 0}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-center items-center gap-2 mb-6">
                        <button
                            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                            onClick={() => cambiarPagina(paginaActual - 1)}
                            disabled={paginaActual === 1}
                        >
                            Anterior
                        </button>
                        <span>
                            Página {paginaActual} de {totalPaginas}
                        </span>
                        <button
                            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                            onClick={() => cambiarPagina(paginaActual + 1)}
                            disabled={paginaActual === totalPaginas}
                        >
                            Siguiente
                        </button>
                    </div>

                    <h3 className="text-xl font-semibold mb-2">Obras por Sector</h3>
                    <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sectores} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="nombre" type="category" />
                                <Tooltip />
                                <Bar dataKey="numeroObras" fill="#10b981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </div>
    );
};

export default Sectores;
