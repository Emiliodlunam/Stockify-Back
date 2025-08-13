// models/Product.js
const pool = require('../config/db');

class Product {
  static async create({ sku, tipo, peso, ancho, largo=null, calibre }) {
    const [result] = await pool.query(
      `INSERT INTO productos
       (sku, tipo, peso, ancho, largo, calibre)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [sku, tipo, peso, ancho, largo, calibre]
    );
    return { id: result.insertId, sku, tipo, peso, ancho, largo, calibre };
  }

  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM productos');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, { peso, ancho, largo=null, calibre }) {
    await pool.query(
      `UPDATE productos 
       SET peso = ?, ancho = ?, largo = ?, calibre = ? 
       WHERE id = ?`,
      [peso, ancho, largo, calibre, id]
    );
    return { id, peso, ancho, largo, calibre };
  }

  static async delete(id) {
    await pool.query('DELETE FROM productos WHERE id = ?', [id]);
    return;
  }
}

module.exports = Product;
