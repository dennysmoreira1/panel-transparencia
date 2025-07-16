// routes/usuarios.js
const express = require("express");
const router = express.Router();
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const { authenticateToken, requireRole } = require("../middlewares/authMiddleware");

// Obtener todos los usuarios
router.get("/", authenticateToken, requireRole("admin", "editor"), async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: { exclude: ["password"] },
            order: [["id", "ASC"]],
        });
        res.json(usuarios);
    } catch (err) {
        console.error("Error al obtener usuarios:", err);
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
});

// Crear nuevo usuario
router.post("/", authenticateToken, requireRole("admin"), async (req, res) => {
    const { username, email, password, rol } = req.body;

    if (!username || !email || !password || !rol) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevoUsuario = await Usuario.create({
            username,
            email,
            password: hashedPassword,
            rol,
        });

        const { password: _, ...usuarioSinPassword } = nuevoUsuario.toJSON();
        res.status(201).json(usuarioSinPassword);
    } catch (err) {
        console.error("Error al crear usuario:", err);
        res.status(500).json({ error: "Error al crear usuario" });
    }
});

// Editar usuario
router.put("/:id", authenticateToken, requireRole("admin"), async (req, res) => {
    const { id } = req.params;
    const { username, email, rol } = req.body;

    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        usuario.username = username;
        usuario.email = email;
        usuario.rol = rol;

        await usuario.save();

        const { password: _, ...usuarioSinPassword } = usuario.toJSON();
        res.json(usuarioSinPassword);
    } catch (err) {
        console.error("Error al actualizar usuario:", err);
        res.status(500).json({ error: "Error al actualizar usuario" });
    }
});

// Eliminar usuario
router.delete("/:id", authenticateToken, requireRole("admin"), async (req, res) => {
    const { id } = req.params;

    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        await usuario.destroy();
        res.json({ mensaje: "Usuario eliminado correctamente" });
    } catch (err) {
        console.error("Error al eliminar usuario:", err);
        res.status(500).json({ error: "Error al eliminar usuario" });
    }
});

module.exports = router;
