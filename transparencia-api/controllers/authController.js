const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
require('dotenv').config();

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Usuario.findOne({ where: { email } });
        if (!user) return res.status(401).json({ msg: "Credenciales incorrectas" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ msg: "Credenciales incorrectas" });

        const payload = { id: user.id, rol: user.rol };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

        // Configuración dinámica de la cookie según entorno
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true, // Siempre true en producción
            sameSite: 'none', // Siempre none para cross-domain
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
            // domain: isProduction ? undefined : "localhost"
        });

        res.json({
            success: true,
            accessToken,
            user: { id: user.id, nombre: user.username, email: user.email, rol: user.rol }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error al iniciar sesión" });
    }
};

const register = async (req, res) => {
    const { username, email, password, rol } = req.body;
    try {
        // Verificar si el usuario ya existe
        const existingUser = await Usuario.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ msg: "El correo electrónico ya está registrado" });
        }
        // Verificar si el username ya existe
        const existingUsername = await Usuario.findOne({ where: { username } });
        if (existingUsername) {
            return res.status(400).json({ msg: "El nombre de usuario ya está en uso" });
        }
        // Encriptar contraseña
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // Insertar nuevo usuario
        const newUser = await Usuario.create({ username, email, password: hashedPassword, rol });
        res.status(201).json({
            success: true,
            msg: "Usuario registrado exitosamente",
            user: {
                id: newUser.id,
                nombre: newUser.username,
                email: newUser.email,
                rol: newUser.rol
            }
        });
    } catch (err) {
        console.error('Error en registro:', err);
        res.status(500).json({ msg: "Error al registrar usuario" });
    }
};

const logout = async (req, res) => {
    res.clearCookie("refreshToken");
    res.json({ msg: "Sesión cerrada correctamente" });
};

const getProfile = async (req, res) => {
    try {
        const user = await Usuario.findByPk(req.user.id, {
            attributes: ['id', ['username', 'nombre'], 'email', 'rol']
        });
        if (!user) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }
        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error al obtener perfil" });
    }
};

const refreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ msg: "Token de actualización no encontrado" });
    jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, user) => {
        if (err) return res.status(403).json({ msg: "Token de actualización inválido" });
        const accessToken = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const usuario = await Usuario.findByPk(user.id, {
            attributes: ['id', ['username', 'nombre'], 'email', 'rol']
        });
        res.json({ accessToken, user: usuario });
    });
};

module.exports = {
    login,
    register,
    logout,
    getProfile,
    refreshToken
};
