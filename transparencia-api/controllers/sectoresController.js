// controllers/sectoresController.js
const { pool } = require("../config/db");

// GET /api/sectores
const obtenerSectores = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM sectores ORDER BY id ASC");
        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener sectores:", error);
        res.status(500).json({ message: "Error al obtener sectores" });
    }
};

// POST /api/sectores
const crearSector = async (req, res) => {
    if (req.user.rol !== "admin") return res.status(403).json({ message: "Acceso denegado" });

    const { nombre } = req.body;
    if (!nombre || nombre.trim() === "") {
        return res.status(400).json({ message: "El nombre es requerido" });
    }

    try {
        const existe = await pool.query("SELECT * FROM sectores WHERE nombre = $1", [nombre]);
        if (existe.rows.length > 0) {
            return res.status(400).json({ message: "El sector ya existe" });
        }

        const result = await pool.query("INSERT INTO sectores (nombre) VALUES ($1) RETURNING *", [nombre]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error al crear sector:", error);
        res.status(500).json({ message: "Error al crear sector" });
    }
};

// PUT /api/sectores/:id
const actualizarSector = async (req, res) => {
    if (req.user.rol !== "admin") return res.status(403).json({ message: "Acceso denegado" });

    const { id } = req.params;
    const { nombre } = req.body;

    try {
        const existe = await pool.query("SELECT * FROM sectores WHERE nombre = $1 AND id != $2", [nombre, id]);
        if (existe.rows.length > 0) {
            return res.status(400).json({ message: "Ya existe un sector con ese nombre" });
        }

        const result = await pool.query(
            "UPDATE sectores SET nombre = $1 WHERE id = $2 RETURNING *",
            [nombre, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Sector no encontrado" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error al actualizar sector:", error);
        res.status(500).json({ message: "Error al actualizar sector" });
    }
};

// DELETE /api/sectores/:id
const eliminarSector = async (req, res) => {
    if (req.user.rol !== "admin") return res.status(403).json({ message: "Acceso denegado" });

    const { id } = req.params;

    try {
        const result = await pool.query("DELETE FROM sectores WHERE id = $1 RETURNING *", [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Sector no encontrado" });
        }

        res.json({ message: "Sector eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar sector:", error);
        res.status(500).json({ message: "Error al eliminar sector" });
    }
};

module.exports = {
    obtenerSectores,
    crearSector,
    actualizarSector,
    eliminarSector,
};
