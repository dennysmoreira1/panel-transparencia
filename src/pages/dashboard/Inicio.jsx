import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    Building2, FileText, Users, TrendingUp, AlertCircle,
    CheckCircle, Clock, DollarSign, Calendar,
    Download, BarChart3
} from 'lucide-react';

export default function Inicio() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({});
    const [recentActivities, setRecentActivities] = useState([]);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        // Simulación de carga de datos realistas
        setTimeout(() => {
            setStats({
                totalObras: 156,
                obrasEnProgreso: 89,
                obrasFinalizadas: 67,
                presupuestoTotal: 28450000,
                presupuestoEjecutado: 18720000,
                contratosActivos: 23,
                usuariosActivos: 12,
                reportesGenerados: 45
            });

            setRecentActivities([
                {
                    id: 1,
                    type: 'obra',
                    action: 'Nueva obra registrada',
                    description: 'Construcción de Centro Comunitario en Sector Norte',
                    amount: 2500000,
                    date: '2024-01-15',
                    status: 'en_progreso'
                },
                {
                    id: 2,
                    type: 'contrato',
                    action: 'Contrato aprobado',
                    description: 'Servicios de mantenimiento vial - Zona Centro',
                    amount: 1800000,
                    date: '2024-01-14',
                    status: 'aprobado'
                },
                {
                    id: 3,
                    type: 'reporte',
                    action: 'Reporte generado',
                    description: 'Estadísticas de ejecución presupuestaria Q4 2023',
                    date: '2024-01-13',
                    status: 'completado'
                },
                {
                    id: 4,
                    type: 'usuario',
                    action: 'Usuario registrado',
                    description: 'Nuevo editor: María González',
                    date: '2024-01-12',
                    status: 'nuevo'
                },
                {
                    id: 5,
                    type: 'obra',
                    action: 'Obra finalizada',
                    description: 'Rehabilitación de Parque Municipal',
                    amount: 3200000,
                    date: '2024-01-11',
                    status: 'finalizada'
                }
            ]);

            setAlerts([
                {
                    id: 1,
                    type: 'warning',
                    title: 'Presupuesto próximo al límite',
                    message: 'El sector Infraestructura ha ejecutado el 85% de su presupuesto asignado.',
                    date: '2024-01-15'
                },
                {
                    id: 2,
                    type: 'info',
                    title: 'Nuevo reporte disponible',
                    message: 'El reporte mensual de transparencia está listo para descarga.',
                    date: '2024-01-14'
                },
                {
                    id: 3,
                    type: 'success',
                    title: 'Meta cumplida',
                    message: 'Se ha alcanzado la meta de 150 obras registradas en el sistema.',
                    date: '2024-01-13'
                }
            ]);

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

    const getStatusColor = (status) => {
        switch (status) {
            case 'en_progreso': return 'text-blue-600 bg-blue-100';
            case 'finalizada': return 'text-green-600 bg-green-100';
            case 'aprobado': return 'text-purple-600 bg-purple-100';
            case 'completado': return 'text-green-600 bg-green-100';
            case 'nuevo': return 'text-orange-600 bg-orange-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getAlertIcon = (type) => {
        switch (type) {
            case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
            case 'info': return <BarChart3 className="h-5 w-5 text-blue-600" />;
            case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
            default: return <AlertCircle className="h-5 w-5 text-gray-600" />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-lg">Cargando dashboard...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">
                    ¡Bienvenido, {user?.username || 'Usuario'}!
                </h1>
                <p className="text-blue-100 text-lg">
                    Panel de control del sistema de transparencia municipal
                </p>
                <div className="mt-4 flex items-center gap-2 text-blue-100">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date().toLocaleDateString('es-CO', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</span>
                </div>
            </div>

            {/* Key Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Obras</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalObras}</p>
                            <p className="text-xs text-green-600">+12% este mes</p>
                        </div>
                        <Building2 className="h-8 w-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Presupuesto Ejecutado</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.presupuestoEjecutado)}</p>
                            <p className="text-xs text-green-600">65.8% del total</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-green-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Contratos Activos</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.contratosActivos}</p>
                            <p className="text-xs text-blue-600">+3 este mes</p>
                        </div>
                        <FileText className="h-8 w-8 text-purple-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.usuariosActivos}</p>
                            <p className="text-xs text-orange-600">+2 este mes</p>
                        </div>
                        <Users className="h-8 w-8 text-orange-500" />
                    </div>
                </div>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                        Progreso de Obras
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>En Progreso</span>
                                <span className="font-medium">{stats.obrasEnProgreso}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(stats.obrasEnProgreso / stats.totalObras) * 100}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Finalizadas</span>
                                <span className="font-medium">{stats.obrasFinalizadas}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(stats.obrasFinalizadas / stats.totalObras) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        Ejecución Presupuestaria
                    </h3>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                            {Math.round((stats.presupuestoEjecutado / stats.presupuestoTotal) * 100)}%
                        </div>
                        <p className="text-sm text-gray-600">
                            {formatCurrency(stats.presupuestoEjecutado)} de {formatCurrency(stats.presupuestoTotal)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Recent Activities and Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activities */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-500" />
                        Actividades Recientes
                    </h3>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                                    {activity.type === 'obra' && <Building2 className="h-4 w-4" />}
                                    {activity.type === 'contrato' && <FileText className="h-4 w-4" />}
                                    {activity.type === 'reporte' && <BarChart3 className="h-4 w-4" />}
                                    {activity.type === 'usuario' && <Users className="h-4 w-4" />}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{activity.action}</p>
                                    <p className="text-sm text-gray-600">{activity.description}</p>
                                    {activity.amount && (
                                        <p className="text-xs text-green-600 font-medium">
                                            {formatCurrency(activity.amount)}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(activity.date).toLocaleDateString('es-CO')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Alerts */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                        Alertas y Notificaciones
                    </h3>
                    <div className="space-y-4">
                        {alerts.map((alert) => (
                            <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200">
                                {getAlertIcon(alert.type)}
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{alert.title}</p>
                                    <p className="text-sm text-gray-600">{alert.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(alert.date).toLocaleDateString('es-CO')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Acciones Rápidas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                        <Building2 className="h-5 w-5 text-blue-500" />
                        <span className="text-sm font-medium">Nueva Obra</span>
                    </button>
                    <button className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors">
                        <FileText className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-medium">Crear Contrato</span>
                    </button>
                    <button className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors">
                        <BarChart3 className="h-5 w-5 text-purple-500" />
                        <span className="text-sm font-medium">Generar Reporte</span>
                    </button>
                    <button className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors">
                        <Download className="h-5 w-5 text-orange-500" />
                        <span className="text-sm font-medium">Exportar Datos</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
