const app = require('./app');
const config = require('./config/environment');
const logger = require('./utils/logger');
const database = require('./config/database');

// Start server
const startServer = async () => {
  try {
    // Initialize database connection
    await database.connect();
    logger.info('Database connected successfully');

    // Start HTTP server
    const server = app.listen(config.PORT, config.HOST, () => {
      logger.info(`Server running on ${config.HOST}:${config.PORT}`);
      logger.info(`Environment: ${config.NODE_ENV}`);
      logger.info(`API Documentation: http://${config.HOST}:${config.PORT}/api-docs`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.syscall !== 'listen') {
        throw error;
      }

      const bind = typeof config.PORT === 'string' ? `Pipe ${config.PORT}` : `Port ${config.PORT}`;

      switch (error.code) {
        case 'EACCES':
          logger.error(`${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          logger.error(`${bind} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

    // Graceful shutdown
    const gracefulShutdown = (signal) => {
      logger.info(`${signal} received, shutting down gracefully`);
      
      server.close((err) => {
        if (err) {
          logger.error('Error during server shutdown:', err);
          process.exit(1);
        }
        
        logger.info('Server closed successfully');
        database.disconnect();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();
