// models/Alert.js
const pool = require('../config/db');

class Alert {
  static async findAllActive() {
    const [rows] = await pool.query(
      `SELECT a.id, a.producto_id, p.sku, p.tipo, a.nivel_minimo
       FROM alertas_inventario a
       JOIN productos p ON a.producto_id = p.id
       WHERE a.activo = 1`
    );
    return rows;
  }

  static async create({ producto_id, nivel_minimo }) {
    const [result] = await pool.query(
      `INSERT INTO alertas_inventario (producto_id, nivel_minimo, activo)
       VALUES (?, ?, 1)`,
      [producto_id, nivel_minimo]
    );
    return { id: result.insertId, producto_id, nivel_minimo, activo: true };
  }

  static async deactivate(id) {
    await pool.query(
      `UPDATE alertas_inventario SET activo = 0 WHERE id = ?`,
      [id]
    );
  }
}

module.exports = Alert;
