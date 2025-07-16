import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, Building, Users } from 'lucide-react';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        rol: 'lector'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (isLogin) {
                // Login
                const result = await login(formData.email, formData.password);
                if (result.success) {
                    navigate('/dashboard');
                } else {
                    setError(result.msg || 'Error al iniciar sesión');
                }
            } else {
                // Register
                if (formData.password !== formData.confirmPassword) {
                    setError('Las contraseñas no coinciden');
                    setLoading(false);
                    return;
                }

                const res = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: formData.username,
                        email: formData.email,
                        password: formData.password,
                        rol: formData.rol
                    }),
                });

                const data = await res.json();
                if (res.ok) {
                    setSuccess('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
                    setIsLogin(true);
                    setFormData({ username: '', email: '', password: '', confirmPassword: '', rol: 'lector' });
                } else {
                    setError(data.msg || 'Error al registrar usuario');
                }
            }
        } catch (err) {
            setError('Error de conexión. Verifica que el servidor esté corriendo.');
        } finally {
            setLoading(false);
        }
    };

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
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full space-y-8">
                    {/* Header */}
                    <div className="text-center">
                        <div className="mx-auto h-20 w-20 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 border border-white border-opacity-30">
                            <Building className="h-10 w-10 text-white" />
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
                            Panel de Transparencia
                        </h2>
                        <p className="text-white text-opacity-90 text-lg">
                            {isLogin ? 'Inicia sesión en tu cuenta' : 'Crea una nueva cuenta'}
                        </p>
                    </div>

                    {/* Form */}
                    <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white border-opacity-30">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Toggle Login/Register */}
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    type="button"
                                    onClick={() => setIsLogin(true)}
                                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${isLogin
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Iniciar Sesión
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsLogin(false)}
                                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${!isLogin
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Registrarse
                                </button>
                            </div>

                            {/* Error/Success Messages */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                                    {success}
                                </div>
                            )}

                            {/* Username (only for register) */}
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre de usuario
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Ingresa tu nombre de usuario"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Correo electrónico
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="correo@ejemplo.com"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Ingresa tu contraseña"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password (only for register) */}
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirmar contraseña
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Confirma tu contraseña"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Role (only for register) */}
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rol
                                    </label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <select
                                            name="rol"
                                            value={formData.rol}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        >
                                            <option value="lector">Lector</option>
                                            <option value="editor">Editor</option>
                                            <option value="admin">Administrador</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        {isLogin ? 'Iniciando sesión...' : 'Registrando...'}
                                    </div>
                                ) : (
                                    isLogin ? 'Iniciar Sesión' : 'Registrarse'
                                )}
                            </button>
                        </form>

                        {/* Demo Credentials */}
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <h4 className="text-sm font-medium text-blue-900 mb-2">Credenciales de demostración:</h4>
                            <div className="text-xs text-blue-700 space-y-1">
                                <p><strong>Email:</strong> admin@admin.com</p>
                                <p><strong>Password:</strong> admin123</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center text-sm text-white text-opacity-80">
                        <p>© 2024 Panel de Transparencia. Todos los derechos reservados.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
