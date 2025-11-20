const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const handleValidationErrors = require('../middleware/validation');
const {
  createUserValidator,
  updateUserValidator,
  getUserValidator,
  getUsersValidator
} = require('../validators/userValidator');

// Get all users (with pagination and filtering)
router.get('/', 
  getUsersValidator,
  handleValidationErrors,
  authenticateToken,
  userController.getUsers
);

// Get user by ID
router.get('/:id',
  getUserValidator,
  handleValidationErrors,
  authenticateToken,
  userController.getUser
);

// Create new user (admin only)
router.post('/',
  createUserValidator,
  handleValidationErrors,
  authenticateToken,
  authorizeRoles('admin'),
  userController.createUser
);

// Update user
router.put('/:id',
  updateUserValidator,
  handleValidationErrors,
  authenticateToken,
  userController.updateUser
);

// Delete user (admin only)
router.delete('/:id',
  getUserValidator,
  handleValidationErrors,
  authenticateToken,
  authorizeRoles('admin'),
  userController.deleteUser
);

module.exports = router;