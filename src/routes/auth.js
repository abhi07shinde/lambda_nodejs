const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const handleValidationErrors = require('../middleware/validation');

// Login validation
const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Register validation
const registerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
];

// Refresh token validation
const refreshTokenValidator = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
];

// Routes
router.post('/login',
  loginValidator,
  handleValidationErrors,
  authController.login
);

router.post('/register',
  registerValidator,
  handleValidationErrors,
  authController.register
);

router.post('/refresh-token',
  refreshTokenValidator,
  handleValidationErrors,
  authController.refreshToken
);

router.post('/logout',
  authenticateToken,
  authController.logout
);

module.exports = router;