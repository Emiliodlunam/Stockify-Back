// controllers/transactionController.js
const Transaction = require('../models/Transaction');

exports.getAll = async (req, res) => {
  try {
    const items = await Transaction.findAll();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener transacciones' });
  }
};

exports.create = async (req, res) => {
  try {
    const { tipo, categoria, descripcion, monto, usuario_id } = req.body;
    const tx = await Transaction.create({ tipo, categoria, descripcion, monto, usuario_id });
    res.status(201).json(tx);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear transacción' });
  }
};
