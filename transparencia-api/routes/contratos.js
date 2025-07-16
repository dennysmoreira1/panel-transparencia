// routes/contratos.js
const express = require("express");
const router = express.Router();
const {
    obtenerContratos,
    crearContrato,
    actualizarContrato,
    eliminarContrato,
    obtenerContratoPorId,
    obtenerEstadisticasContratos,
} = require("../controllers/contratosController");

// GET /api/contratos - Obtener todos los contratos
router.get("/", obtenerContratos);

// GET /api/contratos/estadisticas - Obtener estadísticas de contratos
router.get("/estadisticas", obtenerEstadisticasContratos);

// GET /api/contratos/:id - Obtener contrato por ID
router.get("/:id", obtenerContratoPorId);

// POST /api/contratos - Crear nuevo contrato
router.post("/", crearContrato);

// PUT /api/contratos/:id - Actualizar contrato
router.put("/:id", actualizarContrato);

// DELETE /api/contratos/:id - Eliminar contrato
router.delete("/:id", eliminarContrato);

module.exports = router; 