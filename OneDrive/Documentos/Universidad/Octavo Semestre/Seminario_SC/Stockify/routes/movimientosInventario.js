// routes/movimientosInventario.js
const express = require('express');
const router  = express.Router();
const movC    = require('../controllers/movimientoInventarioController');
const { authenticateToken } = require('../middleware/auth');

router.get('/',                   authenticateToken, movC.getAll);
router.get('/:id',                authenticateToken, movC.getById);
router.get('/product/:producto_id', authenticateToken, movC.getByProduct);
router.post('/',                  authenticateToken, movC.create);

module.exports = router;
