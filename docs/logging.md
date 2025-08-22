# Logging System Documentation

This project implements a comprehensive, production-ready logging system using **Winston** and **Morgan** for Express.js applications. The logging system provides structured logging, performance monitoring, error tracking, and request/response logging with environment-specific configurations.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Core Components](#core-components)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
- [Log Formats and Outputs](#log-formats-and-outputs)
- [Environment-Specific Behavior](#environment-specific-behavior)
- [Performance Monitoring](#performance-monitoring)
- [Error Handling and Logging](#error-handling-and-logging)
- [Rate Limiting Integration](#rate-limiting-integration)
- [Log File Management](#log-file-management)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Architecture Overview

The logging system is built with a modular architecture consisting of:

- **Winston Logger** (`src/utils/logger.ts`) - Core logging functionality
- **Morgan Middleware** (`src/middlewares/logging.ts`) - HTTP request logging
- **Error Handler** (`src/middlewares/errorHandler.ts`) - Structured error logging
- **Performance Monitor** (`src/middlewares/middlewares.ts`) - Request timing and slow request detection
- **Rate Limiting** (`src/middlewares/rateLimit.ts`) - Rate limit violation logging

## Core Components

### 1. Winston Logger (`src/utils/logger.ts`)

The central logging service with the following features:

#### Log Levels

```typescript
const levels = {
  error: 0, // Critical errors requiring immediate attention
  warn: 1, // Warning conditions that should be monitored
  info: 2, // General application flow information
  http: 3, // HTTP request/response logging
  debug: 4, // Detailed debugging information
};
```

#### Transports

- **Console Transport**: Colorized output for development
- **Daily Rotate Files**: Automatic daily log rotation with compression
  - `logs/error-YYYY-MM-DD.log` - Error-level logs only
  - `logs/combined-YYYY-MM-DD.log` - All log levels

#### Log Rotation Configuration

```typescript
// Daily rotation settings
{
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',      // Keep logs for 14 days
  maxSize: '20m',       // 20MB max file size
  zippedArchive: true,  // Compress old logs
}
```

### 2. HTTP Request Logging (`src/middlewares/logging.ts`)

Morgan middleware with custom tokens for enhanced HTTP logging:

#### Custom Tokens

- `body` - Request body for POST/PUT/PATCH requests
- `response-time-ms` - Response time with 'ms' suffix
- `user-agent` - Client user agent string
- `ip` - Client IP address (proxy-aware)

#### Environment-Specific Formats

- **Development**: `:method :url :status :response-time-ms - :ip - :user-agent`
- **Production**: `:method :url :status :response-time-ms - :ip`

### 3. Error Handling (`src/middlewares/errorHandler.ts`)

Comprehensive error handling with structured logging:

#### AppError Class

```typescript
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
  }
}
```

#### Error Context Logging

Each error is logged with complete context:

- Error details (message, name, stack trace)
- Request information (method, URL, IP, user agent)
- Request data (body, params, query parameters)

### 4. Performance Monitoring (`src/middlewares/middlewares.ts`)

Automatic performance monitoring with:

- Request timing measurement
- Slow request detection (>1 second)
- Request/response logging
- Performance warnings

## Configuration

### Environment Variables

The logging system adapts based on `NODE_ENV`:

```bash
# Development (default)
NODE_ENV=development

# Production
NODE_ENV=production

# Custom port
PORT=3000
```

### Log Levels by Environment

| Environment | Console Level | File Level         | HTTP Logging             |
| ----------- | ------------- | ------------------ | ------------------------ |
| Development | `debug`       | All levels         | Errors only (skip < 400) |
| Production  | `warn`        | `warn` and `error` | All requests             |
| Other       | `warn`        | All levels         | All requests             |

## Usage Examples

### Basic Logging

```typescript
import logger from '#utils/logger.js';

// Different log levels
logger.error('Database connection failed', {
  error: err.message,
  database: 'mongodb://localhost',
});

logger.warn('High memory usage detected', {
  usage: '85%',
  threshold: '80%',
});

logger.info('User registration completed', {
  userId: '12345',
  email: 'user@example.com',
});

logger.http('API request processed', {
  method: 'POST',
  endpoint: '/api/users',
  responseTime: '245ms',
});

logger.debug('Cache lookup result', {
  key: 'user:12345',
  hit: true,
  ttl: 3600,
});
```

### Error Handling with Context

```typescript
import { AppError, asyncHandler } from '#middlewares/errorHandler.js';

// Custom application error
const createUser = asyncHandler(async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email });

  if (existingUser) {
    throw new AppError('User already exists', 409);
  }

  const user = await User.create(req.body);
  res.status(201).json({ user });
});

// Route with automatic error handling
app.post('/users', createUser);
```

### Request/Response Logging

```typescript
// Automatic logging for all requests
app.use(requestLogger); // Logs incoming requests
app.use(morganMiddleware); // HTTP request logging
app.use(responseLogger); // Logs outgoing responses
```

### Performance Monitoring

```typescript
// Automatic slow request detection
app.use(performanceMonitor);

// Manual performance logging
const startTime = Date.now();
await someExpensiveOperation();
const duration = Date.now() - startTime;

logger.info('Operation completed', {
  operation: 'dataProcessing',
  duration: `${duration}ms`,
  recordsProcessed: 1000,
});
```

## Log Formats and Outputs

### Console Output (Development)

```
14:32:15 [info]: Server started successfully | environment=development port=3000
14:32:16 [info]: Incoming request | ip=::1 method=GET url=/ userAgent=curl/8.14.1
14:32:16 [http]: GET / 200 15ms - ::1 - curl/8.14.1
14:32:16 [warn]: Slow request detected | duration=1205ms ip=::1 method=GET url=/slow
```

### File Output (JSON Format)

```json
{
  "timestamp": "2024-01-15 14:32:15",
  "level": "info",
  "message": "Server started successfully",
  "environment": "development",
  "port": "3000"
}

{
  "timestamp": "2024-01-15 14:32:16",
  "level": "error",
  "message": "Database connection failed",
  "error": {
    "message": "Connection timeout",
    "name": "MongoTimeoutError",
    "stack": "MongoTimeoutError: Connection timeout\n    at Connection.open..."
  },
  "request": {
    "method": "POST",
    "url": "/api/users",
    "ip": "192.168.1.100",
    "userAgent": "Mozilla/5.0..."
  }
}
```

## Environment-Specific Behavior

### Development Environment

- **Console Logging**: Full debug output with colors
- **File Logging**: All levels to combined log, errors to error log
- **HTTP Logging**: Only errors and warnings (status >= 400)
- **Rate Limiting**: 1000 requests per 15 minutes
- **Error Details**: Full stack traces in responses

### Production Environment

- **Console Logging**: Warnings and errors only
- **File Logging**: Warnings and errors only
- **HTTP Logging**: All requests with concise format
- **Rate Limiting**: 100 requests per 15 minutes
- **Error Details**: No stack traces in responses

## Performance Monitoring

### Automatic Monitoring

The system automatically monitors and logs:

1. **Request Timing**: All request durations
2. **Slow Requests**: Requests taking >1 second
3. **Response Status**: HTTP status codes
4. **Client Information**: IP addresses and user agents

### Performance Metrics Logged

```typescript
// Slow request warning
logger.warn('Slow request detected', {
  duration: '1205ms',
  ip: '192.168.1.100',
  method: 'GET',
  url: '/api/heavy-operation',
});

// Response timing
logger.info('Outgoing response', {
  method: 'POST',
  url: '/api/users',
  statusCode: 201,
  responseTime: 245,
});
```

## Error Handling and Logging

### Error Types Handled

1. **Application Errors** (`AppError`)
2. **Mongoose Errors** (CastError, ValidationError)
3. **JWT Errors** (JsonWebTokenError, TokenExpiredError)
4. **System Errors** (Uncaught exceptions, unhandled rejections)

### Error Logging Structure

```typescript
logger.error('Error occurred:', {
  error: {
    message: 'User not found',
    name: 'AppError',
    stack: 'AppError: User not found\n    at...',
  },
  request: {
    method: 'GET',
    url: '/api/users/12345',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0...',
    body: {},
    params: { id: '12345' },
    query: {},
  },
});
```

## Rate Limiting Integration

### Rate Limiter Types

1. **General Limiter**: 100 requests/15 minutes (production)
2. **Development Limiter**: 1000 requests/15 minutes
3. **Strict Limiter**: 5 requests/15 minutes (sensitive routes)
4. **Auth Limiter**: 10 requests/15 minutes (authentication)

### Rate Limit Violation Logging

```typescript
logger.warn('Rate limit exceeded', {
  ip: '192.168.1.100',
  method: 'POST',
  url: '/api/sensitive-operation',
  userAgent: 'curl/8.14.1',
});
```

## Log File Management

### File Structure

```
logs/
├── combined-2024-01-15.log     # All logs for today
├── combined-2024-01-14.log.gz  # Previous day (compressed)
├── error-2024-01-15.log        # Error logs for today
├── error-2024-01-14.log.gz     # Previous day errors (compressed)
└── ...
```

### Rotation Policy

- **Daily Rotation**: New files created daily at midnight
- **Compression**: Old files automatically compressed
- **Retention**: Logs kept for 14 days
- **Size Limits**: 20MB maximum file size before rotation

### Monitoring Log Files

```bash
# View recent logs
tail -f logs/combined-$(date +%Y-%m-%d).log

# View recent errors
tail -f logs/error-$(date +%Y-%m-%d).log

# Search for specific patterns
grep "ERROR" logs/combined-*.log | tail -20

# Monitor log file sizes
ls -lh logs/
```

## Best Practices

### Logging Guidelines

1. **Use Appropriate Log Levels**

   ```typescript
   // ❌ Don't use info for errors
   logger.info('Database connection failed');

   // ✅ Use appropriate level
   logger.error('Database connection failed', { error: err });
   ```

2. **Include Contextual Information**

   ```typescript
   // ❌ Minimal context
   logger.error('User not found');

   // ✅ Rich context
   logger.error('User not found', {
     userId: req.params.id,
     operation: 'getUserProfile',
     ip: req.ip,
   });
   ```

3. **Avoid Logging Sensitive Data**

   ```typescript
   // ❌ Don't log sensitive information
   logger.info('User login', { password: req.body.password });

   // ✅ Log safely
   logger.info('User login attempt', {
     email: req.body.email,
     ip: req.ip,
   });
   ```

4. **Structure Your Logs**
   ```typescript
   // ✅ Consistent structure
   logger.info('Operation completed', {
     operation: 'userRegistration',
     userId: newUser.id,
     duration: `${Date.now() - startTime}ms`,
     success: true,
   });
   ```

### Performance Considerations

1. **Avoid Expensive Operations in Logging**
2. **Use Appropriate Log Levels in Production**
3. **Monitor Log File Sizes**
4. **Consider Log Aggregation for Scale**

## Troubleshooting

### Common Issues

#### 1. Log Files Not Created

```bash
# Check directory permissions
ls -la logs/

# Create logs directory if missing
mkdir -p logs
chmod 755 logs
```

#### 2. High Disk Usage

```bash
# Check log file sizes
du -sh logs/*

# Manual cleanup if needed
find logs/ -name "*.log.gz" -mtime +14 -delete
```

#### 3. Missing Logs

```bash
# Check log level configuration
echo $NODE_ENV

# Verify logger configuration
node -e "console.log(require('./dist/utils/logger.js').default.level)"
```

#### 4. Performance Issues

```bash
# Monitor log file I/O
iostat -x 1

# Check slow requests
grep "Slow request" logs/combined-*.log
```

### Debug Commands

```bash
# Test logging endpoints
curl http://localhost:3000/          # Normal request
curl http://localhost:3000/error     # Error generation
curl http://localhost:3000/slow      # Slow request test

# Test rate limiting
for i in {1..10}; do curl http://localhost:3000/limiter/strict; done

# View real-time logs
tail -f logs/combined-$(date +%Y-%m-%d).log | jq '.'

# Analyze error patterns
grep -E '"level":"error"' logs/combined-*.log | jq '.message' | sort | uniq -c
```

### Log Analysis

#### Using jq for JSON Log Analysis

```bash
# Filter by log level
cat logs/combined-2024-01-15.log | jq 'select(.level == "error")'

# Extract error messages
cat logs/combined-2024-01-15.log | jq -r 'select(.level == "error") | .message'

# Analyze request patterns
cat logs/combined-2024-01-15.log | jq -r 'select(.method) | "\(.method) \(.url)"' | sort | uniq -c

# Find slow requests
cat logs/combined-2024-01-15.log | jq 'select(.duration and (.duration | tonumber) > 1000)'
```

## Integration with External Tools

### ELK Stack Integration

The JSON log format is compatible with Elasticsearch/Logstash/Kibana for advanced log analysis and visualization.

### Monitoring Tools

- **Datadog**: Direct log ingestion
- **CloudWatch**: AWS log streaming
- **Splunk**: Log forwarding
- **Grafana**: Metrics and alerting

This logging system provides a solid foundation for monitoring, debugging, and maintaining Express.js applications in both development and production environments.
