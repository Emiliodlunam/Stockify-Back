// models/Order.js
const pool = require('../config/db');

class Order {
  // Crea el Pedido y retorna { id, cliente_id, usuario_id, estado, total }
  static async create({ cliente_id, usuario_id, estado, total }) {
    const [result] = await pool.query(
      `INSERT INTO pedidos (cliente_id, usuario_id, estado, total)
       VALUES (?, ?, ?, ?)`,
      [cliente_id, usuario_id, estado, total]
    );
    return { id: result.insertId, cliente_id, usuario_id, estado, total };
  }

  // Agrega un ítem al pedido
  static async addItem(pedido_id, { producto_id, cantidad, precio_unitario }) {
    await pool.query(
      `INSERT INTO pedido_producto
       (pedido_id, producto_id, cantidad, precio_unitario)
       VALUES (?, ?, ?, ?)`,
      [pedido_id, producto_id, cantidad, precio_unitario]
    );
  }

  // Devuelve todos los pedidos (sin items)
  static async findAll() {
    const [rows] = await pool.query(
      `SELECT p.*, c.nombre AS cliente, u.nombre AS vendedor
       FROM pedidos p
       JOIN clientes c ON p.cliente_id = c.id
       JOIN usuarios u ON p.usuario_id = u.id
       ORDER BY p.fecha DESC`
    );
    return rows;
  }

  // Devuelve un pedido con sus items
  static async findById(id) {
    const [[order]] = await pool.query(
      `SELECT p.*, c.nombre AS cliente, u.nombre AS vendedor
       FROM pedidos p
       JOIN clientes c ON p.cliente_id = c.id
       JOIN usuarios u ON p.usuario_id = u.id
       WHERE p.id = ?`,
      [id]
    );
    if (!order) return null;
    const [items] = await pool.query(
      `SELECT pp.producto_id, pr.sku, pr.tipo, pp.cantidad, pp.precio_unitario
       FROM pedido_producto pp
       JOIN productos pr ON pp.producto_id = pr.id
       WHERE pp.pedido_id = ?`,
      [id]
    );
    order.items = items;
    return order;
  }

  static async updateState(id, estado) {
    await pool.query(
      `UPDATE pedidos SET estado = ? WHERE id = ?`,
      [estado, id]
    );
    return;
  }

  static async delete(id) {
    await pool.query(`DELETE FROM pedidos WHERE id = ?`, [id]);
  }
}

module.exports = Order;
