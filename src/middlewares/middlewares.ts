import logger from '#utils/logger.js';
import { NextFunction, Request, Response } from 'express';

export const middleware = (req: Request, res: Response, next: NextFunction) => {
  logger.debug('Middleware called', {
    ip: req.ip,
    method: req.method,
    url: req.url,
  });
  next();
};

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info('Incoming request', {
    ip: req.ip,
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
  });
  next();
};

// Response logging middleware
export const responseLogger = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;

  res.send = function (data) {
    logger.info('Outgoing response', {
      method: req.method,
      responseTime: Date.now() - (req as unknown as { startTime: number }).startTime,
      statusCode: res.statusCode,
      url: req.url,
    });

    return originalSend.call(this, data);
  };

  next();
};

// Performance monitoring middleware
export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
  (req as unknown as { startTime: number }).startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - (req as unknown as { startTime: number }).startTime;

    if (duration > 1000) {
      logger.warn('Slow request detected', {
        duration: `${String(duration)}ms`,
        ip: req.ip,
        method: req.method,
        url: req.url,
      });
    }
  });

  next();
};
