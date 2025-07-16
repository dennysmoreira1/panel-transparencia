// controllers/obrasController.js
const { pool } = require("../config/db");

/* ───────────────────────────────────────────┐
   🔹 1. LISTAR OBRAS CON NOMBRE DE SECTOR
   └────────────────────────────────────────── */
const obtenerObras = async (_req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT o.*, s.nombre AS sector_nombre
       FROM obras o
       LEFT JOIN sectores s ON o.sector_id = s.id
       ORDER BY o.id ASC`
        );
        res.json(rows);
    } catch (err) {
        console.error("Error al obtener obras:", err);
        res.status(500).json({ msg: "Error al obtener obras" });
    }
};

/* ───────────────────────────────────────────┐
   🔹 2. CREAR OBRA
   └────────────────────────────────────────── */
const crearObra = async (req, res) => {
    const {
        nombre,
        descripcion,
        estado,
        fecha_inicio,
        fecha_fin,
        presupuesto,
        sector_id,
    } = req.body;

    try {
        const { rows } = await pool.query(
            `INSERT INTO obras
       (nombre, descripcion, estado, fecha_inicio, fecha_fin, presupuesto, sector_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
            [nombre, descripcion, estado, fecha_inicio, fecha_fin, presupuesto, sector_id]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error("Error al crear obra:", err);
        res.status(500).json({ msg: "Error al crear obra" });
    }
};

/* ───────────────────────────────────────────┐
   🔹 3. ACTUALIZAR OBRA
   └────────────────────────────────────────── */
const actualizarObra = async (req, res) => {
    const { id } = req.params;
    const {
        nombre,
        descripcion,
        estado,
        fecha_inicio,
        fecha_fin,
        presupuesto,
        sector_id,
    } = req.body;

    try {
        const { rows, rowCount } = await pool.query(
            `UPDATE obras
       SET nombre=$1, descripcion=$2, estado=$3,
           fecha_inicio=$4, fecha_fin=$5,
           presupuesto=$6, sector_id=$7
       WHERE id=$8
       RETURNING *`,
            [
                nombre,
                descripcion,
                estado,
                fecha_inicio,
                fecha_fin,
                presupuesto,
                sector_id,
                id,
            ]
        );

        if (rowCount === 0) return res.status(404).json({ msg: "Obra no encontrada" });
        res.json(rows[0]);
    } catch (err) {
        console.error("Error al actualizar obra:", err);
        res.status(500).json({ msg: "Error al actualizar obra" });
    }
};

/* ───────────────────────────────────────────┐
   🔹 4. ELIMINAR OBRA
   └────────────────────────────────────────── */
const eliminarObra = async (req, res) => {
    const { id } = req.params;

    try {
        const { rowCount } = await pool.query("DELETE FROM obras WHERE id=$1", [id]);
        if (rowCount === 0) return res.status(404).json({ msg: "Obra no encontrada" });
        res.json({ msg: "Obra eliminada correctamente" });
    } catch (err) {
        console.error("Error al eliminar obra:", err);
        res.status(500).json({ msg: "Error al eliminar obra" });
    }
};

/* ───────────────────────────────────────────┐
   🔹 5. ARCHIVOS (subida y listado) 
   └────────────────────────────────────────── */
const subirArchivo = async (req, res) => {
    const { obraId } = req.params;
    if (!req.file) return res.status(400).json({ msg: "No se envió archivo" });

    try {
        const { rows } = await pool.query(
            `INSERT INTO archivos
       (obra_id, nombre_archivo, ruta)
       VALUES ($1,$2,$3)
       RETURNING *`,
            [obraId, req.file.originalname, req.file.path]
        );
        res.status(201).json({ msg: "Archivo subido", archivo: rows[0] });
    } catch (err) {
        console.error("Error al subir archivo:", err);
        res.status(500).json({ msg: "Error al subir archivo" });
    }
};

const obtenerArchivos = async (req, res) => {
    const { obraId } = req.params;
    try {
        const { rows } = await pool.query(
            "SELECT id, nombre_archivo, ruta FROM archivos WHERE obra_id=$1 ORDER BY id DESC",
            [obraId]
        );
        res.json(rows);
    } catch (err) {
        console.error("Error al obtener archivos:", err);
        res.status(500).json({ msg: "Error al obtener archivos" });
    }
};

module.exports = {
    obtenerObras,
    crearObra,
    actualizarObra,
    eliminarObra,
    subirArchivo,
    obtenerArchivos,
};
