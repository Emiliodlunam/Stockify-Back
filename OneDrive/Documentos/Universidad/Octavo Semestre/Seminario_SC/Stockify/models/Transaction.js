// models/Transaction.js
const pool = require('../config/db');

class Transaction {
  static async create({ tipo, categoria, descripcion, monto, usuario_id }) {
    const [result] = await pool.query(
      `INSERT INTO transacciones
       (tipo, categoria, descripcion, monto, fecha, usuario_id)
       VALUES (?, ?, ?, ?, NOW(), ?)`,
      [tipo, categoria, descripcion, monto, usuario_id]
    );
    return { id: result.insertId, tipo, categoria, descripcion, monto, usuario_id, fecha: new Date() };
  }

  static async findAll() {
    const [rows] = await pool.query(
      `SELECT t.*, u.nombre AS usuario
       FROM transacciones t
       LEFT JOIN usuarios u ON t.usuario_id = u.id
       ORDER BY t.fecha DESC`
    );
    return rows;
  }
}

module.exports = Transaction;
