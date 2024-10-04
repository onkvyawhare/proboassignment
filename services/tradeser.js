const axios = require('axios');
require('dotenv').config();

let balance = 10000; // Starting balance
let positions = 0; // Number of shares held
const tradeHistory = [];
let lastPrice = 0;
API_KEY=process.env.API_KEY;
INTERVAL='5min'



const fetchPrice = async (symbol) => {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${INTERVAL}&apikey=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Check if the time series data exists
        const timeSeries = data["Time Series (5min)"];
        if (!timeSeries) {
            throw new Error("Time Series data is not available in the response.");
        }

        // Get the most recent time entry
        const timeKeys = Object.keys(timeSeries);
        const latestTime = timeKeys[0]; // Get the most recent timestamp
        const stockData = timeSeries[latestTime];

        const stockPriceInfo = {
            time: latestTime,
            open: parseFloat(stockData['1. open']),
            high: parseFloat(stockData['2. high']),
            low: parseFloat(stockData['3. low']),
            close: parseFloat(stockData['4. close']),
            volume: parseInt(stockData['5. volume']),
        };

        console.log('Latest Stock Price Info:', stockPriceInfo);
        return stockPriceInfo;

    } catch (error) {
        console.error("Error fetching stock price:", error.message);
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
