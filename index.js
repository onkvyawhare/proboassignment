const express = require('express');
const tradingRoutes = require('./routes/trade');
const app = express();
const PORT = 3000;

app.use('/api/trading', tradingRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
