import { useEffect, useState } from "react";
import {
    Search, Plus, Download, Eye, Edit, Trash2,
    Calendar, DollarSign, FileText,
    AlertCircle, CheckCircle, Clock
} from "lucide-react";

const Contrataciones = () => {
    // const { user } = useAuth(); // Eliminar si no se usa
    const [contratos, setContratos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("todos");
    const [filtroSector, setFiltroSector] = useState("todos");
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        titulo: "",
        descripcion: "",
        empresa: "",
        monto: "",
        fechaInicio: "",
        fechaFin: "",
        estado: "en_proceso",
        sector: "infraestructura"
    });

    useEffect(() => {
        // Datos de ejemplo realistas
        const contratosEjemplo = [
            {
                id: 1,
                titulo: "Construcción de Centro Comunitario Sector Norte",
                descripcion: "Construcción de centro comunitario con salón múltiple, oficinas administrativas y áreas recreativas",
                empresa: "Constructora Norte S.A.",
                monto: 45000000,
                fechaInicio: "2024-01-15",
                fechaFin: "2024-06-30",
                estado: "en_proceso",
                sector: "infraestructura",
                progreso: 35,
                documentos: 8
            },
            {
                id: 2,
                titulo: "Mantenimiento de Vías Principales",
                descripcion: "Servicios de mantenimiento y reparación de vías principales del municipio",
                empresa: "Vías y Construcciones Ltda.",
                monto: 28000000,
                fechaInicio: "2024-01-10",
                fechaFin: "2024-12-31",
                estado: "aprobado",
                sector: "transporte",
                progreso: 0,
                documentos: 12
            },
            {
                id: 3,
                titulo: "Equipamiento de Biblioteca Municipal",
                descripcion: "Adquisición de mobiliario, equipos informáticos y material bibliográfico",
                empresa: "Mobiliario Educativo S.A.",
                monto: 15000000,
                fechaInicio: "2024-02-01",
                fechaFin: "2024-03-31",
                estado: "finalizado",
                sector: "educacion",
                progreso: 100,
                documentos: 15
            },
            {
                id: 4,
                titulo: "Sistema de Alumbrado Público LED",
                descripcion: "Instalación de sistema de alumbrado público con tecnología LED en zonas residenciales",
                empresa: "Energía Limpia Ltda.",
                monto: 32000000,
                fechaInicio: "2024-01-20",
                fechaFin: "2024-05-15",
                estado: "en_proceso",
                sector: "servicios",
                progreso: 60,
                documentos: 10
            },
            {
                id: 5,
                titulo: "Ampliación de Red de Agua Potable",
                descripcion: "Extensión de red de agua potable a barrios periféricos",
                empresa: "Acueductos Regionales S.A.",
                monto: 55000000,
                fechaInicio: "2024-02-15",
                fechaFin: "2024-08-30",
                estado: "pendiente",
                sector: "servicios",
                progreso: 0,
                documentos: 6
            }
        ];
        setTimeout(() => {
            setContratos(contratosEjemplo);
            setLoading(false);
        }, 800);
    }, []);

    const contratosFiltrados = contratos.filter(contrato => {
        const cumpleFiltro = contrato.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
            contrato.empresa.toLowerCase().includes(filtro.toLowerCase());
        const cumpleEstado = filtroEstado === "todos" || contrato.estado === filtroEstado;
        const cumpleSector = filtroSector === "todos" || contrato.sector === filtroSector;

        return cumpleFiltro && cumpleEstado && cumpleSector;
    });

    const stats = {
        total: contratos.length,
        enProceso: contratos.filter(c => c.estado === "en_proceso").length,
        finalizados: contratos.filter(c => c.estado === "finalizado").length,
        montoTotal: contratos.reduce((sum, c) => sum + c.monto, 0)
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
            case "en_proceso": return "bg-blue-100 text-blue-800";
            case "aprobado": return "bg-green-100 text-green-800";
            case "finalizado": return "bg-purple-100 text-purple-800";
            case "pendiente": return "bg-yellow-100 text-yellow-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getEstadoIcon = (estado) => {
        switch (estado) {
            case "en_proceso": return <Clock className="h-4 w-4" />;
            case "aprobado": return <CheckCircle className="h-4 w-4" />;
            case "finalizado": return <CheckCircle className="h-4 w-4" />;
            case "pendiente": return <AlertCircle className="h-4 w-4" />;
            default: return <Clock className="h-4 w-4" />;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newContrato = {
            id: Date.now(),
            ...formData,
            monto: parseFloat(formData.monto),
            progreso: 0,
            documentos: 0
        };
        setContratos(prev => [...prev, newContrato]);
        setShowModal(false);
        setFormData({
            titulo: "",
            descripcion: "",
            empresa: "",
            monto: "",
            fechaInicio: "",
            fechaFin: "",
            estado: "en_proceso",
            sector: "infraestructura"
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-lg">Cargando contrataciones...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Contrataciones</h1>
                    <p className="text-gray-600">Administra contratos y licitaciones municipales</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Nuevo Contrato
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Contratos</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <FileText className="h-8 w-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">En Proceso</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.enProceso}</p>
                        </div>
                        <Clock className="h-8 w-8 text-green-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Finalizados</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.finalizados}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-purple-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Monto Total</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.montoTotal)}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-orange-500" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar contratos..."
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <select
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="aprobado">Aprobado</option>
                        <option value="en_proceso">En Proceso</option>
                        <option value="finalizado">Finalizado</option>
                    </select>

                    <select
                        value={filtroSector}
                        onChange={(e) => setFiltroSector(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="todos">Todos los sectores</option>
                        <option value="infraestructura">Infraestructura</option>
                        <option value="transporte">Transporte</option>
                        <option value="educacion">Educación</option>
                        <option value="servicios">Servicios</option>
                    </select>

                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors">
                        <Download className="h-4 w-4" />
                        Exportar
                    </button>
                </div>
            </div>

            {/* Contracts Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contrato
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Empresa
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Monto
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
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
                            {contratosFiltrados.map((contrato) => (
                                <tr key={contrato.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{contrato.titulo}</div>
                                            <div className="text-sm text-gray-500">{contrato.descripcion}</div>
                                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(contrato.fechaInicio).toLocaleDateString('es-CO')} - {new Date(contrato.fechaFin).toLocaleDateString('es-CO')}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {contrato.empresa}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {formatCurrency(contrato.monto)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(contrato.estado)}`}>
                                            {getEstadoIcon(contrato.estado)}
                                            {contrato.estado.replace("_", " ")}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${contrato.progreso}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm text-gray-600">{contrato.progreso}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors">
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md transition-colors">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {contratosFiltrados.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No se encontraron contratos
                    </div>
                )}
            </div>

            {/* Modal for new contract */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-lg font-bold mb-4">Nuevo Contrato</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                                    <input
                                        type="text"
                                        name="titulo"
                                        value={formData.titulo}
                                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Empresa</label>
                                    <input
                                        type="text"
                                        name="empresa"
                                        value={formData.empresa}
                                        onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                                <textarea
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows="3"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Monto</label>
                                    <input
                                        type="number"
                                        name="monto"
                                        value={formData.monto}
                                        onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
                                    <input
                                        type="date"
                                        name="fechaInicio"
                                        value={formData.fechaInicio}
                                        onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
                                    <input
                                        type="date"
                                        name="fechaFin"
                                        value={formData.fechaFin}
                                        onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                                    <select
                                        name="estado"
                                        value={formData.estado}
                                        onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="pendiente">Pendiente</option>
                                        <option value="aprobado">Aprobado</option>
                                        <option value="en_proceso">En Proceso</option>
                                        <option value="finalizado">Finalizado</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
                                    <select
                                        name="sector"
                                        value={formData.sector}
                                        onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="infraestructura">Infraestructura</option>
                                        <option value="transporte">Transporte</option>
                                        <option value="educacion">Educación</option>
                                        <option value="servicios">Servicios</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    Crear Contrato
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Contrataciones;
