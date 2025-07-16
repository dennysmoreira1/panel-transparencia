// upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Carpeta donde se guardan los archivos
const UPLOADS_DIR =
    process.env.UPLOADS_DIR || path.join(__dirname, "..", "uploads");

// Crear carpeta si no existe
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

/* ───────────────────────────────────────────
   Configuración de Multer
─────────────────────────────────────────── */
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),

    filename: (_req, file, cb) => {
        // Reemplazar espacios y caracteres no alfanuméricos
        const safeName = file.originalname
            .replace(/\s+/g, "_")          // espacios → _
            .replace(/[^\w.\-]/g, "")      // otros → ''
            .toLowerCase();

        const ext = path.extname(safeName);
        const base = path.basename(safeName, ext);

        cb(null, `${base}-${Date.now()}${ext}`);
    },
});

/* ───────────────────────────────────────────
   Filtros y límites
─────────────────────────────────────────── */
const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    // Word / Excel
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const fileFilter = (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Tipo de archivo no permitido"), false);
};

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter,
});

module.exports = upload;
