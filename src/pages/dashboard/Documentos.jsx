import { useEffect, useState } from 'react';

export default function Documentos() {
    const [documentos, setDocumentos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setDocumentos([
                { id: 'DOC-001', nombre: 'PlanoObra1.pdf', obra: 'Escuela Primaria', fecha: '2024-04-01' },
                { id: 'DOC-002', nombre: 'ContratoHospital.pdf', obra: 'Hospital Central', fecha: '2024-03-15' },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Gestión de Documentos</h1>
            <p className="text-gray-600">Consulta y administra los documentos asociados a las obras y contratos.</p>
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-lg font-semibold mb-2">Documentos recientes</h2>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left">ID</th>
                            <th className="px-4 py-2 text-left">Nombre</th>
                            <th className="px-4 py-2 text-left">Obra</th>
                            <th className="px-4 py-2 text-left">Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} className="text-center py-4">Cargando...</td></tr>
                        ) : documentos.map(d => (
                            <tr key={d.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2">{d.id}</td>
                                <td className="px-4 py-2">{d.nombre}</td>
                                <td className="px-4 py-2">{d.obra}</td>
                                <td className="px-4 py-2">{d.fecha}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
