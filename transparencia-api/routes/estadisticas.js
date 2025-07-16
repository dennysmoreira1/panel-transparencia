const express = require("express");
const router = express.Router();
const { getEstadisticas, getDashboardStats } = require("../controllers/estadisticasController");

// GET /api/estadisticas - Obtener todas las estadísticas
router.get("/", getEstadisticas);

// GET /api/estadisticas/dashboard - Obtener estadísticas del dashboard
router.get("/dashboard", getDashboardStats);

module.exports = router;
