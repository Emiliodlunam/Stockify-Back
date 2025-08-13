// routes/production.js
const express = require('express');
const router  = express.Router();
const prodC   = require('../controllers/productionController');
const { authenticateToken } = require('../middleware/auth');

router.get('/',        authenticateToken, prodC.getAll);
router.get('/:id',     authenticateToken, prodC.getById);
router.post('/',       authenticateToken, prodC.create);
router.put('/:id',     authenticateToken, prodC.update);
router.delete('/:id',  authenticateToken, prodC.delete);

module.exports = router;
