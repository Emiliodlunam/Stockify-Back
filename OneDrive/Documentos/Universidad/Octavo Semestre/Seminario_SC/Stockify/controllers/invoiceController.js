// controllers/invoiceController.js
const Invoice = require('../models/Invoice');
const orderModel = require('../models/Order');
const emailService = require('../utils/emailService');

exports.getAll = async (req, res) => {
  try {
    const invs = await Invoice.findAll();
    res.json(invs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar facturas' });
  }
};

exports.getByOrder = async (req, res) => {
  try {
    const inv = await Invoice.findByOrder(req.params.pedido_id);
    if (!inv) return res.status(404).json({ error: 'Factura no encontrada' });
    res.json(inv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener factura' });
  }
};

exports.create = async (req, res) => {
  try {
    const { pedido_id, ruta_pdf } = req.body;
    // Obtener pedido para calcular total
    const order = await orderModel.findById(pedido_id);
    if (!order) return res.status(404).json({ error: 'Pedido no existe' });

    const inv = await Invoice.create({
      pedido_id,
      total: order.total,
      ruta_pdf
    });

    // Enviar correo al cliente
    await emailService.sendInvoiceEmail(order.cliente_id, inv);

    res.status(201).json(inv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear factura' });
  }
};
