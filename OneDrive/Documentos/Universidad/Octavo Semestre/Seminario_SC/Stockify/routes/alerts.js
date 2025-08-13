// routes/alerts.js
const express    = require('express');
const router     = express.Router();
const alertC     = require('../controllers/alertController');
const { authenticateToken } = require('../middleware/auth');

router.get('/',                 authenticateToken, alertC.getActive);
router.post('/',                authenticateToken, alertC.create);
router.patch('/:id/deactivate', authenticateToken, alertC.deactivate);

module.exports = router;
