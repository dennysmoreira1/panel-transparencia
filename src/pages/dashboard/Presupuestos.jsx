import { useEffect, useState } from 'react';

export default function Presupuestos() {
    const [presupuestos, setPresupuestos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setPresupuestos([
                { anio: 2023, monto: 1200000, ejecutado: 900000 },
                { anio: 2024, monto: 1500000, ejecutado: 400000 },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Módulo de Presupuestos</h1>
            <p className="text-gray-600">Consulta y gestiona los presupuestos anuales.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {presupuestos.map(p => (
                    <div key={p.anio} className="bg-blue-100 p-6 rounded shadow">
                        <p className="text-sm">Presupuesto {p.anio}</p>
                        <h3 className="text-xl font-bold">${p.monto.toLocaleString()}</h3>
                        <p className="text-green-700">Ejecutado: ${p.ejecutado.toLocaleString()}</p>
                    </div>
                ))}
            </div>
            <div className="bg-white p-6 rounded shadow mt-6">
                <h2 className="text-lg font-semibold mb-2">Detalle de Presupuestos</h2>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left">Año</th>
                            <th className="px-4 py-2 text-left">Monto</th>
                            <th className="px-4 py-2 text-left">Ejecutado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={3} className="text-center py-4">Cargando...</td></tr>
                        ) : presupuestos.map(p => (
                            <tr key={p.anio} className="hover:bg-gray-50">
                                <td className="px-4 py-2">{p.anio}</td>
                                <td className="px-4 py-2">${p.monto.toLocaleString()}</td>
                                <td className="px-4 py-2">${p.ejecutado.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
