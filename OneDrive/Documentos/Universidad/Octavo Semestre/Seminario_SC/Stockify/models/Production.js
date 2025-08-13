// models/Production.js
const pool = require('../config/db');

class Production {
  // Crea un registro de producción
  static async create({ pedido_id, cantidad, usuario_id }) {
    const [result] = await pool.query(
      `INSERT INTO produccion
       (pedido_id, cantidad, estado, usuario_id)
       VALUES (?, ?, 'planificado', ?)`,
      [pedido_id, cantidad, usuario_id]
    );
    return { id: result.insertId, pedido_id, cantidad, estado: 'planificado', usuario_id };
  }

  static async findAll() {
    const [rows] = await pool.query(
      `SELECT pr.*, u.nombre AS operador, p.cliente_id
       FROM produccion pr
       LEFT JOIN usuarios u ON pr.usuario_id = u.id
       LEFT JOIN pedidos p ON pr.pedido_id = p.id
       ORDER BY pr.created_at DESC`
    );
    return rows;
  }

  static async findById(id) {
    const [[rec]] = await pool.query(
      `SELECT * FROM produccion WHERE id = ?`,
      [id]
    );
    return rec || null;
  }

  static async update(id, { estado, fecha_inicio, fecha_fin }) {
    const fields = [];
    const params = [];
    if (estado) {
      fields.push('estado = ?');
      params.push(estado);
    }
    if (fecha_inicio) {
      fields.push('fecha_inicio = ?');
      params.push(fecha_inicio);
    }
    if (fecha_fin) {
      fields.push('fecha_fin = ?');
      params.push(fecha_fin);
    }
    if (!fields.length) return;
    params.push(id);
    await pool.query(
      `UPDATE produccion SET ${fields.join(', ')} WHERE id = ?`,
      params
    );
  }

  static async delete(id) {
    await pool.query(`DELETE FROM produccion WHERE id = ?`, [id]);
  }
}

module.exports = Production;
