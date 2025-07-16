import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
    Building2, FileText, Download, Upload, Eye,
    MapPin, DollarSign, TrendingUp
} from 'lucide-react';

export default function Obras() {
    const [obras, setObras] = useState([]);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroSector, setFiltroSector] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Datos de ejemplo realistas
        const obrasEjemplo = [
            {
                id: 1,
                nombre: "Construcción de Centro Comunitario Sector Norte",
                descripcion: "Centro comunitario con salón múltiple, oficinas administrativas y áreas recreativas",
                sector: "Infraestructura",
                estado: "En Progreso",
                presupuesto: 45000000,
                fecha_inicio: "2024-01-15",
                fecha_fin: "2024-06-30",
                progreso: 35,
                ubicacion: "Sector Norte, Calle 15 #23-45",
                contratista: "Constructora Norte S.A.",
                documentos: 8
            },
            {
                id: 2,
                nombre: "Rehabilitación de Parque Municipal",
                descripcion: "Mejora integral del parque central con nueva iluminación y mobiliario",
                sector: "Espacios Públicos",
                estado: "Finalizada",
                presupuesto: 28000000,
                fecha_inicio: "2023-10-01",
                fecha_fin: "2024-01-31",
                progreso: 100,
                ubicacion: "Parque Central, Centro",
                contratista: "Jardines y Paisajes Ltda.",
                documentos: 12
            },
            {
                id: 3,
                nombre: "Ampliación de Red de Agua Potable",
                descripcion: "Extensión de red de agua potable a barrios periféricos",
                sector: "Servicios Públicos",
                estado: "En Progreso",
                presupuesto: 55000000,
                fecha_inicio: "2024-02-15",
                fecha_fin: "2024-08-30",
                progreso: 60,
                ubicacion: "Barrios Periféricos",
                contratista: "Acueductos Regionales S.A.",
                documentos: 15
            },
            {
                id: 4,
                nombre: "Sistema de Alumbrado Público LED",
                descripcion: "Instalación de sistema de alumbrado público con tecnología LED",
                sector: "Servicios Públicos",
                estado: "Pendiente",
                presupuesto: 32000000,
                fecha_inicio: "2024-03-01",
                fecha_fin: "2024-05-15",
                progreso: 0,
                ubicacion: "Zonas Residenciales",
                contratista: "Energía Limpia Ltda.",
                documentos: 6
            },
            {
                id: 5,
                nombre: "Construcción de Biblioteca Municipal",
                descripcion: "Nueva biblioteca con salas de lectura y centro de cómputo",
                sector: "Educación",
                estado: "En Progreso",
                presupuesto: 38000000,
                fecha_inicio: "2024-01-20",
                fecha_fin: "2024-07-31",
                progreso: 45,
                ubicacion: "Sector Educativo, Calle 20 #15-30",
                contratista: "Constructora Educativa S.A.",
                documentos: 10
            }
        ];
        setTimeout(() => {
            setObras(obrasEjemplo);
            setLoading(false);
        }, 1000);
    }, []);

    const obrasFiltradas = obras.filter((obra) =>
        obra.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) &&
        obra.sector.toLowerCase().includes(filtroSector.toLowerCase()) &&
        obra.estado.toLowerCase().includes(filtroEstado.toLowerCase())
    );

    const stats = {
        total: obras.length,
        enProgreso: obras.filter(o => o.estado === "En Progreso").length,
        finalizadas: obras.filter(o => o.estado === "Finalizada").length,
        presupuestoTotal: obras.reduce((sum, o) => sum + o.presupuesto, 0)
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case "En Progreso": return "bg-blue-100 text-blue-800";
            case "Finalizada": return "bg-green-100 text-green-800";
            case "Pendiente": return "bg-yellow-100 text-yellow-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(obrasFiltradas);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Obras');
        XLSX.writeFile(wb, 'obras.xlsx');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-lg">Cargando obras...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Obras</h1>
                    <p className="text-gray-600">Administra obras públicas municipales</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Building2 className="h-4 w-4" />
                    Nueva Obra
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Obras</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <Building2 className="h-8 w-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">En Progreso</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.enProgreso}</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Finalizadas</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.finalizadas}</p>
                        </div>
                        <FileText className="h-8 w-8 text-purple-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Presupuesto Total</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.presupuestoTotal)}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-orange-500" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Buscar por nombre..."
                        value={filtroNombre}
                        onChange={(e) => setFiltroNombre(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                        type="text"
                        placeholder="Filtrar por sector..."
                        value={filtroSector}
                        onChange={(e) => setFiltroSector(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                        type="text"
                        placeholder="Filtrar por estado..."
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                        onClick={exportToExcel}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        Exportar
                    </button>
                </div>
            </div>

            {/* Works Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Obra
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sector
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Presupuesto
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Progreso
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {obrasFiltradas.map((obra) => (
                                <tr key={obra.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{obra.nombre}</div>
                                            <div className="text-sm text-gray-500">{obra.descripcion}</div>
                                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                                <MapPin className="h-3 w-3" />
                                                {obra.ubicacion}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {obra.sector}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(obra.estado)}`}>
                                            {obra.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {formatCurrency(obra.presupuesto)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${obra.progreso}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600">{obra.progreso}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors">
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors">
                                            <Upload className="h-4 w-4" />
                                        </button>
                                        <button className="text-purple-600 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-md transition-colors">
                                            <FileText className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {obrasFiltradas.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No se encontraron obras
                    </div>
                )}
            </div>
        </div>
    );
}
