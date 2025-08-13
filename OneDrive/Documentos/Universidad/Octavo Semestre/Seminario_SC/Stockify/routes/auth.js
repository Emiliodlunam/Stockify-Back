// routes/auth.js
const express    = require('express');
const { body }   = require('express-validator');
const authC      = require('../controllers/authController');
const validate   = require('../middleware/validate');

const router = express.Router();

router.post(
    '/register',
    [
        body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
        body('email').isEmail().withMessage('Debe ser un email válido'),
        body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres'),
        body('role_id').isInt().withMessage('role_id debe ser un entero'),
        validate
    ],
    authC.register
);

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Debe ser un email válido'),
        body('password').notEmpty().withMessage('La contraseña es obligatoria'),
        validate
    ],
    authC.login
);

module.exports = router;
