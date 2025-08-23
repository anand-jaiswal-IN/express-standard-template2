import { NextFunction, Request, Response } from 'express';

// Custom error class for application errors
export class AppError extends Error {
  public isOperational: boolean;
  public statusCode: number;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const error: AppError = err instanceof AppError ? err : new AppError(err.message);

  // Log error details
  console.error('Error occurred:', {
    error: {
      message: err.message,
      name: err.name,
      stack: err.stack,
    },
    request: {
      body: req.body as unknown,
      ip: req.ip,
      method: req.method,
      params: req.params,
      query: req.query,
      url: req.url,
      userAgent: req.get('User-Agent'),
    },
  });

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Server Error';

  // Send error response
  res.status(statusCode).json({
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
    success: false,
  });
};

// 404 handler for unmatched routes
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

// Async error wrapper
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
