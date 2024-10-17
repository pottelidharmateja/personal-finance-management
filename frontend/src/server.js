const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS for frontend-backend communication
app.use(express.json());

let transactions = [
    { id: 1, date: '25 Jul 12:30', amount: 10, name: 'YouTube', method: 'VISA **3254', category: 'Subscription' },
    { id: 2, date: '26 Jul 15:00', amount: 150, name: 'Reserved', method: 'Mastercard **2154', category: 'Shopping' },
    { id: 3, date: '27 Jul 09:00', amount: 80, name: 'Yaposhka', method: 'Mastercard **2154', category: 'Cafe & Restaurants' }
];

// Endpoint to get all transactions
app.get('/api/transactions', (req, res) => {
    res.json(transactions);
});

// Endpoint to add a new transaction
app.post('/api/transactions', (req, res) => {
    const newTransaction = req.body;
    transactions.push(newTransaction);
    res.status(201).json(newTransaction);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
