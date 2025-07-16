const pool = require('../config/db');

async function guardarArchivo({ obraId, nombreOriginal, nombreServidor, mimetype }) {
    const result = await pool.query(
        'INSERT INTO archivos (obra_id, nombre_original, nombre_servidor, tipo_mime) VALUES ($1, $2, $3, $4) RETURNING *',
        [obraId, nombreOriginal, nombreServidor, mimetype]
    );
    return result.rows[0];
}

async function obtenerArchivosPorObra(obraId) {
    const result = await pool.query(
        'SELECT * FROM archivos WHERE obra_id = $1 ORDER BY id DESC',
        [obraId]
    );
    return result.rows;
}

module.exports = { guardarArchivo, obtenerArchivosPorObra };
