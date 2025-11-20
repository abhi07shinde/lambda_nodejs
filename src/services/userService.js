const User = require('../models/User');
const logger = require('../utils/logger');

class UserService {
  constructor() {
    // In a real app, this would be your database
    this.users = [
      new User({ id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' }),
      new User({ id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' })
    ];
    this.nextId = 3;
  }

  async getAllUsers(options = {}) {
    try {
      const { page = 1, limit = 10, role } = options;
      
      let filteredUsers = this.users;
      
      if (role) {
        filteredUsers = this.users.filter(user => user.role === role);
      }

      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

      logger.info(`Retrieved ${paginatedUsers.length} users`);

      return {
        users: paginatedUsers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: filteredUsers.length,
          pages: Math.ceil(filteredUsers.length / limit)
        }
      };
    } catch (error) {
      logger.error('Error getting users:', error);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const user = this.users.find(u => u.id === parseInt(id));
      
      if (!user) {
        throw new Error('User not found');
      }

      logger.info(`Retrieved user ${id}`);
      return user;
    } catch (error) {
      logger.error(`Error getting user ${id}:`, error);
      throw error;
    }
  }

  async createUser(userData) {
    try {
      // Check if email already exists
      const existingUser = this.users.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('Email already exists');
      }

      const newUser = new User({
        id: this.nextId++,
        ...userData
      });

      this.users.push(newUser);
      logger.info(`Created user ${newUser.id}`);
      
      return newUser;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id, updateData) {
    try {
      const userIndex = this.users.findIndex(u => u.id === parseInt(id));
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Check if email already exists (excluding current user)
      if (updateData.email) {
        const existingUser = this.users.find(u => 
          u.email === updateData.email && u.id !== parseInt(id)
        );
        if (existingUser) {
          throw new Error('Email already exists');
        }
      }

      this.users[userIndex] = {
        ...this.users[userIndex],
        ...updateData,
        updatedAt: new Date()
      };

      logger.info(`Updated user ${id}`);
      return this.users[userIndex];
    } catch (error) {
      logger.error(`Error updating user ${id}:`, error);
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      const userIndex = this.users.findIndex(u => u.id === parseInt(id));
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const deletedUser = this.users.splice(userIndex, 1)[0];
      logger.info(`Deleted user ${id}`);
      
      return deletedUser;
    } catch (error) {
      logger.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  }
}

module.exports = new UserService();