// src/pages/Register.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const { register } = useAuth();
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.password2) {
            setError('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);
        try {
            const res = await register(form.username, form.email, form.password);
            if (res?.success || res?.msg === 'Usuario registrado correctamente') {
                navigate('/login');
            } else {
                setError(res?.msg || 'Error al registrar usuario');
            }
        } catch (err) {
            setError('Error inesperado al registrar');
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div className="p-4 max-w-sm mx-auto mt-10">
            <h1 className="text-2xl font-semibold mb-4 text-center">Registrar Usuario</h1>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    name="username"
                    type="text"
                    placeholder="Nombre de usuario"
                    value={form.username}
                    onChange={handleChange}
                    required
                    className="w-full p-2 mb-2 border rounded"
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Correo electrónico"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full p-2 mb-2 border rounded"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full p-2 mb-2 border rounded"
                />
                <input
                    name="password2"
                    type="password"
                    placeholder="Confirmar contraseña"
                    value={form.password2}
                    onChange={handleChange}
                    required
                    className="w-full p-2 mb-4 border rounded"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                    {loading ? 'Registrando...' : 'Registrar'}
                </button>
            </form>
        </div>
    );
}
