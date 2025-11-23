const express = require('express');
const { paymentGuard } = require('../index');

const app = express();
const PORT = 3005;

// Middleware to parse JSON
app.use(express.json());

// Public route
app.get('/', (req, res) => {
    res.send('Welcome to the public area!');
});

// Protected route using x402 SDK
app.get('/premium', paymentGuard({
    walletAddress: '0x1234567890123456789012345678901234567890', // Demo address
    price: '0.05',
    network: 'polygon-amoy'
}), (req, res) => {
    res.json({
        message: 'Welcome to the premium content!',
        secret: 'The answer is 42',
        paymentInfo: req.payment
    });
});

app.listen(PORT, () => {
    console.log(`Test server running on http://localhost:${PORT}`);
});
