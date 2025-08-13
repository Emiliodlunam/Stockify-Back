// models/MovimientoInventario.js
const pool = require('../config/db');

class MovimientoInventario {
  static async create({ producto_id, tipo, cantidad, usuario_id, comentario }) {
    const [result] = await pool.query(
      `INSERT INTO movimientos_inventario
       (producto_id, tipo, cantidad, fecha, usuario_id, comentario)
       VALUES (?, ?, ?, NOW(), ?, ?)`,
      [producto_id, tipo, cantidad, usuario_id, comentario]
    );
    return {
      id: result.insertId,
      producto_id, tipo, cantidad, usuario_id, comentario, fecha: new Date()
    };
  }

  static async findAll() {
    const [rows] = await pool.query(
      `SELECT mi.*, u.nombre AS usuario
       FROM movimientos_inventario mi
       LEFT JOIN usuarios u ON mi.usuario_id = u.id
       ORDER BY mi.fecha DESC`
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT mi.*, u.nombre AS usuario
       FROM movimientos_inventario mi
       LEFT JOIN usuarios u ON mi.usuario_id = u.id
       WHERE mi.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByProduct(producto_id) {
    const [rows] = await pool.query(
      `SELECT mi.*, u.nombre AS usuario
       FROM movimientos_inventario mi
       LEFT JOIN usuarios u ON mi.usuario_id = u.id
       WHERE mi.producto_id = ?
       ORDER BY mi.fecha DESC`,
      [producto_id]
    );
    return rows;
  }
}

module.exports = MovimientoInventario;
