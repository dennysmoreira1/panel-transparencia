// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ───────────────────────────────────────────
   1. Verifica JWT en header "Authorization" o cookie "token"
─────────────────────────────────────────── */
function authenticateToken(req, res, next) {
    // 1) Intenta en header: Authorization: Bearer <token>
    const authHeader = req.headers["authorization"];
    const tokenHeader = authHeader?.split(" ")[1];

    // 2) Intenta en cookie
    const tokenCookie = req.cookies?.token;

    const token = tokenHeader || tokenCookie;

    if (!token) return res.status(401).json({ msg: "Token no proporcionado" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ msg: "Token inválido o expirado" });

        /* decoded debería contener { id, rol, ... } */
        req.user = { id: decoded.id, rol: decoded.rol };
        next();
    });
}

/* ───────────────────────────────────────────
   2. Middleware de autorización por roles
      Ejemplo: router.post("/ruta", requireRole("admin"), ...)
─────────────────────────────────────────── */
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user)
            return res.status(401).json({ msg: "No autenticado" });

        if (!roles.includes(req.user.rol))
            return res.status(403).json({ msg: "Acceso denegado" });

        next();
    };
}

module.exports = { authenticateToken, requireRole };
