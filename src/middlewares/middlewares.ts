import cors from 'cors';
import { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

// Performance monitoring middleware
export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
  (req as unknown as { startTime: number }).startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - (req as unknown as { startTime: number }).startTime;

    if (duration > 1000) {
      console.warn('Slow request detected', {
        duration: `${String(duration)}ms`,
        ip: req.ip,
        method: req.method,
        url: req.url,
      });
    }
  });

  next();
};

// Morgon http middleware
morgan.token('ip', (req: Request): string => {
  return req.ip ?? '';
});
const devFormat = ':method :url :status :response-time ms - :ip - :user-agent';
const prodFormat = ':method :url :status :response-time ms - :ip';
export const morganMiddleware =
  process.env.NODE_ENV === 'production'
    ? morgan(prodFormat, {
        skip: (_req, res) => res.statusCode < 400, // log only errors
      })
    : morgan(devFormat); // log everything in dev

// cors middleware
const corsOptions = {
  origin: process.env.CORS_ORIGIN ?? '*',
};
export const corsMiddleware = cors(corsOptions);

// helmet middleware
const helmetOptions: Record<string, unknown> = {};
if (process.env.HELMET_CSP) {
  helmetOptions.contentSecurityPolicy = {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'default-src': ["'self'", process.env.HELMET_CSP],
    },
  };
}
export const helmetMiddleware = helmet(helmetOptions);
