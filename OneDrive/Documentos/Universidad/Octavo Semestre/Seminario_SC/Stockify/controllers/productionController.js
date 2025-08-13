// controllers/productionController.js
const Production = require('../models/Production');

exports.getAll = async (req, res) => {
  try {
    const list = await Production.findAll();
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener producción' });
  }
};

exports.getById = async (req, res) => {
  try {
    const rec = await Production.findById(req.params.id);
    if (!rec) return res.status(404).json({ error: 'Registro no encontrado' });
    res.json(rec);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener producción' });
  }
};

exports.create = async (req, res) => {
  try {
    const { pedido_id, cantidad, usuario_id } = req.body;
    const rec = await Production.create({ pedido_id, cantidad, usuario_id });
    res.status(201).json(rec);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear producción' });
  }
};

exports.update = async (req, res) => {
  try {
    await Production.update(req.params.id, req.body);
    res.json({ message: 'Producción actualizada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar producción' });
  }
};

exports.delete = async (req, res) => {
  try {
    await Production.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar producción' });
  }
};
