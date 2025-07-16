import React, { useEffect, useState } from "react";
import useAuthFetch from "@/hooks/useAuthFetch";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, CartesianGrid, Legend,
} from "recharts";

const Estadisticas = () => {
    const authFetch = useAuthFetch();
    const [data, setData] = useState(null);

    useEffect(() => {
        const cargarEstadisticas = async () => {
            try {
                const res = await authFetch("/api/estadisticas");
                setData(res);
            } catch (err) {
                console.error("Error al obtener estadísticas", err);
            }
        };
        cargarEstadisticas();
    }, []);

    if (!data) return <p className="p-4">Cargando estadísticas...</p>;

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-bold">Estadísticas Generales</h1>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl shadow text-center">
                    <h2 className="text-lg font-medium">Total Obras</h2>
                    <p className="text-3xl font-bold">{data.totalObras}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow text-center">
                    <h2 className="text-lg font-medium">Total Usuarios</h2>
                    <p className="text-3xl font-bold">{data.totalUsuarios}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow text-center">
                    <h2 className="text-lg font-medium">Total Sectores</h2>
                    <p className="text-3xl font-bold">{data.totalSectores}</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4">Obras por Estado</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.obrasPorEstado}>
                        <XAxis dataKey="estado" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="cantidad" fill="#4f46e5" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4">Obras por Mes</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.obrasPorMes}>
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Line type="monotone" dataKey="cantidad" stroke="#10b981" />
                        <Legend />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Estadisticas;
