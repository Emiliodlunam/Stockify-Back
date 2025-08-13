// controllers/movimientoInventarioController.js
const MovimientoInventario = require('../models/MovimientoInventario');

exports.getAll = async (req, res) => {
  try {
    const movs = await MovimientoInventario.findAll();
    res.json(movs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener movimientos' });
  }
};

exports.getById = async (req, res) => {
  try {
    const mov = await MovimientoInventario.findById(req.params.id);
    if (!mov) return res.status(404).json({ error: 'Movimiento no encontrado' });
    res.json(mov);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener movimiento' });
  }
};

exports.getByProduct = async (req, res) => {
  try {
    const movs = await MovimientoInventario.findByProduct(req.params.producto_id);
    res.json(movs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener movimientos del producto' });
  }
};

exports.create = async (req, res) => {
  try {
    const { producto_id, tipo, cantidad, usuario_id, comentario } = req.body;
    const mov = await MovimientoInventario.create({ producto_id, tipo, cantidad, usuario_id, comentario });
    res.status(201).json(mov);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear movimiento' });
  }
};
