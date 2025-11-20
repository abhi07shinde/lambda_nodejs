const ApiResponse = require('../utils/responses');
const config = require('../config/environment');

class HealthController {
  async healthCheck(req, res) {
    const healthData = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.NODE_ENV,
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
      lambda: {
        functionUrl: !!process.env.FUNCTION_URL,
        timeout: '15 minutes maximum'
      }
    };

    ApiResponse.success(res, healthData, 'Health check passed');
  }

  async readinessCheck(req, res) {
    // Add your readiness checks here (database connections, external services, etc.)
    const checks = {
      database: 'connected', // Replace with actual DB check
      externalServices: 'available' // Replace with actual service checks
    };

    const isReady = Object.values(checks).every(status => 
      status === 'connected' || status === 'available'
    );

    if (isReady) {
      ApiResponse.success(res, checks, 'Service is ready');
    } else {
      ApiResponse.error(res, 'Service is not ready', 503, checks);
    }
  }
}

module.exports = new HealthController();