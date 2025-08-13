// routes/invoices.js
const express = require('express');
const router  = express.Router();
const invC    = require('../controllers/invoiceController');
const { authenticateToken } = require('../middleware/auth');

router.get('/',                          authenticateToken, invC.getAll);
router.get('/order/:pedido_id',         authenticateToken, invC.getByOrder);
router.post('/',                         authenticateToken, invC.create);

module.exports = router;
