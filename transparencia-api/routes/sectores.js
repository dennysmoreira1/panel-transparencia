// routes/sectores.js
const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");
const { authenticateToken, requireRole } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

// =======================
// 🔹 CRUD DE SECTORES
// =======================

// Obtener todos los sectores (cualquier usuario autenticado)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, COUNT(o.id) AS "numeroObras"
      FROM sectores s
      LEFT JOIN obras o ON o.sector_id = s.id
      GROUP BY s.id
      ORDER BY s.id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener sectores:", err);
    res.status(500).json({ msg: "Error al obtener sectores" });
  }
});

// Crear sector (solo admin)
router.post("/", authenticateToken, requireRole("admin"), async (req, res) => {
  const { nombre } = req.body;

  if (!nombre || nombre.trim() === "") {
    return res.status(400).json({ msg: "El nombre del sector es requerido" });
  }

  try {
    const existe = await pool.query("SELECT * FROM sectores WHERE nombre = $1", [nombre]);
    if (existe.rows.length > 0) {
      return res.status(400).json({ msg: "El sector ya existe" });
    }

    const result = await pool.query(
      "INSERT INTO sectores (nombre) VALUES ($1) RETURNING *",
      [nombre]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error al crear sector:", err);
    res.status(500).json({ msg: "Error al crear sector" });
  }
});

// Editar sector (solo admin)
router.put("/:id", authenticateToken, requireRole("admin"), async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  if (!nombre || nombre.trim() === "") {
    return res.status(400).json({ msg: "El nombre del sector es requerido" });
  }

  try {
    const existe = await pool.query(
      "SELECT * FROM sectores WHERE nombre = $1 AND id != $2",
      [nombre, id]
    );
    if (existe.rows.length > 0) {
      return res.status(400).json({ msg: "Ya existe un sector con ese nombre" });
    }

    const result = await pool.query(
      "UPDATE sectores SET nombre = $1 WHERE id = $2 RETURNING *",
      [nombre, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Sector no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al actualizar sector:", err);
    res.status(500).json({ msg: "Error al actualizar sector" });
  }
});

// Eliminar sector (solo admin)
router.delete("/:id", authenticateToken, requireRole("admin"), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM sectores WHERE id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Sector no encontrado" });
    }

    res.json({ msg: "Sector eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar sector:", err);
    res.status(500).json({ msg: "Error al eliminar sector" });
  }
});


// =======================
// 🔹 ARCHIVOS DE SECTOR
// =======================

// Subir archivo a un sector (solo admin)
router.post(
  "/:id/archivos",
  authenticateToken,
  requireRole("admin"),
  upload.single("archivo"),
  async (req, res) => {
    const { id } = req.params;
    const archivo = req.file;

    if (!archivo) {
      return res.status(400).json({ msg: "No se subió ningún archivo" });
    }

    try {
      const query = `
        INSERT INTO archivos_sector (sector_id, filename, originalname, mimetype, path)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`;
      const values = [
        id,
        archivo.filename,
        archivo.originalname,
        archivo.mimetype,
        archivo.path,
      ];

      const result = await pool.query(query, values);
      res.json({ msg: "Archivo subido exitosamente", archivo: result.rows[0] });
    } catch (err) {
      console.error("Error al subir archivo:", err);
      res.status(500).json({ msg: "Error al subir archivo" });
    }
  }
);

// Obtener archivos de un sector (cualquier usuario autenticado)
router.get("/:id/archivos", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM archivos_sector WHERE sector_id = $1 ORDER BY uploaded_at DESC",
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener archivos:", err);
    res.status(500).json({ msg: "Error al obtener archivos" });
  }
});

module.exports = router;
