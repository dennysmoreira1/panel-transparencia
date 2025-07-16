const express = require("express");
const router = express.Router();
const { login, refreshToken, logout, getProfile, register } = require("../controllers/authController");
const { authenticateToken } = require("../middlewares/authMiddleware");

// Registro de usuario
router.post("/register", register);

// Login del usuario
router.post("/login", login);

// Refresh del token de acceso
router.post("/refresh", refreshToken);

// Logout del usuario
router.post("/logout", logout);

// Obtener perfil autenticado
router.get("/perfil", authenticateToken, getProfile);

module.exports = router;
