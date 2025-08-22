import app from '#app.js';
import logger from '#utils/logger.js';

const port = process.env.PORT ?? '3000';

const server = app.listen(port, () => {
  logger.info(`Server started successfully`, {
    environment: process.env.NODE_ENV ?? 'development',
    port,
  });
});

// Graceful shutdown handling
const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully`);

  server.close(() => {
    logger.info('Server closed, process terminated');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => {
  gracefulShutdown('SIGTERM');
});
process.on('SIGINT', () => {
  gracefulShutdown('SIGINT');
});

// Unhandled promise rejection handler
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Uncaught exception handler
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle server errors
server.on('error', (error: Error) => {
  logger.error('Server error:', error);
  process.exit(1);
});
