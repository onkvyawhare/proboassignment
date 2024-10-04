const tradingService = require('../services/tradingService');

const startTrading = async (req, res) => {
    const symbol = req.query.symbol || 'TCS'; // Default to Tcs if no symbol provided
    setInterval(async () => {
        await tradingService.executeTrade(symbol);
    }, 60000); // Execute every minute
    res.send(`Trading started for ${symbol}`);
};

const getStatus = (req, res) => {
    const status = tradingService.getStatus();
    res.json(status);
};

module.exports = {
    startTrading,
    getStatus
};
