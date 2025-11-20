const jwt = require('jsonwebtoken');
const config = require('../config/environment');
const ApiResponse = require('../utils/responses');
const logger = require('../utils/logger');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return ApiResponse.unauthorized(res, 'Access token required');
  }

  jwt.verify(token, config.JWT_SECRET, (err, user) => {
    if (err) {
      logger.warn('Token verification failed:', { error: err.message });
      return ApiResponse.unauthorized(res, 'Invalid or expired token');
    }

    req.user = user;
    next();
  });
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res);
    }

    if (!roles.includes(req.user.role)) {
      return ApiResponse.error(res, 'Insufficient permissions', 403);
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles
};