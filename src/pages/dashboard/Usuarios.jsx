import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Usuarios = () => {
    const { user } = useAuth();
    const [usuarios, setUsuarios] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ username: "", email: "", password: "", rol: "lector" });
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    // Verificar permisos de forma simple
    const canAccess = user && user.rol === "admin";

    // Datos de ejemplo para evitar errores de API
    const usuariosEjemplo = [
        { id: 1, username: "admin", email: "admin@transparencia.com", rol: "admin" },
        { id: 2, username: "editor1", email: "editor1@transparencia.com", rol: "editor" },
        { id: 3, username: "lector1", email: "lector1@transparencia.com", rol: "lector" },
    ];

    useEffect(() => {
        if (canAccess) {
            setLoading(true);
            // Simular carga de datos
            setTimeout(() => {
                setUsuarios(usuariosEjemplo);
                setLoading(false);
            }, 500);
        }
    }, [canAccess, usuariosEjemplo]);

    const exportarExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(usuarios);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "usuarios.xlsx");
    };

    const exportarPDF = () => {
        const doc = new jsPDF();
        const columns = ["ID", "Usuario", "Email", "Rol"];
        const rows = usuarios.map((u) => [u.id, u.username, u.email, u.rol]);
        doc.autoTable({ head: [columns], body: rows });
        doc.save("usuarios.pdf");
    };

    const usuariosFiltrados = usuarios.filter(
        (u) =>
            u.username?.toLowerCase().includes(filtro.toLowerCase()) ||
            u.email?.toLowerCase().includes(filtro.toLowerCase()) ||
            u.rol?.toLowerCase().includes(filtro.toLowerCase())
    );

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormData({ username: "", email: "", password: "", rol: "lector" });
        setIsEdit(false);
        setEditId(null);
        setShowModal(false);
    };

    const handleEdit = (usuario) => {
        setFormData({
            username: usuario.username,
            email: usuario.email,
            password: "",
            rol: usuario.rol
        });
        setIsEdit(true);
        setEditId(usuario.id);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) return;
        setUsuarios(prev => prev.filter(u => u.id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.username || !formData.email || (!isEdit && !formData.password)) {
            alert("Todos los campos son obligatorios");
            return;
        }

        if (isEdit) {
            setUsuarios(prev => prev.map(u =>
                u.id === editId
                    ? { ...u, username: formData.username, email: formData.email, rol: formData.rol }
                    : u
            ));
        } else {
            const newUser = {
                id: Date.now(),
                username: formData.username,
                email: formData.email,
                rol: formData.rol
            };
            setUsuarios(prev => [...prev, newUser]);
        }

        resetForm();
    };

    // Renderizado condicional simple
    if (!canAccess) {
        return (
            <div className="p-4">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <h2 className="text-lg font-semibold text-red-800 mb-2">Acceso Denegado</h2>
                    <p className="text-red-700">Solo los administradores pueden acceder a la gestión de usuarios.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>

            <div className="mb-4 flex gap-2 flex-wrap">
                <input
                    type="text"
                    placeholder="Buscar por usuario, email o rol..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    className="border p-2 rounded w-full max-w-md"
                />
                <button
                    onClick={exportarExcel}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                >
                    Exportar Excel
                </button>
                <button
                    onClick={exportarPDF}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                >
                    Exportar PDF
                </button>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                >
                    + Agregar Usuario
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Cargando usuarios...</span>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Usuario
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rol
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {usuariosFiltrados.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {u.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {u.username}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {u.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                                            ${u.rol === 'admin'
                                                ? 'bg-red-100 text-red-800'
                                                : u.rol === 'editor'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                            {u.rol}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => handleEdit(u)}
                                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(u.id)}
                                            className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {usuariosFiltrados.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No se encontraron usuarios
                        </div>
                    )}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">
                            {isEdit ? "Editar Usuario" : "Agregar Usuario"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                name="username"
                                placeholder="Nombre de usuario"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder={isEdit ? "Contraseña (dejar en blanco para no cambiar)" : "Contraseña"}
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required={!isEdit}
                            />
                            <select
                                name="rol"
                                value={formData.rol}
                                onChange={handleChange}
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="lector">Lector</option>
                                <option value="editor">Editor</option>
                                <option value="admin">Administrador</option>
                            </select>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                                >
                                    {isEdit ? "Actualizar" : "Crear"}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded transition-colors"
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

export default Usuarios;
