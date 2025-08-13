// routes/transactions.js
const express    = require('express');
const router     = express.Router();
const txC        = require('../controllers/transactionController');
const { authenticateToken } = require('../middleware/auth');

// Todas las rutas protegidas
router.get('/',       authenticateToken, txC.getAll);
router.post('/',      authenticateToken, txC.create);

module.exports = router;
