// models/User.js
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async create({ nombre, email, password, role_id }) {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, role_id) VALUES (?, ?, ?, ?)',
      [nombre, email, hash, role_id]
    );
    return { id: result.insertId, nombre, email, role_id };
  }

  static async findAll() {
    const [rows] = await pool.query(
      `SELECT u.id, u.nombre, u.email, r.nombre AS rol
       FROM usuarios u
       JOIN roles r ON u.role_id = r.id`
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query(
      `SELECT u.id, u.nombre, u.email, r.nombre AS rol
       FROM usuarios u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async update(id, { nombre, email, role_id }) {
    await pool.query(
      'UPDATE usuarios SET nombre = ?, email = ?, role_id = ? WHERE id = ?',
      [nombre, email, role_id, id]
    );
    return { id, nombre, email, role_id };
  }

  static async delete(id) {
    await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
    return;
  }
}

module.exports = User;
