// controllers/reportController.js
const pool = require('../config/db');

exports.weekly = async (req, res) => {
  try {
    // Calcula la semana actual (lunes a sábado)
    // MySQL WEEK(...,1): semanas con lunes como primer día
    // Obtenemos año/semana actual
    const [[{ year_week }]] = await pool.query(
      `SELECT YEARWEEK(CURDATE(),1) AS year_week`
    );

    // 1) Kilos producidos
    const [[{ kilos_producidos }]] = await pool.query(
      `SELECT IFNULL(SUM(cantidad),0) AS kilos_producidos
       FROM produccion
       WHERE YEARWEEK(created_at,1)=?`,
      [year_week]
    );

    // 2) Scrap porcentaje (suponiendo scrap_kg en tabla produccion)
    const [[{ total_scrap }]] = await pool.query(
      `SELECT IFNULL(SUM(scrap_kg),0) AS total_scrap
       FROM produccion
       WHERE YEARWEEK(created_at,1)=?`,
      [year_week]
    );
    const scrap_percentage = kilos_producidos
      ? Number(((total_scrap / (kilos_producidos + total_scrap)) * 100).toFixed(2))
      : 0;

    // 3) Ingresos
    const [[{ total_ingresos }]] = await pool.query(
      `SELECT IFNULL(SUM(monto),0) AS total_ingresos
       FROM transacciones
       WHERE tipo='ingreso' AND YEARWEEK(fecha,1)=?`,
      [year_week]
    );

    // 4) Gastos
    const [[{ total_gastos }]] = await pool.query(
      `SELECT IFNULL(SUM(monto),0) AS total_gastos
       FROM transacciones
       WHERE tipo='gasto' AND YEARWEEK(fecha,1)=?`,
      [year_week]
    );

    res.json({
      semana: year_week,
      kilos_producidos,
      scrap_percentage,
      total_ingresos,
      total_gastos
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al generar reporte semanal' });
  }
};
