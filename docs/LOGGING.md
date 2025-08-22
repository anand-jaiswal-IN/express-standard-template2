# Logging System Documentation

This project implements a modern, robust logging system using Winston and Morgan for comprehensive application monitoring and debugging.

## Features

- **Multi-transport logging**: Console and file-based logging
- **Environment-specific configurations**: Different log levels and formats for development and production
- **HTTP request logging**: Detailed request/response logging with Morgan
- **Error tracking**: Comprehensive error logging with stack traces
- **Performance monitoring**: Slow request detection and timing
- **Structured logging**: JSON format for machine-readable logs
- **Log rotation**: Automatic log file rotation with size limits
- **Graceful shutdown**: Proper cleanup on application termination

## Architecture

### Winston Logger (`src/utils/logger.ts`)

The main logging configuration using Winston with the following features:

- **Custom log levels**: error, warn, info, http, debug
- **Colorized console output**: For development readability
- **JSON file output**: For production and analysis
- **Log rotation**: 5MB files with 5 file retention
- **Environment-based configuration**: Debug level in development, warn level in production

### Morgan HTTP Logging (`src/middlewares/logging.ts`)

HTTP request logging middleware with custom tokens:

- **Custom tokens**: IP address, user agent, response time, request body
- **Environment-specific formats**: Detailed logging in development, concise in production
- **Stream integration**: Direct integration with Winston logger

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

### Performance Monitoring

The system automatically monitors:

- Request response times
- Slow requests (>1 second)
- Error rates
- Request patterns

## Log Files

The system creates the following log files in the `logs/` directory:

- `error.log`: Only error-level messages
- `combined.log`: All log messages

### Log Format

**Console Output (Development):**

```
2024-01-15 10:30:45 [info]: Server started successfully
2024-01-15 10:30:46 [http]: GET /api/users 200 45ms - 192.168.1.1
```

**File Output (JSON):**

```json
{
  "timestamp": "2024-01-15 10:30:45",
  "level": "info",
  "message": "Server started successfully",
  "port": "9001",
  "environment": "development"
}
```

## Environment Configuration

### Development

- Log level: `debug`
- Console output: Colorized, detailed
- File output: All levels
- HTTP logging: Detailed format

### Production

- Log level: `warn`
- Console output: Minimal
- File output: Error and warn levels
- HTTP logging: Concise format, errors only

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
5. **System Health**: Monitor application startup/shutdown

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

## Deployment Considerations

1. **Log directory permissions**: Ensure the application can write to the logs directory
2. **Disk space**: Monitor log file sizes and implement log rotation
3. **Log aggregation**: Consider centralizing logs in production
4. **Security**: Ensure log files are not publicly accessible
5. **Backup**: Implement log backup strategies for compliance

## Troubleshooting

### Common Issues

1. **Log files not created**: Check directory permissions
2. **High disk usage**: Review log rotation settings
3. **Missing logs**: Verify log level configuration
4. **Performance impact**: Monitor logging overhead

### Debug Commands

```bash
# View recent logs
tail -f logs/combined.log

# View only errors
tail -f logs/error.log

# Search for specific patterns
grep "ERROR" logs/combined.log

# Check log file sizes
ls -lh logs/
```
