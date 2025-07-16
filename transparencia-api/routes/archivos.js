const express = require("express");
const router = express.Router({ mergeParams: true });
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const {
    listarArchivos,
    subirArchivo,
    descargarArchivo,
    eliminarArchivo,
} = require("../controllers/archivosController");
const { authorizeRoles } = require("../middlewares/authMiddleware");

/* ---------- Multer con carpeta dinámica /uploads/obras/:obraId ---------- */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, "..", "uploads", "obras", req.params.obraId);
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

/* ------------------------ Endpoints ------------------------ */
router.get("/", listarArchivos); // GET /api/obras/:obraId/archivos
router.post("/", authorizeRoles("admin", "editor"), upload.single("file"), subirArchivo);
router.get("/:archivoId", descargarArchivo); // descarga
router.delete("/:archivoId", authorizeRoles("admin", "editor"), eliminarArchivo);

module.exports = router;
