const { pool } = require("../config/db");

exports.getEstadisticas = async (req, res) => {
  try {
    // Estadísticas básicas
    const totalObras = await pool.query("SELECT COUNT(*) FROM obras");
    const totalUsuarios = await pool.query("SELECT COUNT(*) FROM usuarios");
    const totalSectores = await pool.query("SELECT COUNT(*) FROM sectores");
    const totalContratos = await pool.query("SELECT COUNT(*) FROM contratos");
    const totalPresupuestos = await pool.query("SELECT COUNT(*) FROM presupuestos");

    // Obras por estado
    const obrasPorEstado = await pool.query(`
            SELECT estado, COUNT(*) as cantidad 
            FROM obras GROUP BY estado
        `);

    // Obras por sector
    const obrasPorSector = await pool.query(`
            SELECT s.nombre, COUNT(o.id) as cantidad
            FROM sectores s
            LEFT JOIN obras o ON s.id = o.sector_id
            GROUP BY s.id, s.nombre
            ORDER BY cantidad DESC
        `);

    // Presupuesto por año
    const presupuestoPorAnio = await pool.query(`
            SELECT anio, monto_total
            FROM presupuestos
            ORDER BY anio ASC
        `);

    // Monto total de obras
    const montoTotalObras = await pool.query(`
            SELECT SUM(presupuesto) as monto_total
            FROM obras
            WHERE presupuesto IS NOT NULL
        `);

    // Contratos por estado
    const contratosPorEstado = await pool.query(`
            SELECT estado, COUNT(*) as cantidad
            FROM contratos
            GROUP BY estado
        `);

    // Obras por mes (últimos 12 meses)
    const obrasPorMes = await pool.query(`
            SELECT 
                TO_CHAR(fecha_inicio, 'YYYY-MM') as mes, 
                COUNT(*) as cantidad 
            FROM obras 
            WHERE fecha_inicio >= CURRENT_DATE - INTERVAL '12 months'
            GROUP BY mes 
            ORDER BY mes
        `);

    // Top 5 obras por presupuesto
    const topObras = await pool.query(`
            SELECT nombre, presupuesto, estado
            FROM obras
            WHERE presupuesto IS NOT NULL
            ORDER BY presupuesto DESC
            LIMIT 5
        `);

    // Estadísticas de contratos
    const estadisticasContratos = await pool.query(`
            SELECT 
                COUNT(*) as total_contratos,
                SUM(monto) as monto_total,
                AVG(monto) as monto_promedio
            FROM contratos
            WHERE estado != 'cancelado'
        `);

    res.json({
      // Totales
      totalObras: parseInt(totalObras.rows[0].count),
      totalUsuarios: parseInt(totalUsuarios.rows[0].count),
      totalSectores: parseInt(totalSectores.rows[0].count),
      totalContratos: parseInt(totalContratos.rows[0].count),
      totalPresupuestos: parseInt(totalPresupuestos.rows[0].count),

      // Distribuciones
      obrasPorEstado: obrasPorEstado.rows,
      obrasPorSector: obrasPorSector.rows,
      contratosPorEstado: contratosPorEstado.rows,

      // Presupuestos
      presupuestoPorAnio: presupuestoPorAnio.rows,
      montoTotalObras: parseFloat(montoTotalObras.rows[0].monto_total || 0),

      // Series temporales
      obrasPorMes: obrasPorMes.rows,

      // Rankings
      topObras: topObras.rows,

      // Estadísticas de contratos
      estadisticasContratos: {
        total: parseInt(estadisticasContratos.rows[0].total_contratos),
        montoTotal: parseFloat(estadisticasContratos.rows[0].monto_total || 0),
        montoPromedio: parseFloat(estadisticasContratos.rows[0].monto_promedio || 0)
      }
    });
  } catch (error) {
    console.error("Error en estadísticas:", error);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
};

// Obtener estadísticas específicas para el dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    // Obras en progreso
    const obrasEnProgreso = await pool.query(`
            SELECT COUNT(*) as cantidad
            FROM obras
            WHERE estado = 'en_progreso'
        `);

    // Contratos activos
    const contratosActivos = await pool.query(`
            SELECT COUNT(*) as cantidad
            FROM contratos
            WHERE estado = 'activo'
        `);

    // Presupuesto del año actual
    const presupuestoActual = await pool.query(`
            SELECT monto_total
            FROM presupuestos
            WHERE anio = EXTRACT(YEAR FROM CURRENT_DATE)
        `);

    // Obras completadas este año
    const obrasCompletadas = await pool.query(`
            SELECT COUNT(*) as cantidad
            FROM obras
            WHERE estado = 'completada' 
            AND EXTRACT(YEAR FROM fecha_fin) = EXTRACT(YEAR FROM CURRENT_DATE)
        `);

    res.json({
      obrasEnProgreso: parseInt(obrasEnProgreso.rows[0].cantidad),
      contratosActivos: parseInt(contratosActivos.rows[0].cantidad),
      presupuestoActual: parseFloat(presupuestoActual.rows[0]?.monto_total || 0),
      obrasCompletadas: parseInt(obrasCompletadas.rows[0].cantidad)
    });
  } catch (error) {
    console.error("Error en dashboard stats:", error);
    res.status(500).json({ error: "Error al obtener estadísticas del dashboard" });
  }
};
