const userService = require('../services/userService');
const ApiResponse = require('../utils/responses');
const logger = require('../utils/logger');
const { MESSAGES } = require('../utils/constants');

class UserController {
  async getUsers(req, res) {
    try {
      const { page, limit, role } = req.query;
      const result = await userService.getAllUsers({ page, limit, role });
      
      ApiResponse.success(res, result, 'Users retrieved successfully');
    } catch (error) {
      logger.error('Error in getUsers:', error);
      ApiResponse.error(res, error.message);
    }
  }

  async getUser(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      
      ApiResponse.success(res, user, 'User retrieved successfully');
    } catch (error) {
      if (error.message === 'User not found') {
        return ApiResponse.notFound(res, error.message);
      }
      
      logger.error('Error in getUser:', error);
      ApiResponse.error(res, error.message);
    }
  }

  async createUser(req, res) {
    try {
      const userData = req.body;
      const newUser = await userService.createUser(userData);
      
      ApiResponse.success(res, newUser, MESSAGES.CREATED, 201);
    } catch (error) {
      if (error.message === 'Email already exists') {
        return ApiResponse.error(res, error.message, 400);
      }
      
      logger.error('Error in createUser:', error);
      ApiResponse.error(res, error.message);
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const updatedUser = await userService.updateUser(id, updateData);
      
      ApiResponse.success(res, updatedUser, MESSAGES.UPDATED);
    } catch (error) {
      if (error.message === 'User not found') {
        return ApiResponse.notFound(res, error.message);
      }
      
      if (error.message === 'Email already exists') {
        return ApiResponse.error(res, error.message, 400);
      }
      
      logger.error('Error in updateUser:', error);
      ApiResponse.error(res, error.message);
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await userService.deleteUser(id);
      
      ApiResponse.success(res, null, MESSAGES.DELETED);
    } catch (error) {
      if (error.message === 'User not found') {
        return ApiResponse.notFound(res, error.message);
      }
      
      logger.error('Error in deleteUser:', error);
      ApiResponse.error(res, error.message);
    }
  }
}

module.exports = new UserController();