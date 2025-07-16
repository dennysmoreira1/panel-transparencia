const { pool } = require("../config/db");

/* ───────────────────────────────────────────┐
   🔹 1. LISTAR CONTRATOS CON NOMBRE DE OBRA
   └────────────────────────────────────────── */
const obtenerContratos = async (_req, res) => {
    try {
        const { rows } = await pool.query(
            `SELECT c.*, o.nombre AS obra_nombre
       FROM contratos c
       LEFT JOIN obras o ON c.obra_id = o.id
       ORDER BY c.id DESC`
        );
        res.json(rows);
    } catch (err) {
        console.error("Error al obtener contratos:", err);
        res.status(500).json({ msg: "Error al obtener contratos" });
    }
};

/* ───────────────────────────────────────────┐
   🔹 2. CREAR CONTRATO
   └────────────────────────────────────────── */
const crearContrato = async (req, res) => {
    const {
        numero_contrato,
        descripcion,
        monto,
        fecha_inicio,
        fecha_fin,
        estado,
        proveedor,
        obra_id,
    } = req.body;

    try {
        const { rows } = await pool.query(
            `INSERT INTO contratos
       (numero_contrato, descripcion, monto, fecha_inicio, fecha_fin, estado, proveedor, obra_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
            [numero_contrato, descripcion, monto, fecha_inicio, fecha_fin, estado, proveedor, obra_id]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error("Error al crear contrato:", err);
        if (err.code === '23505') { // Unique violation
            res.status(400).json({ msg: "El número de contrato ya existe" });
        } else {
            res.status(500).json({ msg: "Error al crear contrato" });
        }
    }
};

/* ───────────────────────────────────────────┐
   🔹 3. ACTUALIZAR CONTRATO
   └────────────────────────────────────────── */
const actualizarContrato = async (req, res) => {
    const { id } = req.params;
    const {
        numero_contrato,
        descripcion,
        monto,
        fecha_inicio,
        fecha_fin,
        estado,
        proveedor,
        obra_id,
    } = req.body;

    try {
        const { rows, rowCount } = await pool.query(
            `UPDATE contratos
       SET numero_contrato=$1, descripcion=$2, monto=$3,
           fecha_inicio=$4, fecha_fin=$5, estado=$6,
           proveedor=$7, obra_id=$8
       WHERE id=$9
       RETURNING *`,
            [numero_contrato, descripcion, monto, fecha_inicio, fecha_fin, estado, proveedor, obra_id, id]
        );

        if (rowCount === 0) return res.status(404).json({ msg: "Contrato no encontrado" });
        res.json(rows[0]);
    } catch (err) {
        console.error("Error al actualizar contrato:", err);
        if (err.code === '23505') {
            res.status(400).json({ msg: "El número de contrato ya existe" });
        } else {
            res.status(500).json({ msg: "Error al actualizar contrato" });
        }
    }
};

/* ───────────────────────────────────────────┐
   🔹 4. ELIMINAR CONTRATO
   └────────────────────────────────────────── */
const eliminarContrato = async (req, res) => {
    const { id } = req.params;

    try {
        const { rowCount } = await pool.query("DELETE FROM contratos WHERE id=$1", [id]);
        if (rowCount === 0) return res.status(404).json({ msg: "Contrato no encontrado" });
        res.json({ msg: "Contrato eliminado correctamente" });
    } catch (err) {
        console.error("Error al eliminar contrato:", err);
        res.status(500).json({ msg: "Error al eliminar contrato" });
    }
};

/* ───────────────────────────────────────────┐
   🔹 5. OBTENER CONTRATO POR ID
   └────────────────────────────────────────── */
const obtenerContratoPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const { rows } = await pool.query(
            `SELECT c.*, o.nombre AS obra_nombre
       FROM contratos c
       LEFT JOIN obras o ON c.obra_id = o.id
       WHERE c.id = $1`,
            [id]
        );

        if (rows.length === 0) return res.status(404).json({ msg: "Contrato no encontrado" });
        res.json(rows[0]);
    } catch (err) {
        console.error("Error al obtener contrato:", err);
        res.status(500).json({ msg: "Error al obtener contrato" });
    }
};

/* ───────────────────────────────────────────┐
   🔹 6. ESTADÍSTICAS DE CONTRATOS
   └────────────────────────────────────────── */
const obtenerEstadisticasContratos = async (_req, res) => {
    try {
        // Total de contratos
        const { rows: totalRows } = await pool.query("SELECT COUNT(*) as total FROM contratos");

        // Contratos por estado
        const { rows: estadoRows } = await pool.query(
            "SELECT estado, COUNT(*) as cantidad FROM contratos GROUP BY estado"
        );

        // Monto total de contratos
        const { rows: montoRows } = await pool.query(
            "SELECT SUM(monto) as monto_total FROM contratos WHERE estado != 'cancelado'"
        );

        // Contratos por año
        const { rows: anioRows } = await pool.query(
            `SELECT EXTRACT(YEAR FROM fecha_inicio) as anio, 
                    COUNT(*) as cantidad, 
                    SUM(monto) as monto_total
             FROM contratos 
             WHERE fecha_inicio IS NOT NULL
             GROUP BY EXTRACT(YEAR FROM fecha_inicio)
             ORDER BY anio DESC`
        );

        res.json({
            total: parseInt(totalRows[0].total),
            porEstado: estadoRows,
            montoTotal: parseFloat(montoRows[0].monto_total || 0),
            porAnio: anioRows
        });
    } catch (err) {
        console.error("Error al obtener estadísticas de contratos:", err);
        res.status(500).json({ msg: "Error al obtener estadísticas" });
    }
};

module.exports = {
    obtenerContratos,
    crearContrato,
    actualizarContrato,
    eliminarContrato,
    obtenerContratoPorId,
    obtenerEstadisticasContratos,
}; 