const config = {
  development: {
    NODE_ENV: 'development',
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-key',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
    LOG_LEVEL: process.env.LOG_LEVEL || 'debug'
  },
  dev: {
    NODE_ENV: 'dev',
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-key',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info'
  },
  prod: {
    NODE_ENV: 'production',
    PORT: process.env.PORT || 3000,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
    LOG_LEVEL: process.env.LOG_LEVEL || 'error'
  }
};

const env = process.env.NODE_ENV || 'development';

module.exports = config[env];