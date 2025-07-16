// src/pages/Sectores.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';

const Sectores = () => {
    const { token } = useAuth();
    const [sectores, setSectores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [paginaActual, setPaginaActual] = useState(1);
    const sectoresPorPagina = 5;

    const [filtroNombre, setFiltroNombre] = useState('');

    useEffect(() => {
        const fetchSectores = async () => {
            try {
                setLoading(true);
                const res = await axios.get('/api/sectores', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSectores(res.data);
                setError(null);
            } catch (err) {
                setError('Error al obtener los sectores.');
            } finally {
                setLoading(false);
            }
        };

        fetchSectores();
    }, [token]);

    // Filtro por nombre
    const sectoresFiltrados = sectores.filter(sector =>
        sector.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
    );

    // Paginación
    const totalPaginas = Math.ceil(sectoresFiltrados.length / sectoresPorPagina);
    const indiceInicio = (paginaActual - 1) * sectoresPorPagina;
    const sectoresPaginados = sectoresFiltrados.slice(indiceInicio, indiceInicio + sectoresPorPagina);

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
                    {/* Filtro y Exportación */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Filtrar por nombre"
                            value={filtroNombre}
                            onChange={(e) => setFiltroNombre(e.target.value)}
                            className="border px-3 py-2 rounded w-full sm:w-1/3"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => exportToExcel(sectoresFiltrados, 'Sectores')}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Exportar Excel
                            </button>
                            <button
                                onClick={() => exportToPDF(sectoresFiltrados, 'Sectores', ['nombre', 'numeroObras'])}
                                className="bg-red-600 text-white px-4 py-2 rounded"
                            >
                                Exportar PDF
                            </button>
                        </div>
                    </div>

                    {/* Tabla */}
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
                                    <td className="border px-4 py-2">{sector.numeroObras}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Paginación */}
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

                    {/* Gráfica */}
                    <h3 className="text-xl font-semibold mb-2">Obras por Sector</h3>
                    <div className="w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sectoresFiltrados} layout="vertical" margin={{ left: 40 }}>
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
