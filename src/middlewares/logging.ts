import { stream } from '#utils/logger.js';
import morgan from 'morgan';

// Custom token for request body (for POST/PUT requests)
morgan.token('body', (req) => {
  const request = req as { body?: unknown; method?: string };
  if (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH') {
    return JSON.stringify(request.body);
  }
  return '';
});

// Custom token for response time in a more readable format
morgan.token('response-time-ms', (req, res) => {
  const responseTime = (
    morgan as unknown as { 'response-time': (req: unknown, res: unknown) => string }
  )['response-time'](req, res);
  return responseTime ? `${responseTime}ms` : '';
});

// Custom token for user agent
morgan.token('user-agent', (req) => {
  const request = req as unknown as { get: (header: string) => string | undefined };
  return request.get('User-Agent') ?? 'Unknown';
});

// Custom token for IP address
morgan.token('ip', (req) => {
  const request = req as {
    connection?: { remoteAddress?: string };
    ip?: string;
    socket?: { remoteAddress?: string };
  };
  return (
    request.ip ?? request.connection?.remoteAddress ?? request.socket?.remoteAddress ?? 'Unknown'
  );
});

// Development format - more detailed
const devFormat = ':method :url :status :response-time-ms - :ip - :user-agent';

// Production format - more concise
const prodFormat = ':method :url :status :response-time-ms - :ip';

// Error format - includes request body for debugging
const errorFormat = ':method :url :status :response-time-ms - :ip - :body';

// Create Morgan middleware based on environment
const createMorganMiddleware = () => {
  const env = process.env.NODE_ENV ?? 'development';

  if (env === 'development') {
    return morgan(devFormat, {
      skip: (req, res) => res.statusCode < 400, // Skip successful requests in dev
      stream,
    });
  }

  if (env === 'production') {
    return morgan(prodFormat, {
      skip: (req, res) => res.statusCode >= 400, // Only log errors in production
      stream,
    });
  }

  // Default format for other environments
  return morgan(prodFormat, { stream });
};

// Error logging middleware
export const errorLoggingMiddleware = morgan(errorFormat, {
  skip: (req, res) => res.statusCode < 400, // Only log errors
  stream,
});

// Success logging middleware
export const successLoggingMiddleware = morgan(prodFormat, {
  skip: (req, res) => res.statusCode >= 400, // Only log successful requests
  stream,
});

// Combined logging middleware
export const combinedLoggingMiddleware = morgan(prodFormat, { stream });

// Export the main Morgan middleware
export default createMorganMiddleware();
