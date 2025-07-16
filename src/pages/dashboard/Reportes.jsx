import { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
    FileText, Download, Eye, Plus, Search, Filter,
    BarChart3, TrendingUp, Building2, DollarSign,
    CheckCircle, Clock, AlertCircle, Calendar
} from 'lucide-react';

const Reportes = () => {
    const { user } = useAuth();
    const [reportes, setReportes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState("");
    const [tipoFiltro, setTipoFiltro] = useState("todos");

    // Verificar permisos de forma memoizada
    const canAccess = useMemo(() => {
        return user && (user.rol === "admin" || user.rol === "editor");
    }, [user]);

    // Datos de ejemplo realistas y completos
    const reportesEjemplo = [
        {
            id: 1,
            titulo: "Reporte de Contrataciones Q1 2024",
            tipo: "contrataciones",
            fecha: "2024-03-15",
            autor: "admin@transparencia.com",
            estado: "completado",
            descripcion: "Análisis detallado de contrataciones del primer trimestre con 18 contratos activos",
            archivo: "contrataciones-q1-2024.pdf",
            tamaño: "2.3 MB"
        },
        {
            id: 2,
            titulo: "Presupuesto Ejecutado 2024",
            tipo: "presupuesto",
            fecha: "2024-02-28",
            autor: "editor1@transparencia.com",
            estado: "completado",
            descripcion: "Estado actual del presupuesto municipal con ejecución del 65%",
            archivo: "presupuesto-2024.pdf",
            tamaño: "1.8 MB"
        },
        {
            id: 3,
            titulo: "Obras en Ejecución - Marzo 2024",
            tipo: "obras",
            fecha: "2024-03-10",
            autor: "admin@transparencia.com",
            estado: "completado",
            descripcion: "Inventario completo de obras públicas en desarrollo",
            archivo: "obras-marzo-2024.pdf",
            tamaño: "3.1 MB"
        },
        {
            id: 4,
            titulo: "Análisis de Transparencia Q4 2023",
            tipo: "transparencia",
            fecha: "2024-01-15",
            autor: "editor2@transparencia.com",
            estado: "completado",
            descripcion: "Evaluación de transparencia y rendición de cuentas",
            archivo: "transparencia-q4-2023.pdf",
            tamaño: "2.7 MB"
        },
        {
            id: 5,
            titulo: "Reporte de Gestión Anual 2023",
            tipo: "gestion",
            fecha: "2024-01-31",
            autor: "admin@transparencia.com",
            estado: "completado",
            descripcion: "Resumen ejecutivo de la gestión municipal 2023",
            archivo: "gestion-2023.pdf",
            tamaño: "4.2 MB"
        },
        {
            id: 6,
            titulo: "Contrataciones Q2 2024",
            tipo: "contrataciones",
            fecha: "2024-04-01",
            autor: "editor1@transparencia.com",
            estado: "en_proceso",
            descripcion: "Reporte en preparación de contrataciones del segundo trimestre",
            archivo: null,
            tamaño: null
        },
        {
            id: 7,
            titulo: "Auditoría de Obras Públicas",
            tipo: "obras",
            fecha: "2024-03-20",
            autor: "admin@transparencia.com",
            estado: "en_proceso",
            descripcion: "Auditoría interna de obras públicas en ejecución",
            archivo: null,
            tamaño: null
        },
        {
            id: 8,
            titulo: "Presupuesto Q2 2024",
            tipo: "presupuesto",
            fecha: "2024-04-05",
            autor: "editor2@transparencia.com",
            estado: "pendiente",
            descripcion: "Planificación presupuestaria del segundo trimestre",
            archivo: null,
            tamaño: null
        }
    ];

    useEffect(() => {
        // Simular carga de datos
        setTimeout(() => {
            setReportes(reportesEjemplo);
            setLoading(false);
        }, 1000);
    }, []);

    const reportesFiltrados = useMemo(() => {
        return reportes.filter((r) => {
            const cumpleFiltro = r.titulo?.toLowerCase().includes(filtro.toLowerCase()) ||
                r.descripcion?.toLowerCase().includes(filtro.toLowerCase()) ||
                r.autor?.toLowerCase().includes(filtro.toLowerCase());

            const cumpleTipo = tipoFiltro === "todos" || r.tipo === tipoFiltro;

            return cumpleFiltro && cumpleTipo;
        });
    }, [reportes, filtro, tipoFiltro]);

    const stats = {
        total: reportes.length,
        completados: reportes.filter(r => r.estado === "completado").length,
        enProceso: reportes.filter(r => r.estado === "en_proceso").length,
        pendientes: reportes.filter(r => r.estado === "pendiente").length
    };

    const exportarExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(reportesFiltrados);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reportes");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "reportes.xlsx");
    };

    const exportarPDF = () => {
        const doc = new jsPDF();
        const columns = ["ID", "Título", "Tipo", "Fecha", "Autor", "Estado"];
        const rows = reportesFiltrados.map((r) => [
            r.id,
            r.titulo,
            r.tipo,
            r.fecha,
            r.autor,
            r.estado
        ]);
        doc.autoTable({ head: [columns], body: rows });
        doc.save("reportes.pdf");
    };

    const generarReporte = (tipo) => {
        if (!canAccess) return;

        // Simular generación de reporte
        alert(`Reporte de ${tipo} se está generando. Estará disponible en unos minutos.`);
    };

    const descargarReporte = (reporte) => {
        if (!reporte.archivo) {
            alert("Este reporte aún no está disponible para descarga.");
            return;
        }

        // Simular descarga
        alert(`Descargando ${reporte.archivo}...`);
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case "completado":
                return "bg-green-100 text-green-800";
            case "en_proceso":
                return "bg-yellow-100 text-yellow-800";
            case "pendiente":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getTipoColor = (tipo) => {
        switch (tipo) {
            case "contrataciones":
                return "bg-blue-100 text-blue-800";
            case "presupuesto":
                return "bg-green-100 text-green-800";
            case "obras":
                return "bg-purple-100 text-purple-800";
            case "transparencia":
                return "bg-orange-100 text-orange-800";
            case "gestion":
                return "bg-indigo-100 text-indigo-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getTipoIcon = (tipo) => {
        switch (tipo) {
            case "contrataciones":
                return <FileText className="h-4 w-4" />;
            case "presupuesto":
                return <DollarSign className="h-4 w-4" />;
            case "obras":
                return <Building2 className="h-4 w-4" />;
            case "transparencia":
                return <BarChart3 className="h-4 w-4" />;
            case "gestion":
                return <TrendingUp className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    // Renderizado condicional optimizado
    if (!canAccess) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="h-6 w-6 text-red-500" />
                        <h2 className="text-lg font-semibold text-red-800">Acceso Denegado</h2>
                    </div>
                    <p className="text-red-700">Solo administradores y editores pueden acceder a los reportes.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-lg">Cargando reportes...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Reportes</h1>
                    <p className="text-gray-600">Genera y administra reportes de transparencia</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Plus className="h-4 w-4" />
                    Nuevo Reporte
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Reportes</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <FileText className="h-8 w-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Completados</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.completados}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">En Proceso</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.enProceso}</p>
                        </div>
                        <Clock className="h-8 w-8 text-yellow-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-gray-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pendientes</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.pendientes}</p>
                        </div>
                        <AlertCircle className="h-8 w-8 text-gray-500" />
                    </div>
                </div>
            </div>

            {/* Filters and Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar reportes..."
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={tipoFiltro}
                        onChange={(e) => setTipoFiltro(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="todos">Todos los tipos</option>
                        <option value="contrataciones">Contrataciones</option>
                        <option value="presupuesto">Presupuesto</option>
                        <option value="obras">Obras</option>
                        <option value="transparencia">Transparencia</option>
                        <option value="gestion">Gestión</option>
                    </select>
                    <button
                        onClick={exportarExcel}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        Exportar Excel
                    </button>
                    <button
                        onClick={exportarPDF}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                        <FileText className="h-4 w-4" />
                        Exportar PDF
                    </button>
                </div>

                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => generarReporte("contrataciones")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <FileText className="h-4 w-4" />
                        Generar Contrataciones
                    </button>
                    <button
                        onClick={() => generarReporte("presupuesto")}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <DollarSign className="h-4 w-4" />
                        Generar Presupuesto
                    </button>
                    <button
                        onClick={() => generarReporte("obras")}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Building2 className="h-4 w-4" />
                        Generar Obras
                    </button>
                </div>
            </div>

            {/* Reports Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Reporte
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tipo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Autor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {reportesFiltrados.map((r) => (
                                <tr key={r.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{r.titulo}</div>
                                            <div className="text-sm text-gray-500">{r.descripcion}</div>
                                            {r.archivo && (
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {r.archivo} ({r.tamaño})
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getTipoColor(r.tipo)}`}>
                                            {getTipoIcon(r.tipo)}
                                            {r.tipo}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(r.fecha).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {r.autor}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(r.estado)}`}>
                                            {r.estado.replace("_", " ")}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => descargarReporte(r)}
                                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors flex items-center gap-1"
                                        >
                                            <Download className="h-3 w-3" />
                                            Descargar
                                        </button>
                                        <button className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors flex items-center gap-1">
                                            <Eye className="h-3 w-3" />
                                            Ver
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {reportesFiltrados.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No se encontraron reportes
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reportes;
