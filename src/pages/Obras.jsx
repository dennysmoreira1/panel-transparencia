// src/pages/Obras.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Obras = () => {
    const [obras, setObras] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedObraId, setSelectedObraId] = useState(null);
    const [nuevaObra, setNuevaObra] = useState({
        nombre: "",
        descripcion: "",
        sector: "",
        estado: "pendiente",
        presupuesto: "",
        fecha_inicio: "",
        fecha_fin: "",
    });

    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    /* -------------------- Cargar obras + archivos -------------------- */
    useEffect(() => {
        fetchObras();
    }, []);

    const fetchObras = async () => {
        try {
            const { data: obrasData } = await axios.get(`${API_URL}/api/obras`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Para cada obra, pide sus archivos
            const obrasConArchivos = await Promise.all(
                obrasData.map(async (obra) => {
                    try {
                        const { data: archivos } = await axios.get(
                            `${API_URL}/api/obras/${obra.id}/archivos`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        return { ...obra, archivos };
                    } catch {
                        return { ...obra, archivos: [] };
                    }
                })
            );

            setObras(obrasConArchivos);
        } catch (err) {
            console.error("Error al obtener obras", err);
        }
    };

    /* -------------------------- Subir archivo ------------------------- */
    const handleFileChange = (e, obraId) => {
        setSelectedFile(e.target.files[0]);
        setSelectedObraId(obraId);
    };

    const handleUpload = async (obraId) => {
        if (!selectedFile || selectedObraId !== obraId) return;

        const formData = new FormData();
        formData.append("file", selectedFile); // <-- nombre debe ser "file"

        try {
            await axios.post(
                `${API_URL}/api/obras/${obraId}/archivos`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Archivo subido correctamente");
            fetchObras();
        } catch (err) {
            console.error("Error al subir archivo", err);
            alert("Error al subir el archivo");
        } finally {
            setSelectedFile(null);
            setSelectedObraId(null);
        }
    };

    /* ------------------------ Eliminar archivo ------------------------ */
    const handleDeleteFile = async (obraId, archivoId) => {
        if (!confirm("¿Seguro de eliminar este archivo?")) return;
        try {
            await axios.delete(
                `${API_URL}/api/obras/${obraId}/archivos/${archivoId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Actualiza la lista en estado
            setObras((prev) =>
                prev.map((obra) =>
                    obra.id === obraId
                        ? { ...obra, archivos: obra.archivos.filter((a) => a.id !== archivoId) }
                        : obra
                )
            );
        } catch (err) {
            console.error("Error al eliminar archivo", err);
            alert("No se pudo eliminar");
        }
    };

    /* ---------------------- Crear nueva obra -------------------------- */
    const handleNuevaObraChange = (e) =>
        setNuevaObra({ ...nuevaObra, [e.target.name]: e.target.value });

    const handleCrearObra = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/obras`, nuevaObra, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Obra creada correctamente");
            setNuevaObra({
                nombre: "",
                descripcion: "",
                sector: "",
                estado: "pendiente",
                presupuesto: "",
                fecha_inicio: "",
                fecha_fin: "",
            });
            fetchObras();
        } catch (err) {
            console.error("Error al crear obra", err);
            alert("Error al crear obra");
        }
    };

    /* -------------------------- Render UI ----------------------------- */
    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Gestión de Obras</h2>

            {/* ---------- Formulario de nueva obra ---------- */}
            <form
                onSubmit={handleCrearObra}
                className="space-y-2 mb-8 bg-gray-50 p-4 rounded"
            >
                <h3 className="text-lg font-bold">Crear nueva obra</h3>
                <Input
                    name="nombre"
                    placeholder="Nombre"
                    value={nuevaObra.nombre}
                    onChange={handleNuevaObraChange}
                    required
                />
                <Textarea
                    name="descripcion"
                    placeholder="Descripción"
                    value={nuevaObra.descripcion}
                    onChange={handleNuevaObraChange}
                    required
                />
                <Input
                    name="sector"
                    placeholder="Sector"
                    value={nuevaObra.sector}
                    onChange={handleNuevaObraChange}
                    required
                />
                <select
                    name="estado"
                    value={nuevaObra.estado}
                    onChange={handleNuevaObraChange}
                    className="border p-2 rounded"
                >
                    <option value="pendiente">Pendiente</option>
                    <option value="en ejecución">En ejecución</option>
                    <option value="finalizada">Finalizada</option>
                </select>
                <Input
                    name="presupuesto"
                    type="number"
                    placeholder="Presupuesto"
                    value={nuevaObra.presupuesto}
                    onChange={handleNuevaObraChange}
                    required
                />
                <Input
                    name="fecha_inicio"
                    type="date"
                    value={nuevaObra.fecha_inicio}
                    onChange={handleNuevaObraChange}
                    required
                />
                <Input
                    name="fecha_fin"
                    type="date"
                    value={nuevaObra.fecha_fin}
                    onChange={handleNuevaObraChange}
                    required
                />
                <Button type="submit">Crear Obra</Button>
            </form>

            {/* ---------- Listado de obras ---------- */}
            {obras.length === 0 ? (
                <p>No hay obras disponibles.</p>
            ) : (
                <div className="grid gap-4">
                    {obras.map((obra) => (
                        <Card key={obra.id}>
                            <CardContent className="p-4">
                                <h3 className="text-lg font-bold">{obra.nombre}</h3>
                                <p>
                                    <strong>Sector:</strong> {obra.sector}
                                </p>
                                <p>
                                    <strong>Presupuesto:</strong> ${obra.presupuesto}
                                </p>
                                <p>
                                    <strong>Estado:</strong> {obra.estado}
                                </p>
                                <p>
                                    <strong>Inicio:</strong> {obra.fecha_inicio}
                                </p>
                                <p>
                                    <strong>Fin:</strong> {obra.fecha_fin}
                                </p>

                                {/* ---------- Subir archivo ---------- */}
                                <div className="mt-4">
                                    <Label htmlFor={`file-${obra.id}`}>Subir archivo:</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Input
                                            type="file"
                                            id={`file-${obra.id}`}
                                            onChange={(e) => handleFileChange(e, obra.id)}
                                        />
                                        <Button onClick={() => handleUpload(obra.id)}>Subir</Button>
                                    </div>
                                </div>

                                {/* ---------- Archivos existentes ---------- */}
                                {obra.archivos && obra.archivos.length > 0 && (
                                    <div className="mt-4">
                                        <p className="font-medium">Archivos:</p>
                                        <ul className="list-disc list-inside text-sm space-y-1">
                                            {obra.archivos.map((a) => (
                                                <li key={a.id} className="flex justify-between items-center">
                                                    <span>
                                                        {a.nombre_original}{" "}
                                                        <small className="text-gray-500">
                                                            ({(a.tamaño / 1024).toFixed(1)} KB)
                                                        </small>
                                                    </span>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            onClick={() =>
                                                                window.open(
                                                                    `${API_URL}/api/obras/${obra.id}/archivos/${a.id}`,
                                                                    "_blank"
                                                                )
                                                            }
                                                        >
                                                            Descargar
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleDeleteFile(obra.id, a.id)}
                                                        >
                                                            Eliminar
                                                        </Button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Obras;
