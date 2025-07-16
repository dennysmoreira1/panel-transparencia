const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ------------------------------  CORS  ------------------------------ */
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://marvelous-crepe-5b3818.netlify.app" // <--- Agregado tu dominio de Netlify
];

app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

/* ---------------------------  Middlewares  -------------------------- */
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* --------------  Conexión Sequelize (solo para Usuario) -------------- */
const { sequelize } = require("./config/db");
require("./models/Usuario"); // Agrega otros modelos Sequelize aquí si los usas

/* --------------------------  Archivos estáticos --------------------- */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/exports", express.static(path.join(__dirname, "exports")));

/* ---------------------  Middleware de autenticación ------------------ */
const { authenticateToken } = require("./middlewares/authMiddleware");

/* ------------------------------  Rutas ------------------------------ */
const authRoutes = require("./routes/auth");
const usuariosRoutes = require("./routes/usuarios");
const presupuestoRoutes = require("./routes/presupuesto");
const obrasRoutes = require("./routes/obras");
const sectoresRoutes = require("./routes/sectores");
const estadisticasRoutes = require("./routes/estadisticas");
const contratosRoutes = require("./routes/contratos"); // ➕ NUEVO

/* ------------------------------  Endpoints -------------------------- */
app.get("/", (req, res) => {
    res.send("<h1>Bienvenido a la API de Transparencia</h1>");
});

app.get("/api/test", authenticateToken, (req, res) => {
    res.json({
        msg: "Token válido",
        user: req.user,
    });
});

/* ---------------------------  API principales ----------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", authenticateToken, usuariosRoutes);
app.use("/api/presupuesto", authenticateToken, presupuestoRoutes);
app.use("/api/obras", authenticateToken, obrasRoutes);
app.use("/api/sectores", authenticateToken, sectoresRoutes);
app.use("/api/estadisticas", authenticateToken, estadisticasRoutes);
app.use("/api/contratos", authenticateToken, contratosRoutes); // ➕ NUEVO

/* -----------------------  Estadísticas simuladas -------------------- */
app.get("/api/estadisticas", authenticateToken, (req, res) => {
    const estadisticas = {
        presupuestoPorAnio: [
            { year: "2020", monto: 320000 },
            { year: "2021", monto: 380000 },
            { year: "2022", monto: 450000 },
            { year: "2023", monto: 520000 },
            { year: "2024", monto: 610000 },
        ],
        obrasPorSector: [
            { name: "Educación", value: 14 },
            { name: "Salud", value: 9 },
            { name: "Infraestructura", value: 17 },
            { name: "Agua y saneamiento", value: 6 },
            { name: "Transporte", value: 5 },
        ],
    };
    res.json(estadisticas);
});

/* -----------------------  Descargar Excel demo ---------------------- */
app.get("/api/descargar/excel", authenticateToken, (req, res) => {
    const filePath = path.join(__dirname, "exports", "ejemplo.xlsx");
    res.download(filePath);
});

/* ------------------  Middleware 404 y de errores -------------------- */
const errorHandler = require("./middlewares/errorMiddleware");

app.use((req, res, next) => {
    res.status(404).json({ message: "Ruta no encontrada" });
});
app.use(errorHandler);

/* --------------------------  Iniciar servidor ----------------------- */
app.listen(PORT, async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync(); // si usas Sequelize solo para usuarios
        console.log("✅ Conexión establecida con PostgreSQL");
    } catch (error) {
        console.error("❌ Error al conectar con la base de datos:", error.message);
    }

    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});