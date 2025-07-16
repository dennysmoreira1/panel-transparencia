const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const pool = require("../config/db");

// Obtener todos los presupuestos
router.get("/", authenticateToken, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM presupuesto ORDER BY anio ASC");
        res.json(result.rows);
    } catch (err) {
        console.error("Error al obtener presupuesto:", err);
        res.status(500).json({ msg: "Error al obtener presupuesto" });
    }
});

// Crear nuevo presupuesto
router.post("/", authenticateToken, async (req, res) => {
    const { sector, anio, presupuesto } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO presupuesto (sector, anio, presupuesto) VALUES ($1, $2, $3) RETURNING *",
            [sector, anio, presupuesto]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error al crear presupuesto:", err);
        res.status(500).json({ msg: "Error al crear presupuesto" });
    }
});

// Actualizar presupuesto existente
router.put("/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { sector, anio, presupuesto } = req.body;
    try {
        const result = await pool.query(
            "UPDATE presupuesto SET sector = $1, anio = $2, presupuesto = $3 WHERE id = $4 RETURNING *",
            [sector, anio, presupuesto, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error al actualizar presupuesto:", err);
        res.status(500).json({ msg: "Error al actualizar presupuesto" });
    }
});

// Eliminar presupuesto
router.delete("/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM presupuesto WHERE id = $1", [id]);
        res.json({ msg: "Presupuesto eliminado correctamente" });
    } catch (err) {
        console.error("Error al eliminar presupuesto:", err);
        res.status(500).json({ msg: "Error al eliminar presupuesto" });
    }
});

module.exports = router;
