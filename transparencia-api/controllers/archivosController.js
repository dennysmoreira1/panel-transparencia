const path = require("path");
const fs = require("fs");
const pool = require("../config/db");

// ➕ Listar archivos por obra
exports.listarArchivos = async (req, res) => {
    const { obraId } = req.params;
    const result = await pool.query(
        "SELECT id, nombre_original, tamaño, creado_en FROM archivos WHERE obra_id = $1 ORDER BY creado_en DESC",
        [obraId]
    );
    res.json(result.rows);
};

// ➕ Subir archivo (req.file viene de multer)
exports.subirArchivo = async (req, res) => {
    const { obraId } = req.params;
    const { originalname, filename, mimetype, size } = req.file;

    const result = await pool.query(
        `INSERT INTO archivos (nombre_original, nombre_guardado, tipo, tamaño, obra_id)
     VALUES ($1,$2,$3,$4,$5) RETURNING id, nombre_original, tamaño, creado_en`,
        [originalname, filename, mimetype, size, obraId]
    );

    res.status(201).json(result.rows[0]);
};

// ➕ Descargar
exports.descargarArchivo = async (req, res) => {
    const { obraId, archivoId } = req.params;
    const result = await pool.query(
        "SELECT nombre_original, nombre_guardado FROM archivos WHERE id=$1 AND obra_id=$2",
        [archivoId, obraId]
    );
    if (!result.rowCount) return res.status(404).json({ error: "No existe" });

    const { nombre_original, nombre_guardado } = result.rows[0];
    const filePath = path.join(__dirname, "..", "uploads", "obras", obraId, nombre_guardado);
    res.download(filePath, nombre_original);
};

// ➕ Eliminar
exports.eliminarArchivo = async (req, res) => {
    const { obraId, archivoId } = req.params;
    const result = await pool.query(
        "DELETE FROM archivos WHERE id=$1 AND obra_id=$2 RETURNING nombre_guardado",
        [archivoId, obraId]
    );
    if (!result.rowCount) return res.status(404).json({ error: "No existe" });

    const filePath = path.join(
        __dirname,
        "..",
        "uploads",
        "obras",
        obraId,
        result.rows[0].nombre_guardado
    );
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({ message: "Archivo eliminado" });
};
