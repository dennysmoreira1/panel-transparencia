import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    PieChart, Pie, Cell, Tooltip as ChartTooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer,
    LineChart, Line, AreaChart, Area
} from 'recharts';
import {
    TrendingUp, Building2, CheckCircle, Clock,
    DollarSign, Users, FileText, BarChart3
} from 'lucide-react';

const Estadisticas = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filtros, setFiltros] = useState({ sector: '', estado: '', periodo: '2024' });

    // Datos de ejemplo realistas y completos
    const datosEjemplo = {
        totalObras: 24,
        totalContratos: 18,
        totalPresupuesto: 285000000,
        totalUsuarios: 156,
        porEstado: {
            'Finalizada': 12,
            'En Progreso': 8,
            'Pendiente': 4
        },
        porSector: [
            { nombre: 'Infraestructura', Finalizada: 4, EnProgreso: 3, Pendiente: 1, presupuesto: 85000000 },
            { nombre: 'Educación', Finalizada: 3, EnProgreso: 2, Pendiente: 1, presupuesto: 65000000 },
            { nombre: 'Salud', Finalizada: 2, EnProgreso: 1, Pendiente: 1, presupuesto: 45000000 },
            { nombre: 'Transporte', Finalizada: 2, EnProgreso: 1, Pendiente: 0, presupuesto: 55000000 },
            { nombre: 'Servicios Públicos', Finalizada: 1, EnProgreso: 1, Pendiente: 1, presupuesto: 35000000 }
        ],
        sectoresDisponibles: ['Infraestructura', 'Educación', 'Salud', 'Transporte', 'Servicios Públicos'],
        tendenciaMensual: [
            { mes: 'Ene', obras: 2, contratos: 1, presupuesto: 15000000 },
            { mes: 'Feb', obras: 3, contratos: 2, presupuesto: 25000000 },
            { mes: 'Mar', obras: 4, contratos: 3, presupuesto: 35000000 },
            { mes: 'Abr', obras: 5, contratos: 4, presupuesto: 45000000 },
            { mes: 'May', obras: 6, contratos: 5, presupuesto: 55000000 },
            { mes: 'Jun', obras: 7, contratos: 6, presupuesto: 65000000 },
            { mes: 'Jul', obras: 8, contratos: 7, presupuesto: 75000000 },
            { mes: 'Ago', obras: 9, contratos: 8, presupuesto: 85000000 },
            { mes: 'Sep', obras: 10, contratos: 9, presupuesto: 95000000 },
            { mes: 'Oct', obras: 11, contratos: 10, presupuesto: 105000000 },
            { mes: 'Nov', obras: 12, contratos: 11, presupuesto: 115000000 },
            { mes: 'Dic', obras: 13, contratos: 12, presupuesto: 125000000 }
        ],
        distribucionPresupuesto: [
            { sector: 'Infraestructura', porcentaje: 30, monto: 85000000 },
            { sector: 'Educación', porcentaje: 23, monto: 65000000 },
            { sector: 'Salud', porcentaje: 16, monto: 45000000 },
            { sector: 'Transporte', porcentaje: 19, monto: 55000000 },
            { sector: 'Servicios Públicos', porcentaje: 12, monto: 35000000 }
        ]
    };

    const colores = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

    useEffect(() => {
        // Simular carga de datos
        setTimeout(() => {
            setData(datosEjemplo);
            setLoading(false);
        }, 1000);
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const getFilteredData = () => {
        if (!data) return data;

        let filtered = { ...data };

        if (filtros.sector) {
            filtered.porSector = data.porSector.filter(s => s.nombre === filtros.sector);
        }

        if (filtros.estado) {
            filtered.porSector = data.porSector.map(s => ({
                ...s,
                [filtros.estado]: s[filtros.estado] || 0
            }));
        }

        return filtered;
    };

    const filteredData = getFilteredData();

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-lg">Cargando estadísticas...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Estadísticas Generales</h1>
                    <p className="text-gray-600">Análisis completo de la gestión municipal</p>
                </div>
                <div className="flex gap-2">
                    <select
                        value={filtros.sector}
                        onChange={e => setFiltros({ ...filtros, sector: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Todos los Sectores</option>
                        {data.sectoresDisponibles.map((s, i) => (
                            <option key={i} value={s}>{s}</option>
                        ))}
                    </select>
                    <select
                        value={filtros.estado}
                        onChange={e => setFiltros({ ...filtros, estado: e.target.value })}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Todos los Estados</option>
                        <option value="Finalizada">Finalizada</option>
                        <option value="En Progreso">En Progreso</option>
                        <option value="Pendiente">Pendiente</option>
                    </select>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Obras</p>
                            <p className="text-2xl font-bold text-gray-900">{data.totalObras}</p>
                        </div>
                        <Building2 className="h-8 w-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Contratos Activos</p>
                            <p className="text-2xl font-bold text-gray-900">{data.totalContratos}</p>
                        </div>
                        <FileText className="h-8 w-8 text-green-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Presupuesto Total</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.totalPresupuesto)}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-purple-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Usuarios Registrados</p>
                            <p className="text-2xl font-bold text-gray-900">{data.totalUsuarios}</p>
                        </div>
                        <Users className="h-8 w-8 text-orange-500" />
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart - Estado de Obras */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Distribución por Estado
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Finalizada', value: data.porEstado['Finalizada'] || 0 },
                                        { name: 'En Progreso', value: data.porEstado['En Progreso'] || 0 },
                                        { name: 'Pendiente', value: data.porEstado['Pendiente'] || 0 },
                                    ]}
                                    cx="50%" cy="50%" outerRadius={80}
                                    dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {colores.map((color, index) => (
                                        <Cell key={index} fill={color} />
                                    ))}
                                </Pie>
                                <ChartTooltip formatter={(value) => [value, 'Obras']} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bar Chart - Obras por Sector */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-500" />
                        Obras por Sector
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={filteredData.porSector}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="nombre" />
                                <YAxis />
                                <Legend />
                                <ChartTooltip formatter={(value) => [value, 'Obras']} />
                                <Bar dataKey="Finalizada" fill="#10b981" name="Finalizada" />
                                <Bar dataKey="En Progreso" fill="#3b82f6" name="En Progreso" />
                                <Bar dataKey="Pendiente" fill="#f59e0b" name="Pendiente" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Additional Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Line Chart - Tendencia Mensual */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-purple-500" />
                        Tendencia Mensual
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.tendenciaMensual}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="mes" />
                                <YAxis />
                                <Legend />
                                <ChartTooltip formatter={(value, name) => [
                                    name === 'obras' ? value : formatCurrency(value),
                                    name === 'obras' ? 'Obras' : name === 'contratos' ? 'Contratos' : 'Presupuesto'
                                ]} />
                                <Line type="monotone" dataKey="obras" stroke="#3b82f6" name="Obras" />
                                <Line type="monotone" dataKey="contratos" stroke="#10b981" name="Contratos" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Area Chart - Distribución de Presupuesto */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        Distribución de Presupuesto
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.distribucionPresupuesto}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="sector" />
                                <YAxis />
                                <Legend />
                                <ChartTooltip formatter={(value) => [formatCurrency(value), 'Presupuesto']} />
                                <Area type="monotone" dataKey="monto" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Summary Table */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Resumen por Sector</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Sector
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Finalizadas
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    En Progreso
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Pendientes
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Presupuesto
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredData.porSector.map((sector, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {sector.nombre}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {sector.Finalizada || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {sector.EnProgreso || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            {sector.Pendiente || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {formatCurrency(sector.presupuesto)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Estadisticas;
