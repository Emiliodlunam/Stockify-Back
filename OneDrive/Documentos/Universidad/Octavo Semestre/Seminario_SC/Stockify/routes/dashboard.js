// routes/dashboard.js
const express       = require('express');
const router        = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { authorize }        = require('../middleware/authorize');
const dashC         = require('../controllers/dashboardController');

// Sólo accesible a administracion
router.get(
  '/',
  authenticateToken,
  authorize(['administracion']),
  dashC.dashboard
);

module.exports = router;
