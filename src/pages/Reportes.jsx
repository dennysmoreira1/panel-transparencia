import React, { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Reportes() {
    const { user } = useAuth();
    const [reportes, setReportes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtro, setFiltro] = useState('');
    const [tipoReporte, setTipoReporte] = useState('obras');
    const [generando, setGenerando] = useState(false);

    // Datos de ejemplo para reportes
    const reportesEjemplo = [
        {
            id: 'RPT-001',
            tipo: 'Obras por Sector',
            fecha: '2025-01-15',
            estado: 'Completado',
            descripcion: 'Reporte de obras agrupadas por sector',
            descargas: 5,
            generadoPor: 'admin@transparencia.com'
        },
        {
            id: 'RPT-002',
            tipo: 'Presupuesto Anual',
            fecha: '2025-01-14',
            estado: 'Completado',
            descripcion: 'Análisis de presupuesto 2025',
            descargas: 3,
            generadoPor: 'admin@transparencia.com'
        },
        {
            id: 'RPT-003',
            tipo: 'Contratos Activos',
            fecha: '2025-01-13',
            estado: 'En Proceso',
            descripcion: 'Listado de contratos vigentes',
            descargas: 2,
            generadoPor: 'editor@transparencia.com'
        },
        {
            id: 'RPT-004',
            tipo: 'Estadísticas Generales',
            fecha: '2025-01-12',
            estado: 'Completado',
            descripcion: 'Métricas generales del sistema',
            descargas: 8,
            generadoPor: 'admin@transparencia.com'
        },
        {
            id: 'RPT-005',
            tipo: 'Usuarios del Sistema',
            fecha: '2025-01-11',
            estado: 'Completado',
            descripcion: 'Listado de usuarios registrados',
            descargas: 1,
            generadoPor: 'admin@transparencia.com'
        }
    ];

    useEffect(() => {
        // Simular carga de datos
        setTimeout(() => {
            setReportes(reportesEjemplo);
            setLoading(false);
        }, 1000);
    }, []);

    const generarReporte = async (tipo) => {
        setGenerando(true);
        try {
            // Simular generación de reporte
            await new Promise(resolve => setTimeout(resolve, 2000));

            const nuevoReporte = {
                id: `RPT-${Date.now()}`,
                tipo: tipo,
                fecha: new Date().toISOString().split('T')[0],
                estado: 'Completado',
                descripcion: `Reporte de ${tipo.toLowerCase()}`,
                descargas: 0,
                generadoPor: user?.email || 'admin@transparencia.com'
            };

            setReportes(prev => [nuevoReporte, ...prev]);

        } catch (error) {
            console.error('Error generando reporte:', error);
            setError('Error al generar el reporte');
        } finally {
            setGenerando(false);
        }
    };

    const exportarExcel = (reporte) => {
        const worksheet = XLSX.utils.json_to_sheet([reporte]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, `${reporte.id}.xlsx`);
    };

    const exportarPDF = (reporte) => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text(`Reporte: ${reporte.tipo}`, 20, 20);
        doc.setFontSize(12);
        doc.text(`ID: ${reporte.id}`, 20, 35);
        doc.text(`Fecha: ${reporte.fecha}`, 20, 45);
        doc.text(`Estado: ${reporte.estado}`, 20, 55);
        doc.text(`Descripción: ${reporte.descripcion}`, 20, 65);
        doc.text(`Generado por: ${reporte.generadoPor}`, 20, 75);
        doc.save(`${reporte.id}.pdf`);
    };

    const reportesFiltrados = reportes.filter(reporte =>
        reporte.tipo.toLowerCase().includes(filtro.toLowerCase()) ||
        reporte.id.toLowerCase().includes(filtro.toLowerCase()) ||
        reporte.estado.toLowerCase().includes(filtro.toLowerCase())
    );

    const tiposReporte = [
        { id: 'obras', nombre: 'Obras por Sector' },
        { id: 'presupuesto', nombre: 'Presupuesto Anual' },
        { id: 'contratos', nombre: 'Contratos Activos' },
        { id: 'estadisticas', nombre: 'Estadísticas Generales' },
        { id: 'usuarios', nombre: 'Usuarios del Sistema' }
    ];

    if (loading) return <Loader message="Cargando reportes..." />;
    if (error) return <div className="text-red-600 p-4">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-semibold text-gray-900">Reportes</h1>
                    <p className="text-lg text-gray-600">Genera y gestiona reportes del sistema</p>
                </div>
            </div>

            {/* Generador de Reportes */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Generar Nuevo Reporte</h2>
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de Reporte
                        </label>
                        <select
                            value={tipoReporte}
                            onChange={(e) => setTipoReporte(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {tiposReporte.map(tipo => (
                                <option key={tipo.id} value={tipo.id}>
                                    {tipo.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={() => generarReporte(tiposReporte.find(t => t.id === tipoReporte)?.nombre)}
                        disabled={generando}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-md font-medium transition-colors"
                    >
                        {generando ? 'Generando...' : 'Generar Reporte'}
                    </button>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex gap-4 items-center">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Buscar reportes..."
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Lista de Reportes */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Reportes Generados</h3>
                </div>

                {generando ? (
                    <div className="p-8 text-center">
                        <Loader message="Generando reporte..." />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tipo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Descargas
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reportesFiltrados.map((reporte) => (
                                    <tr key={reporte.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {reporte.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {reporte.tipo}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {reporte.descripcion}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {reporte.fecha}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                                                ${reporte.estado === 'Completado'
                                                    ? 'bg-green-100 text-green-800'
                                                    : reporte.estado === 'En Proceso'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                {reporte.estado}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {reporte.descargas}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => exportarExcel(reporte)}
                                                className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                                            >
                                                Excel
                                            </button>
                                            <button
                                                onClick={() => exportarPDF(reporte)}
                                                className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                                            >
                                                PDF
                                            </button>
                                            <button
                                                className="text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 px-3 py-1 rounded-md transition-colors"
                                            >
                                                Ver
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {reportesFiltrados.length === 0 && !generando && (
                    <div className="p-8 text-center text-gray-500">
                        No se encontraron reportes
                    </div>
                )}
            </div>

            {/* Estadísticas de Reportes */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 text-sm font-medium">📊</span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Reportes</p>
                            <p className="text-2xl font-semibold text-gray-900">{reportes.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-600 text-sm font-medium">✅</span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Completados</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {reportes.filter(r => r.estado === 'Completado').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                <span className="text-yellow-600 text-sm font-medium">⏳</span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">En Proceso</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {reportes.filter(r => r.estado === 'En Proceso').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <span className="text-purple-600 text-sm font-medium">📥</span>
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Descargas</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {reportes.reduce((sum, r) => sum + r.descargas, 0)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
