const express = require('express');
const router = express.Router();

const healthController = require('../controllers/healthController');

// Health check endpoint (public)
router.get('/', healthController.healthCheck);

// Readiness check endpoint (public)
router.get('/ready', healthController.readinessCheck);

module.exports = router;