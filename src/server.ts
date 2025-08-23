import app from '#app.js';

const port = process.env.PORT ?? '3000';

const server = app.listen(port, () => {
  console.info(`Server started successfully`, {
    environment: process.env.NODE_ENV ?? 'development',
    port,
  });
});

// Graceful shutdown handling
const gracefulShutdown = (signal: string) => {
  console.info(`${signal} received, shutting down gracefully`);

  server.close(() => {
    console.info('Server closed, process terminated');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
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
  console.error('Unhandled Promise Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Uncaught exception handler
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle server errors
server.on('error', (error: Error) => {
  console.error('Server error:', error);
  process.exit(1);
});
