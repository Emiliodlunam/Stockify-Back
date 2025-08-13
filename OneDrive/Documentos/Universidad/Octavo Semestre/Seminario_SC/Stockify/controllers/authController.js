// controllers/authController.js
const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcryptjs');
const User     = require('../models/User');
const pool     = require('../config/db');
require('dotenv').config();

exports.register = async (req, res) => {
  try {
    const { nombre, email, password, role_id } = req.body;
    // Verificar si el email ya está en uso
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Email ya en uso' });
    }
    // Crear el usuario (hash de contraseña incluido)
    const user = await User.create({ nombre, email, password, role_id });
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Buscamos el usuario junto con su nombre de rol
    const [[user]] = await pool.query(
      `SELECT u.id, u.nombre, u.password, u.role_id, r.nombre AS rol
       FROM usuarios u
       JOIN roles r ON u.role_id = r.id
       WHERE u.email = ?`,
      [email]
    );
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    // Comparamos la contraseña
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    // Construimos el payload del token
    const payload = {
      id:      user.id,
      nombre:  user.nombre,
      role_id: user.role_id,
      rol:     user.rol
    };
    // Firmamos el JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
    // Respondemos con el token y los datos del usuario (sin la password)
    res.json({ token, user: payload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
