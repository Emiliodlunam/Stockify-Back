// controllers/alertController.js
const Alert = require('../models/Alert');
const pool  = require('../config/db');

exports.getActive = async (req, res) => {
  try {
    const alerts = await Alert.findAllActive();
    // Añadimos stock actual y flag low_stock
    await Promise.all(alerts.map(async alert => {
      const [[{ cantidad }]] = await pool.query(
        'SELECT cantidad FROM productos WHERE id = ?',
        [alert.producto_id]
      );
      alert.stock_actual = cantidad;
      alert.low_stock    = cantidad <= alert.nivel_minimo;
    }));
    res.json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener alertas' });
  }
};

exports.create = async (req, res) => {
  try {
    const { producto_id, nivel_minimo } = req.body;
    const alert = await Alert.create({ producto_id, nivel_minimo });
    res.status(201).json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear alerta' });
  }
};

exports.deactivate = async (req, res) => {
  try {
    await Alert.deactivate(req.params.id);
    res.json({ message: 'Alerta desactivada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al desactivar alerta' });
  }
};
