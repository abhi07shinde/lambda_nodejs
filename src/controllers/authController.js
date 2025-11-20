const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/environment');
const ApiResponse = require('../utils/responses');
const logger = require('../utils/logger');

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // In a real app, you'd query your database
      const mockUser = {
        id: 1,
        email: 'admin@example.com',
        password: await bcrypt.hash('password123', 10), // In real app, this comes from DB
        name: 'Admin User',
        role: 'admin'
      };

      // Check if user exists
      if (email !== mockUser.email) {
        return ApiResponse.unauthorized(res, 'Invalid credentials');
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, mockUser.password);
      if (!isPasswordValid) {
        return ApiResponse.unauthorized(res, 'Invalid credentials');
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: mockUser.id, 
          email: mockUser.email,
          role: mockUser.role 
        },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN }
      );

      const responseData = {
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role
        },
        token,
        expiresIn: config.JWT_EXPIRES_IN
      };

      logger.info(`User ${mockUser.email} logged in successfully`);
      ApiResponse.success(res, responseData, 'Login successful');

    } catch (error) {
      logger.error('Error in login:', error);
      ApiResponse.error(res, 'Login failed');
    }
  }

  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // In a real app, check if user already exists in database
      // For now, we'll just create a mock response

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = {
        id: Date.now(),
        name,
        email,
        role: 'user',
        createdAt: new Date()
      };

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: newUser.id, 
          email: newUser.email,
          role: newUser.role 
        },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN }
      );

      const responseData = {
        user: newUser,
        token,
        expiresIn: config.JWT_EXPIRES_IN
      };

      logger.info(`User ${email} registered successfully`);
      ApiResponse.success(res, responseData, 'Registration successful', 201);

    } catch (error) {
      logger.error('Error in register:', error);
      ApiResponse.error(res, 'Registration failed');
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return ApiResponse.unauthorized(res, 'Refresh token required');
      }

      // Verify refresh token (in a real app, you'd validate against your database)
      jwt.verify(refreshToken, config.JWT_SECRET, (err, decoded) => {
        if (err) {
          return ApiResponse.unauthorized(res, 'Invalid refresh token');
        }

        // Generate new access token
        const newToken = jwt.sign(
          { 
            id: decoded.id, 
            email: decoded.email,
            role: decoded.role 
          },
          config.JWT_SECRET,
          { expiresIn: config.JWT_EXPIRES_IN }
        );

        const responseData = {
          token: newToken,
          expiresIn: config.JWT_EXPIRES_IN
        };

        ApiResponse.success(res, responseData, 'Token refreshed successfully');
      });

    } catch (error) {
      logger.error('Error in refreshToken:', error);
      ApiResponse.error(res, 'Token refresh failed');
    }
  }

  async logout(req, res) {
    try {
      // In a real app, you might blacklist the token or remove from database
      logger.info(`User ${req.user?.email} logged out`);
      ApiResponse.success(res, null, 'Logout successful');
    } catch (error) {
      logger.error('Error in logout:', error);
      ApiResponse.error(res, 'Logout failed');
    }
  }
}

module.exports = new AuthController();