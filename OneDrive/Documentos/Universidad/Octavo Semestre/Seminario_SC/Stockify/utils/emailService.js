// utils/emailService.js
const nodemailer = require('nodemailer');
const pool = require('../config/db');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

/**
 * Envía la factura al cliente del pedido.
 * Asume que en tabla clientes hay email.
 */
async function sendInvoiceEmail(cliente_id, invoice) {
  // Obtener correo del cliente
  const [[{ email }]] = await pool.query(
    'SELECT email FROM clientes WHERE id = ?',
    [cliente_id]
  );
  if (!email) throw new Error('Cliente no tiene email');

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: `Factura Pedido #${invoice.pedido_id}`,
    text: `Adjunto tu factura. Total: $${invoice.total}`,
    attachments: [
      {
        filename: `Factura_${invoice.id}.pdf`,
        path: invoice.ruta_pdf
      }
    ]
  };
  await transporter.sendMail(mailOptions);
}

module.exports = { sendInvoiceEmail };
