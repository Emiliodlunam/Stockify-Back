// models/Invoice.js
const pool = require('../config/db');

class Invoice {
    static async create({ pedido_id, total, ruta_pdf }) {
        const [result] = await pool.query(
        `INSERT INTO facturas
        (pedido_id, fecha_emision, total, ruta_pdf)
        VALUES (?, NOW(), ?, ?)`,
        [pedido_id, total, ruta_pdf]
        );
        return { id: result.insertId, pedido_id, total, ruta_pdf };
    }

    static async findAll() {
        const [rows] = await pool.query(
        `SELECT f.*, p.cliente_id, p.usuario_id
        FROM facturas f
        JOIN pedidos p ON f.pedido_id = p.id
        ORDER BY f.fecha_emision DESC`
        );
        return rows;
    }

    static async findByOrder(pedido_id) {
        const [rows] = await pool.query(
        `SELECT * FROM facturas WHERE pedido_id = ?`,
        [pedido_id]
        );
        return rows[0] || null;
    }
}

module.exports = Invoice;
