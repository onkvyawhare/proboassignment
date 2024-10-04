const express = require('express');
const router = express.Router();
const trade = require('../controllers/trade');

router.get('/start', trade.startTrading);
router.get('/status', trade.getStatus);

module.exports = router;
