// models/MateriaPrima.js
const pool = require('../config/db');

class MateriaPrima {
  static async create({ descripcion, kg_disponibles }) {
    const [result] = await pool.query(
      'INSERT INTO materia_prima (descripcion, kg_disponibles) VALUES (?, ?)',
      [descripcion, kg_disponibles]
    );
    return { id: result.insertId, descripcion, kg_disponibles };
  }

  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM materia_prima');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM materia_prima WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async update(id, { descripcion, kg_disponibles }) {
    await pool.query(
      'UPDATE materia_prima SET descripcion = ?, kg_disponibles = ? WHERE id = ?',
      [descripcion, kg_disponibles, id]
    );
    return { id, descripcion, kg_disponibles };
  }

  static async delete(id) {
    await pool.query('DELETE FROM materia_prima WHERE id = ?', [id]);
  }
}

module.exports = MateriaPrima;
