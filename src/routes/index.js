const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./users');
const healthRoutes = require('./health');

const ApiResponse = require('../utils/responses');

// API Documentation endpoint
router.get('/', (req, res) => {
  const apiInfo = {
    name: 'Express Lambda API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: {
        'POST /api/auth/login': 'User login',
        'POST /api/auth/register': 'User registration',
        'POST /api/auth/refresh-token': 'Refresh access token',
        'POST /api/auth/logout': 'User logout'
      },
      users: {
        'GET /api/users': 'Get all users (paginated)',
        'GET /api/users/:id': 'Get user by ID',
        'POST /api/users': 'Create new user (admin only)',
        'PUT /api/users/:id': 'Update user',
        'DELETE /api/users/:id': 'Delete user (admin only)'
      },
      health: {
        'GET /health': 'Health check',
        'GET /health/ready': 'Readiness check'
      }
    },
    authentication: {
      type: 'JWT Bearer Token',
      header: 'Authorization: Bearer <token>',
      login: 'POST /api/auth/login with email/password'
    },
    sampleCredentials: {
      email: 'admin@example.com',
      password: 'password123'
    }
  };

  ApiResponse.success(res, apiInfo, 'API information retrieved successfully');
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/health', healthRoutes);

module.exports = router;