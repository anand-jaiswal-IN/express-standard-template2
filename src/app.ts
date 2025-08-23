import { errorHandler, notFoundHandler } from '#middlewares/errorHandler.js';
import {
  corsMiddleware,
  helmetMiddleware,
  morganMiddleware,
  performanceMonitor,
} from '#middlewares/middlewares.js';
import { authLimiter, getRateLimiter, strictLimiter } from '#middlewares/rateLimit.js';
import express from 'express';

const app = express();

app.use(corsMiddleware); // Enable CORS with options
app.use(helmetMiddleware); // Secure HTTP headers with options

app.set('trust proxy', 1); // Trust proxy for accurate IP addresses

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(performanceMonitor); // Performance monitoring (must be early)
app.use(morganMiddleware); // Morgan HTTP request logging

app.use(getRateLimiter()); // Rate limiting (apply to all routes)

// Routes
app.get('/', (req, res) => {
  console.info('Home route accessed');
  res.json({ message: 'Hello Express!', timestamp: new Date().toISOString() });
});

// Test error route for logging
app.get('/error', (req, res, next) => {
  console.warn('Error test route accessed');
  next(new Error('This is a test error for logging'));
});

// Test slow route for performance monitoring
app.get('/slow', async (req, res) => {
  console.info('Slow route accessed');
  await new Promise((resolve) => setTimeout(resolve, 1500));
  res.json({ message: 'Slow response completed' });
});

// Test health route for health check
app.get('/health', (req, res) => {
  console.info('Health check route accessed');
  res.status(200).json({
    message: 'Server is healthy!',
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(), // server uptime in seconds
  });
});

// Test routes with different rate limiters
app.get('/limiter/strict', strictLimiter, (req, res) => {
  console.info('Strict rate limited route accessed');
  res.json({ message: 'This route has strict rate limiting (5 requests per 15 minutes)' });
});

app.post('/limiter/auth', authLimiter, (req, res) => {
  console.info('Auth route accessed');
  res.json({ message: 'Login endpoint with auth rate limiting (10 requests per 15 minutes)' });
});

// 404 handler for unmatched routes
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
