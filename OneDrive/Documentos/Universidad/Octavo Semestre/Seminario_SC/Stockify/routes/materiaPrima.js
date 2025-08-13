// routes/materiaPrima.js
const express = require('express');
const router  = express.Router();
const mpC     = require('../controllers/materiaPrimaController');
const { authenticateToken } = require('../middleware/auth');

router.get('/',       authenticateToken, mpC.getAll);
router.get('/:id',    authenticateToken, mpC.getById);
router.post('/',      authenticateToken, mpC.create);
router.put('/:id',    authenticateToken, mpC.update);
router.delete('/:id', authenticateToken, mpC.delete);

module.exports = router;
