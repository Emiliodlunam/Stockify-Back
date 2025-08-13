// routes/orders.js
const express = require('express');
const router  = express.Router();
const orderC  = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');

// Todas protegidas
router.get('/',       authenticateToken, orderC.getAll);
router.get('/:id',    authenticateToken, orderC.getById);
router.post('/',      authenticateToken, orderC.create);
router.patch('/:id',  authenticateToken, orderC.updateState);
router.delete('/:id', authenticateToken, orderC.delete);
router.get('/special', authenticateToken, orderC.getSpecial);


module.exports = router;
