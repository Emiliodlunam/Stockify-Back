// routes/reports.js
const express        = require('express');
const router         = express.Router();
const reportC        = require('../controllers/reportController');
const { authenticateToken } = require('../middleware/auth');

// Reporte semanal
router.get('/weekly', authenticateToken, reportC.weekly);

module.exports = router;
