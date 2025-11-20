const express = require('express');
const app = express();

// Trust proxy (important for Lambda)
app.set('trust proxy', true);

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Simple CORS middleware function
const corsMiddleware = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
};

// Apply CORS middleware
app.use(corsMiddleware);

// Simple logging middleware
const loggerMiddleware = (req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};

// Apply logging middleware
app.use(loggerMiddleware);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Express Lambda API is running!',
    data: {
      service: 'Express Lambda API',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      lambda: {
        functionUrl: !!process.env.FUNCTION_URL,
        timeout: '15 minutes maximum'
      }
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
  ];

  res.json({
    success: true,
    data: users,
    message: 'Users retrieved successfully',
    count: users.length
  });
});

app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const userId = parseInt(id);

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
  ];

  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    data: user,
    message: 'User retrieved successfully'
  });
});

app.post('/api/users', (req, res) => {
  const { name, email, role } = req.body;

  // Basic validation
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Name and email are required',
      errors: {
        name: !name ? 'Name is required' : null,
        email: !email ? 'Email is required' : null
      }
    });
  }

  // Create new user
  const newUser = {
    id: Date.now(),
    name,
    email,
    role: role || 'user',
    createdAt: new Date().toISOString()
  };

  res.status(201).json({
    success: true,
    data: newUser,
    message: 'User created successfully'
  });
});

app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  res.json({
    success: true,
    data: {
      id: parseInt(id),
      name,
      email,
      role,
      updatedAt: new Date().toISOString()
    },
    message: 'User updated successfully'
  });
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;

  res.json({
    success: true,
    message: `User ${id} deleted successfully`
  });
});

// Test long-running process (for Function URL testing)
app.post('/api/long-process', (req, res) => {
  const { duration = 5 } = req.body;
  const seconds = parseInt(duration);

  console.log(`Starting long process for ${seconds} seconds...`);

  setTimeout(() => {
    res.json({
      success: true,
      message: `Process completed after ${seconds} seconds`,
      timestamp: new Date().toISOString(),
      note: 'This would timeout in API Gateway after 30 seconds!'
    });
  }, seconds * 1000);
});

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', err.message);
  console.error('Stack trace:', err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
};

// Apply error handler
app.use(errorHandler);

// 404 handler (must be last)
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// For local development
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Local URL: http://localhost:${PORT}`);
    console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
  });
}

module.exports = app;