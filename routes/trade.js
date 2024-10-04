const express = require('express');
const router = express.Router();
const tradingController = require('../controllers/trade');

router.get('/start', tradingController.startTrading);
router.get('/status', tradingController.getStatus);

module.exports = router;
