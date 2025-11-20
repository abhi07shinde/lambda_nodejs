const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/environment');
const logger = require('../utils/logger');

class AuthService {
  generateToken(payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN
    });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, config.JWT_SECRET);
    } catch (error) {
      logger.error('Token verification failed:', error);
      throw error;
    }
  }

  async hashPassword(password) {
    try {
      const saltRounds = 10;
      return await bcrypt.hash(password, saltRounds);
    } catch (error) {
      logger.error('Password hashing failed:', error);
      throw error;
    }
  }

  async comparePassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      logger.error('Password comparison failed:', error);
      throw error;
    }
  }

  extractTokenFromHeader(authHeader) {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }
}

module.exports = new AuthService();