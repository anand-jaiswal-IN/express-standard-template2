import { errorHandler, notFoundHandler } from '#middlewares/errorHandler.js';
import morganMiddleware from '#middlewares/logging.js';
import {
  middleware,
  performanceMonitor,
  requestLogger,
  responseLogger,
} from '#middlewares/middlewares.js';
import logger from '#utils/logger.js';
import express from 'express';

const app = express();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Performance monitoring (must be early)
app.use(performanceMonitor);

// Request logging
app.use(requestLogger);

// Morgan HTTP request logging
app.use(morganMiddleware);

// Response logging
app.use(responseLogger);

// Routes
app.get('/', middleware, (req, res) => {
  logger.info('Home route accessed', {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });
  res.json({ message: 'Hello World!' });
});

// Test error route for logging
app.get('/error', (req, res, next) => {
  logger.warn('Error test route accessed');
  next(new Error('This is a test error for logging'));
});

// Test slow route for performance monitoring
app.get('/slow', async (req, res) => {
  logger.info('Slow route accessed');
  await new Promise((resolve) => setTimeout(resolve, 1500));
  res.json({ message: 'Slow response completed' });
});

// 404 handler for unmatched routes
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
