# Logging System Documentation

This project implements a modern, robust logging system using Winston and Morgan for comprehensive application monitoring and debugging.

## Features

- **Multi-transport logging**: Console and file-based logging
- **Environment-specific configurations**: Different log levels for development and production
- **HTTP request logging**: Detailed request/response logging with Morgan
- **Error tracking**: Comprehensive error logging with stack traces
- **Performance monitoring**: Slow request detection and timing
- **Structured logging**: JSON format for machine-readable logs
- **Daily log rotation**: Automatic daily log file rotation with compression
- **Rate limiting**: Comprehensive API rate limiting with logging
- **Graceful shutdown**: Proper cleanup on application termination

## Architecture

### Winston Logger (`src/utils/logger.ts`)

The main logging configuration using Winston with the following features:

- **Custom log levels**: error, warn, info, http, debug
- **Colorized console output**: For development readability
- **JSON file output**: For production and analysis
- **Daily log rotation**: Automatic daily rotation with compression
- **Environment-based configuration**: Debug level in development, warn level in production

#### Daily Rotate File Configuration

```typescript
// Error log file with daily rotation
new DailyRotateFile({
  filename: path.join(logsDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  format: fileFormat,
  level: 'error',
  maxFiles: '14d', // Keep logs for 14 days
  maxSize: '20m', // 20MB max file size
  zippedArchive: true, // Compress old logs
}),

// Combined log file with daily rotation
new DailyRotateFile({
  filename: path.join(logsDir, 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  format: fileFormat,
  maxFiles: '14d', // Keep logs for 14 days
  maxSize: '20m', // 20MB max file size
  zippedArchive: true, // Compress old logs
}),
```

### Morgan HTTP Logging (`src/middlewares/logging.ts`)

HTTP request logging middleware with custom tokens:

- **Custom tokens**: IP address, user agent, response time, request body
- **Environment-specific formats**: Detailed logging in development, concise in production
- **Stream integration**: Direct integration with Winston logger

### Rate Limiting (`src/middlewares/rateLimit.ts`)

Comprehensive rate limiting with different configurations:

- **General API rate limiter**: 100 requests per 15 minutes
- **Strict rate limiter**: 5 requests per 15 minutes for sensitive routes
- **Auth rate limiter**: 10 requests per 15 minutes for authentication routes
- **Development rate limiter**: 1000 requests per 15 minutes (more lenient)
- **Automatic logging**: Rate limit violations are logged with details

### Error Handling (`src/middlewares/errorHandler.ts`)

Comprehensive error handling with:

- **Custom AppError class**: For application-specific errors
- **Structured error logging**: Detailed error context and request information
- **Async error wrapper**: Automatic error catching for async routes
- **404 handling**: Proper handling of unmatched routes

### Performance Monitoring (`src/middlewares/middlewares.ts`)

Additional middleware for:

- **Request timing**: Track response times
- **Slow request detection**: Warn for requests taking >1 second
- **Request/response logging**: Detailed request and response information

## Usage

### Basic Logging

```typescript
import logger from '#utils/logger.js';

// Different log levels
logger.error('Critical error occurred', { error: err });
logger.warn('Warning message', { context: 'user-action' });
logger.info('Information message', { userId: 123 });
logger.http('HTTP request', { method: 'GET', url: '/api/users' });
logger.debug('Debug information', { data: someData });
```

### Error Handling

```typescript
import { AppError, asyncHandler } from '#middlewares/errorHandler.js';

// Custom application error
throw new AppError('User not found', 404);

// Async route with automatic error handling
app.get(
  '/users/:id',
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    res.json(user);
  })
);
```

### Rate Limiting

```typescript
import { generalLimiter, strictLimiter, authLimiter } from '#middlewares/rateLimit.js';

// Apply general rate limiting to all routes
app.use(generalLimiter);

// Apply strict rate limiting to sensitive routes
app.get('/admin', strictLimiter, (req, res) => {
  res.json({ message: 'Admin panel' });
});

// Apply auth rate limiting to authentication routes
app.post('/auth/login', authLimiter, (req, res) => {
  res.json({ message: 'Login endpoint' });
});
```

### Performance Monitoring

The system automatically monitors:

- Request response times
- Slow requests (>1 second)
- Error rates
- Request patterns
- Rate limit violations

## Log Files

The system creates the following log files in the `logs/` directory:

- `error-YYYY-MM-DD.log`: Daily error logs (compressed after rotation)
- `combined-YYYY-MM-DD.log`: Daily combined logs (compressed after rotation)

### Log Format

**Console Output (Development):**

```
02:44:35 [info]: Server started successfully | environment=development port=3000
02:44:35 [info]: Incoming request | ip=::1 method=GET url=/ userAgent=curl/8.14.1
02:44:35 [warn]: Rate limit exceeded | ip=::1 method=GET url=/ userAgent=curl/8.14.1
```

