const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Hello from Lambda!',
        timestamp: new Date().toISOString()
    });
});

app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.json({
        userId,
        name: `User ${userId}`,
        email: `user${userId}@example.com`
    });
});

app.post('/users', (req, res) => {
    const { name, email } = req.body;
    res.json({
        id: Math.floor(Math.random() * 1000),
        name,
        email,
        created: new Date().toISOString()
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'Express Lambda' });
});

module.exports = app;