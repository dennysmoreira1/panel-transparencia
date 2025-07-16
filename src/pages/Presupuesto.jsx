import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Plus } from "lucide-react";

const Presupuestos = () => {
    const [presupuestos, setPresupuestos] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({ nombre: "", monto: "", año: "", descripcion: "" });
    const [editId, setEditId] = useState(null);

    const token = localStorage.getItem("token");

    const fetchPresupuestos = async () => {
        const res = await axios.get("/api/presupuesto", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setPresupuestos(res.data);
    };

    useEffect(() => {
        fetchPresupuestos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editId) {
            await axios.put(`/api/presupuesto/${editId}`, form, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } else {
            await axios.post("/api/presupuesto", form, {
                headers: { Authorization: `Bearer ${token}` },
            });
        }
        fetchPresupuestos();
        setForm({ nombre: "", monto: "", año: "", descripcion: "" });
        setEditId(null);
        setModalOpen(false);
    };

    const handleEdit = (item) => {
        setForm(item);
        setEditId(item.id);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        await axios.delete(`/api/presupuesto/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchPresupuestos();
    };

    return (
        <div className="p-4 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Presupuestos</h1>
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2" size={18} />
                            Nuevo
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form onSubmit={handleSubmit} className="grid gap-4">
                            <Input
                                placeholder="Nombre"
                                value={form.nombre}
                                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                required
                            />
                            <Input
                                placeholder="Monto"
                                type="number"
                                value={form.monto}
                                onChange={(e) => setForm({ ...form, monto: e.target.value })}
                                required
                            />
                            <Input
                                placeholder="Año"
                                type="number"
                                value={form.año}
                                onChange={(e) => setForm({ ...form, año: e.target.value })}
                                required
                            />
                            <Input
                                placeholder="Descripción"
                                value={form.descripcion}
                                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                            />
                            <Button type="submit">{editId ? "Actualizar" : "Crear"}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border rounded-lg text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 text-left">Nombre</th>
                            <th className="p-2 text-left">Monto</th>
                            <th className="p-2 text-left">Año</th>
                            <th className="p-2 text-left">Descripción</th>
                            <th className="p-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {presupuestos.map((p) => (
                            <tr key={p.id} className="border-t">
                                <td className="p-2">{p.nombre}</td>
                                <td className="p-2">{parseFloat(p.monto).toLocaleString()}</td>
                                <td className="p-2">{p.año}</td>
                                <td className="p-2">{p.descripcion}</td>
                                <td className="p-2 flex gap-2 justify-center">
                                    <Button size="icon" variant="ghost" onClick={() => handleEdit(p)}>
                                        <Pencil size={16} />
                                    </Button>
                                    <Button size="icon" variant="destructive" onClick={() => handleDelete(p.id)}>
                                        <Trash2 size={16} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {presupuestos.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center p-4">
                                    No hay presupuestos cargados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Presupuestos;
