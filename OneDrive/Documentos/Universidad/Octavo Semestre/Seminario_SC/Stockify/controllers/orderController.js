// controllers/orderController.js
const Order = require('../models/Order');

exports.getAll = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

exports.getById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener pedido' });
  }
};

exports.create = async (req, res) => {
  try {
    const { cliente_id, usuario_id, items, total } = req.body;
    // Calcula peso total para estado "especial"
    const totalKg = items.reduce((sum, it) => sum + it.cantidad, 0);
    const estado = totalKg >= 100 ? 'especial' : 'pendiente';

    // 1) Crear pedido
    const order = await Order.create({ cliente_id, usuario_id, estado, total });

    // 2) Agregar items
    for (const it of items) {
      await Order.addItem(order.id, it);
    }

    res.status(201).json({ ...order, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear pedido' });
  }
};

exports.updateState = async (req, res) => {
  try {
    const { estado } = req.body;
    await Order.updateState(req.params.id, estado);
    res.json({ message: 'Estado actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
};

exports.delete = async (req, res) => {
  try {
    await Order.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar pedido' });
  }
};

exports.getSpecial = async (req, res) => {
  try {
    const orders = await Order.findAll();
    const special = orders.filter(o => o.estado === 'especial');
    res.json(special);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener pedidos especiales' });
  }
};