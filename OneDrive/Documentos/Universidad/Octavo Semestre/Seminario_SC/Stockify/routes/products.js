// routes/products.js
const express        = require('express');
const { body, param } = require('express-validator');
const prodC          = require('../controllers/productController');
const { authenticateToken } = require('../middleware/auth');
const validate       = require('../middleware/validate');

const router = express.Router();

router.get('/', authenticateToken, prodC.getAll);

router.get(
    '/:id',
    [
        authenticateToken,
        param('id').isInt().withMessage('El id debe ser un entero'),
        validate
    ],
    prodC.getById
);

router.post(
    '/',
    [
        authenticateToken,
        body('sku').notEmpty().withMessage('SKU es obligatorio'),
        body('tipo')
        .isIn(['bolsa','bobina'])
        .withMessage('Tipo debe ser "bolsa" o "bobina"'),
        body('peso')
        .isFloat({ gt: 0 })
        .withMessage('Peso debe ser un número mayor que 0'),
        body('ancho')
        .isFloat({ gt: 0 })
        .withMessage('Ancho debe ser un número mayor que 0'),
        body('largo')
        .optional()
        .isFloat({ gt: 0 })
        .withMessage('Largo debe ser un número mayor que 0'),
        body('calibre')
        .isFloat({ gt: 0 })
        .withMessage('Calibre debe ser un número mayor que 0'),
        validate
    ],
    prodC.create
);

router.put(
    '/:id',
    [
        authenticateToken,
        param('id').isInt(),
        body('peso').optional().isFloat({ gt: 0 }),
        body('ancho').optional().isFloat({ gt: 0 }),
        body('largo').optional().isFloat({ gt: 0 }),
        body('calibre').optional().isFloat({ gt: 0 }),
        validate
    ],
    prodC.update
);

router.delete(
    '/:id',
    [
        authenticateToken,
        param('id').isInt(),
        validate
    ],
    prodC.delete
);

module.exports = router;
