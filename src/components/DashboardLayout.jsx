import { Outlet, Link, useLocation } from 'react-router-dom';
import { useMemo, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Home, ClipboardList, Building2, Layers3, FolderKanban, FileText,
    BarChart3, Users, FileBarChart2, LogOut, Menu, X
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardLayout() {
    const { logout, user, isAdmin } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navLinks = useMemo(() => {
        const links = [
            { to: '/dashboard', label: 'Inicio', icon: Home },
            { to: '/dashboard/contrataciones', label: 'Contrataciones', icon: ClipboardList },
            { to: '/dashboard/obras', label: 'Obras', icon: Building2 },
            { to: '/dashboard/sectores', label: 'Sectores', icon: Layers3 },
            { to: '/dashboard/presupuestos', label: 'Presupuestos', icon: FolderKanban },
            { to: '/dashboard/documentos', label: 'Documentos', icon: FileText },
            { to: '/dashboard/estadisticas', label: 'Estadísticas', icon: BarChart3 },
            { to: '/dashboard/reportes', label: 'Reportes', icon: FileBarChart2 },
        ];

        // 🔐 Agrega módulo de usuarios solo si es administrador
        if (isAdmin) {
            links.push({ to: '/dashboard/usuarios', label: 'Usuarios', icon: Users });
        }

        return links;
    }, [isAdmin]);

    const currentModule = useMemo(() => {
        // Buscar la ruta más específica que coincida
        const exactMatch = navLinks.find(link => location.pathname === link.to);
        if (exactMatch) return exactMatch.label;

        // Si no hay coincidencia exacta, buscar la más específica que contenga la ruta actual
        const matchingLinks = navLinks.filter(link =>
            location.pathname.startsWith(link.to) && link.to !== '/dashboard'
        );

        if (matchingLinks.length > 0) {
            // Ordenar por longitud de ruta (más específica primero)
            matchingLinks.sort((a, b) => b.to.length - a.to.length);
            return matchingLinks[0].label;
        }

        // Si estamos en /dashboard exactamente
        if (location.pathname === '/dashboard') {
            return 'Inicio';
        }

        return 'Panel de Transparencia';
    }, [location.pathname, navLinks]);

    const handleSidebarToggle = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    const handleSidebarClose = useCallback(() => {
        setSidebarOpen(false);
    }, []);

    const handleLogout = useCallback(() => {
        logout();
    }, [logout]);

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url('data:image/svg+xml;base64,${btoa(`
                        <svg width="1920" height="1080" viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" style="stop-color:#1e40af;stop-opacity:0.9" />
                                    <stop offset="50%" style="stop-color:#3b82f6;stop-opacity:0.8" />
                                    <stop offset="100%" style="stop-color:#6366f1;stop-opacity:0.9" />
                                </linearGradient>
                                <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
                                </pattern>
                                <filter id="blur">
                                    <feGaussianBlur stdDeviation="3"/>
                                </filter>
                            </defs>
                            
                            <!-- Background -->
                            <rect width="1920" height="1080" fill="url(#grad1)"/>
                            <rect width="1920" height="1080" fill="url(#grid)"/>
                            
                            <!-- Abstract shapes representing transparency and governance -->
                            <g opacity="0.3" filter="url(#blur)">
                                <!-- Government building silhouette -->
                                <path d="M 200 800 L 400 800 L 400 600 L 350 600 L 350 500 L 250 500 L 250 600 L 200 600 Z" fill="rgba(255,255,255,0.2)"/>
                                <rect x="300" y="400" width="100" height="100" fill="rgba(255,255,255,0.15)"/>
                                <rect x="320" y="420" width="60" height="60" fill="rgba(255,255,255,0.1)"/>
                                
                                <!-- Data visualization elements -->
                                <circle cx="1600" cy="300" r="80" fill="rgba(255,255,255,0.1)"/>
                                <circle cx="1700" cy="400" r="60" fill="rgba(255,255,255,0.15)"/>
                                <circle cx="1500" cy="500" r="40" fill="rgba(255,255,255,0.2)"/>
                                
                                <!-- Transparency symbols -->
                                <g transform="translate(1400, 700)">
                                    <rect x="0" y="0" width="200" height="150" fill="rgba(255,255,255,0.1)" rx="10"/>
                                    <rect x="20" y="20" width="160" height="20" fill="rgba(255,255,255,0.2)"/>
                                    <rect x="20" y="50" width="140" height="20" fill="rgba(255,255,255,0.2)"/>
                                    <rect x="20" y="80" width="180" height="20" fill="rgba(255,255,255,0.2)"/>
                                    <rect x="20" y="110" width="120" height="20" fill="rgba(255,255,255,0.2)"/>
                                </g>
                                
                                <!-- Charts and graphs -->
                                <g transform="translate(100, 200)">
                                    <rect x="0" y="0" width="300" height="200" fill="rgba(255,255,255,0.1)" rx="10"/>
                                    <rect x="20" y="150" width="40" height="30" fill="rgba(255,255,255,0.3)"/>
                                    <rect x="80" y="120" width="40" height="60" fill="rgba(255,255,255,0.3)"/>
                                    <rect x="140" y="100" width="40" height="80" fill="rgba(255,255,255,0.3)"/>
                                    <rect x="200" y="80" width="40" height="100" fill="rgba(255,255,255,0.3)"/>
                                    <rect x="260" y="140" width="40" height="40" fill="rgba(255,255,255,0.3)"/>
                                </g>
                            </g>
                            
                            <!-- Floating particles -->
                            <g opacity="0.4">
                                <circle cx="500" cy="300" r="3" fill="white"/>
                                <circle cx="1200" cy="200" r="2" fill="white"/>
                                <circle cx="800" cy="600" r="4" fill="white"/>
                                <circle cx="1600" cy="800" r="3" fill="white"/>
                                <circle cx="300" cy="700" r="2" fill="white"/>
                                <circle cx="1400" cy="400" r="3" fill="white"/>
                                <circle cx="600" cy="900" r="2" fill="white"/>
                                <circle cx="1800" cy="600" r="4" fill="white"/>
                            </g>
                        </svg>
                    `)}')`,
                }}
            />

            {/* Dark overlay for better readability */}
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>

            {/* Content */}
            <div className="relative z-10 flex h-screen overflow-hidden">
                {/* Sidebar */}
                <aside
                    className={`fixed md:static z-40 w-64 bg-blue-800 bg-opacity-95 backdrop-blur-sm text-white transition-transform duration-300 transform border-r border-white border-opacity-20 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                        }`}
                >
                    {/* Sidebar header */}
                    <div className="flex items-center justify-between p-4 border-b border-blue-700 border-opacity-50">
                        <h2 className="text-2xl font-bold">Panel</h2>
                        <button className="md:hidden" onClick={handleSidebarClose}>
                            <X />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="p-4 space-y-1">
                        {navLinks.map(({ to, label, icon: Icon }) => {
                            const active = location.pathname === to ||
                                (location.pathname.startsWith(to) && to !== '/dashboard');
                            return (
                                <Link
                                    key={to}
                                    to={to}
                                    onClick={handleSidebarClose}
                                    className={`flex items-center gap-3 px-3 py-2 rounded transition-colors ${active ? 'bg-blue-700 bg-opacity-80 font-semibold' : 'hover:bg-blue-600 hover:bg-opacity-80'
                                        }`}
                                >
                                    <Icon size={18} />
                                    <span>{label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-blue-700 border-opacity-50">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded transition-colors"
                        >
                            <LogOut size={18} />
                            Cerrar sesión
                        </button>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-4 overflow-y-auto">
                    {/* Top bar for mobile */}
                    <div className="md:hidden flex items-center justify-between mb-4">
                        <h1 className="text-xl font-semibold text-white drop-shadow-lg">{currentModule}</h1>
                        <button className="text-white" onClick={handleSidebarToggle}>
                            <Menu />
                        </button>
                    </div>

                    {/* Module title */}
                    <div className="hidden md:block mb-6">
                        <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                            Módulo: {currentModule}
                        </h1>
                    </div>

                    {/* Module content */}
                    <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-2xl p-6 border border-white border-opacity-30">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
