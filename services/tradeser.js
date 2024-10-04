const axios = require('axios');
require('dotenv').config();

let balance = 10000; // Starting balance
let positions = 0; // Number of shares held
const tradeHistory = [];
let lastPrice = 0;

const fetchPrice = async (symbol) => {
    try {
        const response = await axios.get(`https://www.alphavantage.co/query`, {
            params: {
                function: 'TIME_SERIES_INTRADAY',
                symbol: symbol,
                interval: '1min',
                apikey: process.env.ALPHA_VANTAGE_API_KEY
            }
        });
        
        const timeSeries = response.data["Time Series (1min)"];
        const latestTimestamp = Object.keys(timeSeries)[0];
        const latestPrice = parseFloat(timeSeries[latestTimestamp]["1. open"]);

        return latestPrice;
    } catch (error) {
        console.error('Error fetching stock price:', error);
        return lastPrice; // Return the last price if there's an error
    }
};

const executeTrade = async (symbol) => {
    const price = await fetchPrice(symbol);

    if (positions === 0) {
        if (shouldBuy(price)) {
            const sharesToBuy = Math.floor(balance / price);
            balance -= sharesToBuy * price;
            positions += sharesToBuy;
            tradeHistory.push({ type: 'buy', price, shares: sharesToBuy });
            console.log(`Bought ${sharesToBuy} shares of ${symbol} at $${price}`);
        }
    } else {
        if (shouldSell(price)) {
            balance += positions * price;
            tradeHistory.push({ type: 'sell', price, shares: positions });
            console.log(`Sold ${positions} shares of ${symbol} at $${price}`);
            positions = 0;
        }
    }
    lastPrice = price; // Store last price for next iteration
};

const shouldBuy = (currentPrice) => {
    return currentPrice < lastPrice * 0.98; // 2% drop
};

const shouldSell = (currentPrice) => {
    return currentPrice > lastPrice * 1.03; // 3% rise
};

const getStatus = () => {
    return {
        balance,
        positions,
        tradeHistory
    };
};

module.exports = {
    fetchPrice,
    executeTrade,
    getStatus
};
