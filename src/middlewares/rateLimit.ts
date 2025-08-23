import rateLimit from 'express-rate-limit';

// General API rate limiter
export const generalLimiter = rateLimit({
  handler: (req, res) => {
    console.warn('Rate limit exceeded', {
      ip: req.ip,
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent'),
    });
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
    });
  },
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  windowMs: 15 * 60 * 1000, // 15 minutes
});

// Strict rate limiter for sensitive routes
export const strictLimiter = rateLimit({
  handler: (req, res) => {
    console.warn('Strict rate limit exceeded', {
      ip: req.ip,
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent'),
    });
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
    });
  },
  legacyHeaders: false,
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  windowMs: 15 * 60 * 1000, // 15 minutes
});

// Auth rate limiter for login/register routes
export const authLimiter = rateLimit({
  handler: (req, res) => {
    console.warn('Auth rate limit exceeded', {
      ip: req.ip,
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent'),
    });
    res.status(429).json({
      error: 'Too many authentication attempts, please try again later.',
    });
  },
  legacyHeaders: false,
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
  },
  standardHeaders: true,
  windowMs: 15 * 60 * 1000, // 15 minutes
});

// Development rate limiter (more lenient)
export const devLimiter = rateLimit({
  handler: (req, res) => {
    console.warn('Development rate limit exceeded', {
      ip: req.ip,
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent'),
    });
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
    });
  },
  legacyHeaders: false,
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  windowMs: 15 * 60 * 1000, // 15 minutes
});

// Get appropriate rate limiter based on environment
export const getRateLimiter = () => {
  const env = process.env.NODE_ENV ?? 'development';

  if (env === 'development') {
    return devLimiter;
  }

  return generalLimiter;
};