**File Output (JSON):**

```json
{
  "timestamp": "2025-08-23 02:44:35",
  "level": "info",
  "message": "Server started successfully",
  "environment": "development",
  "port": "3000"
}
```

## Environment Configuration

### Development

- Log level: `debug`
- Console output: Colorized, detailed
- File output: All levels with daily rotation
- HTTP logging: Detailed format
- Rate limiting: 1000 requests per 15 minutes

### Production

- Log level: `warn`
- Console output: Minimal
- File output: Error and warn levels with daily rotation
- HTTP logging: Concise format, errors only
- Rate limiting: 100 requests per 15 minutes

## Rate Limiting Configuration

### Rate Limiter Types

1. **General Limiter**: 100 requests per 15 minutes
   - Applied to all routes by default
   - Suitable for most API endpoints

2. **Strict Limiter**: 5 requests per 15 minutes
   - For sensitive operations
   - Admin panels, critical operations

3. **Auth Limiter**: 10 requests per 15 minutes
   - For authentication endpoints
   - Login, register, password reset

4. **Development Limiter**: 1000 requests per 15 minutes
   - More lenient for development
   - Applied automatically in development environment

### Rate Limit Headers

The system returns standard rate limit headers:

- `RateLimit-Limit`: Maximum requests allowed
- `RateLimit-Remaining`: Remaining requests in window
- `RateLimit-Reset`: Time when the limit resets

## Monitoring and Analysis

### Log Analysis Tools

The JSON log format is compatible with:

- ELK Stack (Elasticsearch, Logstash, Kibana)
- Splunk
- CloudWatch
- Datadog
- Custom log analysis scripts

### Key Metrics to Monitor

1. **Error Rates**: Track error frequency and types
2. **Response Times**: Monitor API performance
3. **Slow Requests**: Identify performance bottlenecks
4. **Request Patterns**: Understand usage patterns
5. **Rate Limit Violations**: Monitor abuse attempts
6. **System Health**: Monitor application startup/shutdown

## Best Practices

### Logging Guidelines

1. **Use appropriate log levels**:
   - `error`: Application errors that need immediate attention
   - `warn`: Issues that don't break functionality but need monitoring
   - `info`: General application flow and important events
   - `http`: HTTP request/response logging
   - `debug`: Detailed debugging information

2. **Include context**: Always include relevant metadata
3. **Avoid sensitive data**: Never log passwords, tokens, or PII
4. **Structured logging**: Use JSON format for machine readability
5. **Performance**: Avoid expensive operations in logging

### Rate Limiting Guidelines

1. **Choose appropriate limits**: Match limits to endpoint sensitivity
2. **Monitor violations**: Track rate limit violations for security
3. **Provide clear messages**: Give users helpful error messages
4. **Use different limits**: Apply stricter limits to sensitive operations
5. **Log violations**: Always log rate limit violations for analysis

### Error Handling

1. **Use AppError for application errors**: Provides consistent error structure
2. **Wrap async routes**: Use `asyncHandler` for automatic error catching
3. **Log errors with context**: Include request details and stack traces
4. **Graceful degradation**: Handle errors without crashing the application

## Testing the Logging System

The application includes test routes to verify logging functionality:

- `GET /`: Normal request logging
- `GET /error`: Error generation and logging
- `GET /slow`: Performance monitoring test
- `GET /strict`: Strict rate limiting test (5 requests per 15 minutes)
- `POST /auth/login`: Auth rate limiting test (10 requests per 15 minutes)
- `POST /auth/register`: Auth rate limiting test (10 requests per 15 minutes)

## Deployment Considerations

1. **Log directory permissions**: Ensure the application can write to the logs directory
2. **Disk space**: Monitor log file sizes and implement log rotation
3. **Log aggregation**: Consider centralizing logs in production
4. **Security**: Ensure log files are not publicly accessible
5. **Backup**: Implement log backup strategies for compliance
6. **Rate limiting**: Configure appropriate limits for production traffic
7. **Monitoring**: Set up alerts for rate limit violations and errors

## Troubleshooting

### Common Issues

1. **Log files not created**: Check directory permissions
2. **High disk usage**: Review log rotation settings
3. **Missing logs**: Verify log level configuration
4. **Performance impact**: Monitor logging overhead
5. **Rate limit issues**: Check rate limit configuration
6. **Log rotation issues**: Verify daily rotate file settings

### Debug Commands

```bash
# View recent logs
tail -f logs/combined-2025-08-23.log

# View only errors
tail -f logs/error-2025-08-23.log

# Search for specific patterns
grep "ERROR" logs/combined-*.log

# Check log file sizes
ls -lh logs/

# Test rate limiting
for i in {1..10}; do curl http://localhost:3000/strict; done
```
