// controllers/materiaPrimaController.js
const MateriaPrima = require('../models/MateriaPrima');

exports.getAll = async (req, res) => {
  try {
    const items = await MateriaPrima.findAll();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener materia prima' });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await MateriaPrima.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Materia prima no encontrada' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener materia prima' });
  }
};

exports.create = async (req, res) => {
  try {
    const { descripcion, kg_disponibles } = req.body;
    const newItem = await MateriaPrima.create({ descripcion, kg_disponibles });
    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear materia prima' });
  }
};

exports.update = async (req, res) => {
  try {
    const { descripcion, kg_disponibles } = req.body;
    const updated = await MateriaPrima.update(req.params.id, { descripcion, kg_disponibles });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar materia prima' });
  }
};

exports.delete = async (req, res) => {
  try {
    await MateriaPrima.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar materia prima' });
  }
};
