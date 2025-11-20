const express = require('express');
const app = express();

// Trust proxy (important for Lambda Function URLs)
app.set('trust proxy', true);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enhanced CORS middleware (though Lambda Function URL handles most of it)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Expose-Headers', 'Date, X-Amz-Request-Id');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Express Lambda with Function URL!',
    environment: process.env.NODE_ENV || 'development',
    functionUrl: process.env.FUNCTION_URL || false,
    timestamp: new Date().toISOString(),
    timeout: '15 minutes maximum'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Express Lambda Function URL',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timeout: '900 seconds (15 minutes)'
  });
});

app.get('/api/users', (req, res) => {
  res.json({ 
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ],
    meta: {
      total: 2,
      source: 'Lambda Function URL'
    }
  });
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  res.status(201).json({ 
    message: 'User created successfully',
    user: { id: Date.now(), name, email },
    created_via: 'Lambda Function URL'
  });
});

// Long-running operation test (to demonstrate 15-minute timeout)
app.post('/api/long-process', (req, res) => {
  const { duration = 5 } = req.body; // seconds
  
  console.log(`Starting long process for ${duration} seconds...`);
  
  setTimeout(() => {
    res.json({
      message: `Process completed after ${duration} seconds`,
      timestamp: new Date().toISOString(),
      note: 'This would timeout in API Gateway after 30 seconds, but works fine with Function URLs!'
    });
  }, duration * 1000);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message,
    service: 'Lambda Function URL'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

module.exports = app;