// routes/obras.js
const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");
const obrasCtrl = require("../controllers/obrasController");

/* ───────────────────────────────────────────┐
   🔹 1. CRUD de Obras
   └────────────────────────────────────────── */
router.get("/", authenticateToken, obrasCtrl.obtenerObras);
router.post("/", authenticateToken, obrasCtrl.crearObra);
router.put("/:id", authenticateToken, obrasCtrl.actualizarObra);
router.delete("/:id", authenticateToken, obrasCtrl.eliminarObra);

/* ───────────────────────────────────────────┐
   🔹 2. Archivos por obra
   └────────────────────────────────────────── */
router.post(
  "/:obraId/archivos",
  authenticateToken,
  upload.single("archivo"),
  obrasCtrl.subirArchivo
);
router.get("/:obraId/archivos", authenticateToken, obrasCtrl.obtenerArchivos);

module.exports = router;
