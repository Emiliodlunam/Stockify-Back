// controllers/dashboardController.js
const pool = require('../config/db');

exports.dashboard = async (req, res) => {
  try {
    // Semana actual (lunes-sábado)
    const [[{ year_week }]] = await pool.query(
      `SELECT YEARWEEK(CURDATE(),1) AS year_week`
    );

    // 1) Low stock count
    const [[{ low_stock_count }]] = await pool.query(
      `SELECT COUNT(*) AS low_stock_count
       FROM alertas_inventario a
       JOIN productos p ON a.producto_id = p.id
       WHERE a.activo = 1
         AND p.cantidad <= a.nivel_minimo`
    );

    // 2) Pedidos esta semana
    const [[{ pedidos_week }]] = await pool.query(
      `SELECT COUNT(*) AS pedidos_week
       FROM pedidos
       WHERE YEARWEEK(fecha,1) = ?`,
      [year_week]
    );

    // 3) Producción esta semana
    const [[{ produccion_week }]] = await pool.query(
      `SELECT COUNT(*) AS produccion_week
       FROM produccion
       WHERE YEARWEEK(created_at,1) = ?`,
      [year_week]
    );

    // 4) Ingresos y gastos
    const [[{ total_ingresos }]] = await pool.query(
      `SELECT IFNULL(SUM(monto),0) AS total_ingresos
       FROM transacciones
       WHERE tipo='ingreso'
         AND YEARWEEK(fecha,1) = ?`,
      [year_week]
    );
    const [[{ total_gastos }]] = await pool.query(
      `SELECT IFNULL(SUM(monto),0) AS total_gastos
       FROM transacciones
       WHERE tipo='gasto'
         AND YEARWEEK(fecha,1) = ?`,
      [year_week]
    );

    res.json({
      week: year_week,
      low_stock_count,
      pedidos_week,
      produccion_week,
      total_ingresos,
      total_gastos
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al generar dashboard' });
  }
};
