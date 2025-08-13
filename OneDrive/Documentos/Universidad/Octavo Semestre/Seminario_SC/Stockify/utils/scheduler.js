// utils/scheduler.js
const cron = require('node-cron');
const pool = require('../config/db');
const emailService = require('./emailService');

/**
 * Tarea 1: Verificar alertas de inventario cada hora
 */
cron.schedule('0 * * * *', async () => {
  try {
    const [alerts] = await pool.query(
      `SELECT a.*, p.nombre AS producto, p.cantidad
       FROM alertas_inventario a
       JOIN productos p ON a.producto_id = p.id
       WHERE a.activo = 1`
    );
    for (const a of alerts) {
      if (a.cantidad <= a.nivel_minimo) {
        // enviar alerta por correo al admin (role_id=1)
        const [[{ email }]] = await pool.query(
          `SELECT u.email
           FROM usuarios u
           WHERE u.role_id = 1 LIMIT 1`
        );
        await emailService.transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: email,
          subject: `Alerta de Stock: ${a.producto}`,
          text: `Stock bajo para ${a.producto}: ${a.cantidad} <= ${a.nivel_minimo}`
        });
      }
    }
  } catch (err) {
    console.error('Error en cron alertas:', err);
  }
});

/**
 * Tarea 2: Crear producción automática para pedidos confirmados pendientes cada día a las 6:00
 */
cron.schedule('0 6 * * *', async () => {
  try {
    const [pedidos] = await pool.query(
      `SELECT id, total
       FROM pedidos
       WHERE estado = 'confirmado'`
    );
    for (const p of pedidos) {
      // Insertar en produccion
      await pool.query(
        `INSERT INTO produccion
         (pedido_id, cantidad, estado, created_at)
         VALUES (?, ?, 'planificado', NOW())`,
        [p.id, p.total]
      );
    }
  } catch (err) {
    console.error('Error en cron producción automática:', err);
  }
});
