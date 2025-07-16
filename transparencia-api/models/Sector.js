const { Pool } = require("../config/db");
const pool = new Pool(); // Solo si no lo estás reutilizando

module.exports = {
    async getAll() {
        const result = await pool.query("SELECT * FROM sectores ORDER BY id ASC");
        return result.rows;
    },

    async getById(id) {
        const result = await pool.query("SELECT * FROM sectores WHERE id = $1", [id]);
        return result.rows[0];
    },

    async create(nombre) {
        const result = await pool.query(
            "INSERT INTO sectores (nombre) VALUES ($1) RETURNING *",
            [nombre]
        );
        return result.rows[0];
    },

    async update(id, nombre) {
        const result = await pool.query(
            "UPDATE sectores SET nombre = $1 WHERE id = $2 RETURNING *",
            [nombre, id]
        );
        return result.rows[0];
    },

    async delete(id) {
        await pool.query("DELETE FROM sectores WHERE id = $1", [id]);
    },
};
