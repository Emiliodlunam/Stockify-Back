// routes/users.js
const express     = require('express');
const { body, param } = require('express-validator');
const userC       = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');
const validate    = require('../middleware/validate');

const router = express.Router();

router.get('/', authenticateToken, userC.getAll);

router.get(
    '/:id',
    [
        authenticateToken,
        param('id').isInt().withMessage('El id debe ser un entero'),
        validate
    ],
    userC.getById
);

router.post(
    '/',
    [
        authenticateToken,
        body('nombre').notEmpty(),
        body('email').isEmail(),
        body('password').isLength({ min:6 }),
        body('role_id').isInt(),
        validate
    ],
    userC.create
);

router.put(
    '/:id',
    [
        authenticateToken,
        param('id').isInt(),
        body('nombre').optional().notEmpty(),
        body('email').optional().isEmail(),
        body('role_id').optional().isInt(),
        validate
    ],
    userC.update
);

router.delete(
    '/:id',
    [
        authenticateToken,
        param('id').isInt(),
        validate
    ],
    userC.delete
);

module.exports = router;
